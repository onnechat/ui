'use client'

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'

import { Icon } from '@/components/icon'

import { cn } from '@/lib/cn'

import { useIsMobile } from '@/hooks/use-mobile'

import { Loader } from '@/components/ui/loader'

import { Drawer, DrawerContent } from '@/components/internal/drawer'
import { Input } from '@/components/internal/input'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/internal/popover'

import { Icon } from '@/components/icon'

export interface SelectMultiProps<T extends object> {
  values: string[]
  onValuesChange: (values: string[]) => void
  options?: T[]
  isLoading?: boolean
  disabled?: boolean
  id?: string
  className?: string
  getItemValue: (item: T) => string
  renderItem: (item: T, isSelected: boolean) => React.ReactNode
  getBadgeLabel?: (item: T) => string
  filterFn?: (item: T, search: string) => boolean
  placeholder?: string
  searchPlaceholder?: string
  emptyText?: string
  contentTitle?: string
}

function SelectMulti<T extends object>({
  values,
  onValuesChange,
  options = [],
  isLoading = false,
  disabled = false,
  id,
  className,
  getItemValue,
  renderItem,
  getBadgeLabel,
  filterFn,
  placeholder = 'Select…',
  searchPlaceholder = 'Search…',
  emptyText = 'No results found.',
  contentTitle,
}: SelectMultiProps<T>) {
  const isMobile = useIsMobile()
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState('')

  const searchInputRef = useRef<HTMLInputElement>(null)

  const handleOpenChange = useCallback((next: boolean) => {
    setOpen(next)
    if (!next) setSearch('')
  }, [])

  const toggle = useCallback(
    (itemValue: string) => {
      onValuesChange(
        values.includes(itemValue)
          ? values.filter((v) => v !== itemValue)
          : [...values, itemValue],
      )
    },
    [values, onValuesChange],
  )

  const filteredOptions = useMemo(() => {
    if (!search) return options
    const lower = search.toLowerCase()

    return options.filter((item) =>
      filterFn
        ? filterFn(item, lower)
        : getItemValue(item).toLowerCase().includes(lower),
    )
  }, [options, search, filterFn, getItemValue])

  const selectedItems = useMemo(
    () => options.filter((item) => values.includes(getItemValue(item))),
    [options, values, getItemValue],
  )

  useEffect(() => {
    if (open) {
      const timer = setTimeout(() => searchInputRef.current?.focus(), 50)
      return () => clearTimeout(timer)
    }
  }, [open])

  const hasValues = values.length > 0

  const triggerClassName = cn(
    'border-transparent text-foreground flex min-h-12 w-full min-w-0 items-center justify-between gap-2 rounded-xl bg-input px-4 py-2',
    'transition-[color] disabled:cursor-not-allowed disabled:opacity-75',
    'focus-visible:border-transparent focus-visible:ring-ring/50 focus-visible:ring-[3px] cursor-pointer outline-none',
    !hasValues ? 'text-muted-foreground/50' : 'pl-2 pr-4',
    className,
  )

  const MAX_BADGES = 2

  const TriggerBody = (
    <>
      <div className="flex min-w-0 flex-1 flex-wrap items-start gap-2 text-left">
        {hasValues ? (
          <>
            {selectedItems.slice(0, MAX_BADGES).map((item) => {
              const itemValue = getItemValue(item)
              const label = getBadgeLabel?.(item) ?? itemValue

              return (
                <span
                  key={itemValue}
                  className="inline-flex max-w-full min-w-0 items-start gap-1 rounded-md bg-muted px-2 py-1 text-sm font-medium text-foreground"
                >
                  <span className="min-w-0 flex-1 text-left leading-snug wrap-break-word">
                    {label}
                  </span>

                  <div
                    role="button"
                    tabIndex={0}
                    className="mt-0.5 shrink-0 hover:text-destructive transition-colors"
                    onClick={(e) => {
                      e.stopPropagation()
                      toggle(itemValue)
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.stopPropagation()
                        toggle(itemValue)
                      }
                    }}
                  >
                    <Icon name="Xmark" size={10} />
                  </div>
                </span>
              )
            })}

            {selectedItems.length > MAX_BADGES && (
              <span className="mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-md bg-muted text-xs font-medium text-muted-foreground">
                +{selectedItems.length - MAX_BADGES}
              </span>
            )}
          </>
        ) : (
          <span>{placeholder}</span>
        )}
      </div>

      {isLoading ? (
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
      <div className="p-2">
        <div className="relative">
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
      </div>

      <div
        onWheel={(e) => e.stopPropagation()}
        className="max-h-64 overflow-y-auto overflow-x-hidden p-1"
      >
        {isLoading ? (
          <Loader className="flex items-center justify-center p-2 lg:p-4" />
        ) : filteredOptions.length === 0 ? (
          <p className="px-2 py-6 text-center text-sm text-muted-foreground">
            {emptyText}
          </p>
        ) : (
          filteredOptions.map((item) => {
            const itemValue = getItemValue(item)
            const isSelected = values.includes(itemValue)

            return (
              <button
                key={itemValue}
                type="button"
                className={cn(
                  'relative flex w-full min-w-0 cursor-pointer items-start gap-3 rounded-lg p-2.5 text-left outline-none select-none',
                  'transition-colors',
                  isSelected
                    ? 'bg-muted text-foreground'
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground',
                )}
                onClick={() => toggle(itemValue)}
              >
                <span
                  className={cn(
                    'mt-0.5 flex size-4 shrink-0 items-center justify-center rounded-sm border-2 transition-colors',
                    isSelected
                      ? 'border-primary bg-primary'
                      : 'border-muted-foreground/40',
                  )}
                  aria-hidden
                >
                  {isSelected && (
                    <Icon
                      name="Check"
                      className="size-2.5 text-primary-foreground"
                    />
                  )}
                </span>
                <span className="min-w-0 flex-1 text-left wrap-break-word">
                  {renderItem(item, isSelected)}
                </span>
              </button>
            )
          })
        )}
      </div>
    </>
  )

  if (isMobile) {
    return (
      <>
        <button
          id={id}
          type="button"
          disabled={disabled}
          className={triggerClassName}
          onClick={() => !disabled && handleOpenChange(true)}
        >
          {TriggerBody}
        </button>

        <Drawer open={open} onOpenChange={handleOpenChange} direction="bottom">
          <DrawerContent title={contentTitle ?? placeholder} showDivider>
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
          'min-w-0 overflow-x-hidden p-0 rounded-xl border-transparent glass-popover text-popover-foreground shadow-md',
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

export { SelectMulti }
