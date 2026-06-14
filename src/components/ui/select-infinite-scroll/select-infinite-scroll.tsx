'use client'

import React, { useCallback, useEffect, useRef, useState } from 'react'

import { Icon } from '@/components/icon'

import { cn } from '@/lib/cn'

import { useInfiniteCustomQuery } from '@/hooks/use-infinite-custom-query'
import { useIsMobile } from '@/hooks/use-mobile'

import { Loader } from '@/components/ui/loader'

import { Drawer, DrawerContent } from '@/components/internal/drawer'
import { Input } from '@/components/internal/input'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'

export interface SelectInfiniteScrollProps<T extends object> {
  search?: boolean

  value: string
  onValueChange: (value: string) => void
  /** Fires when the resolved selected item changes (including when cleared). */
  onSelectedItemChange?: (item: T | null) => void
  disabled?: boolean

  id?: string
  className?: string

  enabled?: boolean
  queryKey: (string | undefined)[]
  queryFn: (params: { pageParam?: unknown; search: string }) => Promise<T[]>
  options?: Record<string, unknown>

  getItemValue: (item: T) => string
  renderItem: (item: T, isSelected: boolean) => React.ReactNode
  renderSelectedValue?: (item: T) => React.ReactNode

  placeholder?: string
  searchPlaceholder?: string
  emptyText?: string
  contentTitle?: string
}

