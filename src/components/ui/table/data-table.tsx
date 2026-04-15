'use client'

import * as React from 'react'

import { flexRender, type Table as TableType } from '@tanstack/react-table'

import { AnimatePresence, motion } from 'motion/react'

import { cn } from '@/lib/cn'

import { useIsMobile } from '@/hooks/use-mobile'

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { DataTablePagination } from '@/components/ui/table/data-table-pagination'

interface CursorPaginationMeta {
  hasNext?: boolean
  hasPrevious?: boolean
  limit?: number
}

interface DataTableProps<TData> extends React.HTMLAttributes<HTMLDivElement> {
  table: TableType<TData>
  children?: React.ReactNode
  emptyMessage?: string
  cursorMeta?: CursorPaginationMeta
  onNavigate?: (direction: 'next' | 'previous') => void
  showPagination?: boolean
  // isLoading?: boolean
}

export function DataTable<TData>({
  table,
  children,
  className,
  cursorMeta,
  onNavigate,
  showPagination = true,
  // isLoading,
  emptyMessage,
  ...props
}: DataTableProps<TData>) {
  const isMobile = useIsMobile()

  const scrollRef = React.useRef<HTMLDivElement>(null)
  const [showShadow, setShowShadow] = React.useState(false)

  React.useEffect(() => {
    const el = scrollRef.current
    if (!el) return

    const check = () => {
      const isScrollable = el.scrollWidth > el.clientWidth + 2
      const isAtEnd = el.scrollLeft + el.clientWidth >= el.scrollWidth - 2
      setShowShadow(isScrollable && !isAtEnd)
    }

    check()
    el.addEventListener('scroll', check, { passive: true })
    const ro = new ResizeObserver(check)
    ro.observe(el)

    return () => {
      el.removeEventListener('scroll', check)
      ro.disconnect()
    }
  }, [])

  const defaultEmptyMessage = emptyMessage || 'noResults'

  const rows = table.getRowModel().rows

  return (
    <div className={cn('space-y-4', className)} {...props}>
      {children}

      <div ref={scrollRef} className="rounded-2xl bg-card overflow-x-auto">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow
                key={headerGroup.id}
                className="border-border/25 bg-card!"
              >
                {headerGroup.headers.map((header, index) => {
                  const isLast = index === headerGroup.headers.length - 1
                  const shouldSticky = isLast && isMobile && showShadow

                  return (
                    <TableHead
                      key={header.id}
                      className={cn(
                        'max-w-xl text-nowrap whitespace-nowrap overflow-hidden text-ellipsis transition-colors',
                        shouldSticky &&
                          'sticky right-0 bg-card z-20 shadow-[-10px_0_15px_-3px_rgba(0,0,0,0.1),-4px_0_6px_-2px_rgba(0,0,0,0.05)] border-l border-border/10 pr-4',
                      )}
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>

          <TableBody>
            <AnimatePresence>
              {rows?.length ? (
                rows.map((row, rowIndex) => {
                  const isLastRow = rowIndex === rows.length - 1

                  return (
                    <motion.tr
                      key={row.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{
                        duration: 0.2,
                        delay: rowIndex * 0.05,
                        ease: 'easeOut',
                      }}
                      data-state={row.getIsSelected() && 'selected'}
                      className="group border-b border-border/50 transition-colors odd:bg-accent/15 even:bg-accent/50 hover:bg-accent data-[state=selected]:bg-card touch-callout-none transition-none"
                      onContextMenu={(e) => {
                        const trigger = e.currentTarget.querySelector(
                          '[data-action-group-trigger]',
                        ) as HTMLElement | null

                        if (trigger) {
                          e.preventDefault()
                          trigger.click()
                        }
                      }}
                      onTouchStart={(e) => {
                        const el = e.currentTarget

                        const timer = window.setTimeout(() => {
                          const trigger = el.querySelector(
                            '[data-action-group-trigger]',
                          ) as HTMLElement | null

                          if (trigger) trigger.click()
                        }, 500)

                        ;(el as any)._longPressTimer = timer
                      }}
                      onTouchEnd={(e) => {
                        window.clearTimeout(
                          (e.currentTarget as any)._longPressTimer,
                        )
                      }}
                      onTouchMove={(e) => {
                        window.clearTimeout(
                          (e.currentTarget as any)._longPressTimer,
                        )
                      }}
                    >
                      {row.getVisibleCells().map((cell, cellIndex) => {
                        const isLast =
                          cellIndex === row.getVisibleCells().length - 1

                        const shouldSticky = isLast && isMobile && showShadow

                        return (
                          <TableCell
                            key={cell.id}
                            className={cn(
                              'h-12 max-w-xl text-nowrap whitespace-nowrap overflow-hidden text-ellipsis',
                              shouldSticky &&
                                cn(
                                  'sticky right-0 bg-card z-20 shadow-[-10px_0_15px_-3px_rgba(0,0,0,0.1),-4px_0_6px_-2px_rgba(0,0,0,0.05)] border-l border-border/10 pr-4',
                                  isLastRow && 'rounded-br-2xl',
                                ),
                            )}
                          >
                            {flexRender(
                              cell.column.columnDef.cell,
                              cell.getContext(),
                            )}
                          </TableCell>
                        )
                      })}
                    </motion.tr>
                  )
                })
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={table.getAllColumns().length}
                    className="h-24 text-center text-card-foreground"
                  >
                    {defaultEmptyMessage}
                  </TableCell>
                </TableRow>
              )}
            </AnimatePresence>
          </TableBody>
        </Table>
      </div>

      {showPagination && (
        <DataTablePagination
          table={table}
          cursorMeta={cursorMeta}
          onNavigate={onNavigate}
        />
      )}
    </div>
  )
}
