'use client'

import { useEffect, useMemo } from 'react'

import { ColumnDef } from '@tanstack/react-table'

import { cn } from '@/lib/cn'

import { useDataTable } from '@/hooks/use-data-table'

import { Checkbox } from '@/components/internal/checkbox'
import { DataTable } from '@/components/internal/table/data-table'
import { DataTableToolbar } from '@/components/internal/table/data-table-toolbar'

export const DATA_CUSTOM_TABLE_VARIANTS = ['default', 'inset'] as const
export const DEFAULT_DATA_CUSTOM_TABLE_VARIANT = 'default'

export type DataCustomTableVariant = (typeof DATA_CUSTOM_TABLE_VARIANTS)[number]

interface CursorPaginationMeta {
  hasNext?: boolean
  hasPrevious?: boolean
  limit?: number
  nextCursor?: string
  previousCursor?: string
}

type DataCustomTableProps<T> = {
  isLoading: boolean
  data: T[]
  columns: ColumnDef<T>[]
  totalItems?: number
  variant?: DataCustomTableVariant
  pageSizeOptions?: number[]
  cursorMeta?: CursorPaginationMeta
  onPaginationChange?: (
    page: number,
    limit: number,
    cursor?: string | null,
    direction?: 'next' | 'previous',
  ) => void
  onRowSelectionChange?: (selectedRows: T[]) => void
  rowSelection?: Record<string, boolean>
  onRowSelectionStateChange?: (rowSelection: Record<string, boolean>) => void
  emptyMessage?: string
  showIndexCol?: boolean
  showCheckboxCol?: boolean
  showPagination?: boolean
}

export function DataCustomTable<T>({
  isLoading = true,
  data,
  columns = [],
  totalItems,
  variant = DEFAULT_DATA_CUSTOM_TABLE_VARIANT,
  pageSizeOptions = [10, 20, 30, 40, 50, 100],
  cursorMeta,
  onPaginationChange,
  onRowSelectionChange,
  rowSelection,
  onRowSelectionStateChange,
  emptyMessage,
  showIndexCol = false,
  showCheckboxCol = false,
  showPagination = true,
}: DataCustomTableProps<T>) {

  const idColumn: ColumnDef<T> = useMemo(
    () => ({
      id: 'index',
      header: '#',
      cell: (info) => info.row.index + 1,
      enableSorting: false,
      enableHiding: false,
    }),
    [],
  )

  const checkboxColumn: ColumnDef<T> = useMemo(
    () => ({
      id: 'select',
      header: ({ table }) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && 'indeterminate')
          }
          onCheckedChange={(value: boolean | 'indeterminate') =>
            table.toggleAllPageRowsSelected(!!value)
          }
          aria-label={'selectAll'}
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value: boolean | 'indeterminate') =>
            row.toggleSelected(!!value)
          }
          aria-label={'selectRow'}
        />
      ),
      enableSorting: false,
      enableHiding: false,
    }),
    [],
  )

  const tableColumns = useMemo(
    () => [
      ...(showCheckboxCol ? [checkboxColumn] : []),
      ...(showIndexCol ? [idColumn] : []),
      ...columns,
    ],
    [showCheckboxCol, showIndexCol, columns, checkboxColumn, idColumn],
  )

  const {
    table,
    goToNextPage,
    goToPreviousPage,
    hasNextPage,
    hasPreviousPage,
  } = useDataTable({
    data,
    columns: tableColumns,
    rowCount: totalItems ?? data.length,
    onPaginationChange: onPaginationChange
      ? (limit, cursor, direction) => {
        onPaginationChange(1, limit, cursor, direction)
      }
      : undefined,
    defaultPerPage: pageSizeOptions[0],
    hasNextPage: cursorMeta?.hasNext ?? false,
    hasPreviousPage: cursorMeta?.hasPrevious ?? false,
    nextCursor: cursorMeta?.nextCursor ?? null,
    previousCursor: cursorMeta?.previousCursor ?? null,
    rowSelection,
    onRowSelectionChange: onRowSelectionStateChange,
  })

  const rowSelectionState = table.getState().rowSelection

  const handleNavigate = (direction: 'next' | 'previous') => {
    if (direction === 'next') {
      goToNextPage()
    } else {
      goToPreviousPage()
    }
  }

  useEffect(() => {
    if (onRowSelectionChange) {
      const selectedRows = table
        .getFilteredSelectedRowModel()
        .rows.map((row) => row.original)

      onRowSelectionChange(selectedRows as T[])
    }
  }, [rowSelectionState, onRowSelectionChange, table])


  return (
    <div
      suppressHydrationWarning
      className={cn(
        'space-y-6 w-full',
        isLoading && 'overflow-hidden',
        variant === 'inset' && 'bg-card border rounded-xl p-6',
      )}
    >
      <DataTable
        table={table}
        isLoading={isLoading}
        emptyMessage={emptyMessage}
        onNavigate={handleNavigate}
        showPagination={showPagination}
        cursorMeta={{
          ...cursorMeta,
          hasNext: hasNextPage,
          hasPrevious: hasPreviousPage,
        }}
      >
        <DataTableToolbar table={table} />
      </DataTable>
    </div>
  )
}

DataCustomTable.displayName = 'DataCustomTable'