function SelectInfiniteScroll<T extends object>({
  value,
  onValueChange,
  onSelectedItemChange,
  disabled = false,
  search: searchProp = false,
  id,
  className,
  queryKey,
  queryFn,
  enabled = true,
  options,
  getItemValue,
  renderItem,
  renderSelectedValue,
  placeholder,
  searchPlaceholder = 'Search…',
  emptyText = 'No results found.',
  contentTitle,
}: SelectInfiniteScrollProps<T>) {
  const isMobile = useIsMobile()

  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState('')

  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [selectedItem, setSelectedItem] = useState<T | null>(null)

  const scrollableRef = useRef<HTMLDivElement>(null)
  const searchInputRef = useRef<HTMLInputElement>(null)
  const onSelectedItemChangeRef = useRef(onSelectedItemChange)
  onSelectedItemChangeRef.current = onSelectedItemChange

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isFetching,
  } = useInfiniteCustomQuery<T>({
    queryKey: debouncedSearch ? [...queryKey, debouncedSearch] : queryKey,
    queryFn: ({ pageParam }) => queryFn({ pageParam, search: debouncedSearch }),
    enabled,
    options,
  })

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget

    if (
      scrollHeight - scrollTop - clientHeight < 100 &&
      hasNextPage &&
      !isFetchingNextPage
    ) {
      fetchNextPage()
    }
  }

  const handleSelect = useCallback(
    (item: T) => {
      onValueChange(getItemValue(item))
      setSelectedItem(item)
      setOpen(false)
      setSearch('')
    },
    [onValueChange, getItemValue],
  )

  const handleOpenChange = useCallback((next: boolean) => {
    setOpen(next)
    if (!next) setSearch('')
  }, [])

  const isPlaceholder = !selectedItem

  const triggerClassName = cn(
    'border-transparent text-foreground flex h-12 w-full items-center justify-between gap-2 rounded-xl bg-input px-4 py-2',
    'transition-[color] disabled:cursor-not-allowed disabled:opacity-75',
    'focus-visible:border-transparent focus-visible:ring-ring/50 focus-visible:ring-[3px] cursor-pointer outline-none',
    isPlaceholder && 'text-muted-foreground/50',
    !isPlaceholder && 'pl-2',
    className,
  )

  const TriggerBody = (
    <>
      <span className="flex-1 min-w-0 truncate text-left flex items-center gap-2">
        {selectedItem
          ? (renderSelectedValue?.(selectedItem) ?? getItemValue(selectedItem))
          : placeholder}
      </span>

      {isFetching && !open ? (
        <span className="size-4 border-2 border-muted-foreground/30 border-t-muted-foreground rounded-full animate-spin shrink-0" />
      ) : (
        <Icon
          name="ChevronDown"
          size={16}
          className="text-muted-foreground/80 shrink-0 ml-auto"
        />
      )}
    </>
  )

  const DropdownContent = (
    <>
      {searchProp && (
        <div className="p-2 relative">
          <Icon
            name="Magnifier"
            className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none size-4 z-1"
          />

          <Input
            ref={searchInputRef}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={searchPlaceholder}
            className="px-11 h-12 sm:h-10 text-sm"
            autoComplete="off"
          />

          {search && (
            <button
              type="button"
              onClick={() => setSearch('')}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors p-2 hover:bg-muted rounded-lg"
            >
              <Icon name="Xmark" size={13} />
            </button>
          )}
        </div>
      )}

      <div
        ref={scrollableRef}
        onScroll={handleScroll}
        onWheel={(e) => e.stopPropagation()}
        className="overflow-y-auto max-h-64 p-1"
      >
        {isLoading ? (
          <Loader className="flex items-center justify-center p-2 lg:p-4" />
        ) : data.length === 0 ? (
          <p className="text-center text-muted-foreground text-sm py-6 px-2">
            {emptyText}
          </p>
        ) : (
          <>
            {data.map((item) => {
              const itemValue = getItemValue(item)
              const isSelected = value === itemValue

              return (
                <button
                  key={itemValue}
                  type="button"
                  className={cn(
                    'relative flex w-full cursor-pointer items-center p-2.5 rounded-lg outline-none select-none',
                    'transition-colors',
                    isSelected
                      ? 'bg-muted text-foreground'
                      : 'text-muted-foreground hover:bg-muted hover:text-foreground',
                  )}
                  onClick={() => handleSelect(item)}
                >
                  {renderItem(item, isSelected)}
                </button>
              )
            })}

            {isFetchingNextPage && (
              <div className="py-2">
                <Loader variant="clean" />
              </div>
            )}
          </>
        )}
      </div>
    </>
  )

  useEffect(() => {
    if (!value) {
      setSelectedItem(null)
      return
    }

    if (selectedItem && getItemValue(selectedItem) === value) return

    const found = data.find((item) => getItemValue(item) === value)
    if (found) setSelectedItem(found)
  }, [value, data, selectedItem, getItemValue])

  useEffect(() => {
    onSelectedItemChangeRef.current?.(selectedItem)
  }, [selectedItem])

  useEffect(() => {
    if (open) {
      const timer = setTimeout(() => searchInputRef.current?.focus(), 50)
      return () => clearTimeout(timer)
    }
  }, [open])

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 300)
    return () => clearTimeout(timer)
  }, [search])

  if (isMobile) {
    return (
      <>
        <button
          id={id}
          type="button"
          disabled={disabled}
          onClick={() => !disabled && handleOpenChange(true)}
          className={triggerClassName}
        >
          {TriggerBody}
        </button>

        <Drawer open={open} onOpenChange={handleOpenChange} direction="bottom">
          <DrawerContent
            title={contentTitle ?? placeholder ?? 'Select'}
            showDivider
          >
            <div className="pb-6">{DropdownContent}</div>
          </DrawerContent>
        </Drawer>
      </>
    )
  }

  return (
    <Popover open={open} onOpenChange={handleOpenChange}>
      <PopoverTrigger asChild disabled={disabled}>
        <button id={id} type="button" className={triggerClassName}>
          {TriggerBody}
        </button>
      </PopoverTrigger>

      <PopoverContent
        align="start"
        sideOffset={4}
        className={cn(
          'p-0 rounded-xl border-transparent glass-popover text-popover-foreground shadow-md',
          'data-[state=open]:animate-in data-[state=closed]:animate-out',
          'data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0',
          'data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95',
        )}
        style={{ width: 'var(--radix-popover-trigger-width)' }}
      >
        {DropdownContent}
      </PopoverContent>
    </Popover>
  )
}

export { SelectInfiniteScroll }
