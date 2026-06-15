'use client'

import * as React from 'react'

import { Select as SelectPrimitive } from '@base-ui/react/select'

import { Icon } from '@/components/icon'

import { cn } from '@/lib/cn'

import { useHaptics } from '@/hooks/use-haptics'
import { useIsMobile } from '@/hooks/use-mobile'

import { Drawer, DrawerContent } from '@/components/ui/drawer'

/** Same option list is rendered twice on mobile (hidden Radix items + drawer). Clone so each tree is independent. */
function cloneSelectChildren(children: React.ReactNode, keySuffix: string) {
  return React.Children.map(children, (child, index) => {
    if (!React.isValidElement(child)) return child
    const baseKey = child.key != null ? String(child.key) : index
    return React.cloneElement(child, { key: `${baseKey}-${keySuffix}` })
  })
}

// Recursively extracts plain text from a React node tree (used for mobile label display)
function extractText(node: React.ReactNode): string {
  if (typeof node === 'string') return node
  if (typeof node === 'number') return String(node)
  if (Array.isArray(node)) return node.map(extractText).join('').trim()
  if (React.isValidElement(node))
    return extractText((node.props as { children?: React.ReactNode }).children)
  return ''
}

// 'interactive' → visible button inside the mobile Drawer
// 'desktop'     → Radix SelectPrimitive.Item (default; also used in hidden mobile content so native form options exist)
// 'discovery'   → handles label registration without rendering to DOM
type SelectItemMode = 'interactive' | 'desktop' | 'discovery'

const SelectItemModeContext = React.createContext<SelectItemMode>('desktop')

type SelectContextValue = {
  isMobile: boolean
  open: boolean
  onOpenChange: (open: boolean) => void
  value: string
  onValueChange: (value: string) => void
  itemLabels: Record<string, { text: string; node: React.ReactNode }>
  registerLabel: (value: string, label: React.ReactNode) => void
}

const SelectContext = React.createContext<SelectContextValue | null>(null)

function Select({
  value: valueProp,
  defaultValue,
  onValueChange: onValueChangeProp,
  open: openProp,
  onOpenChange: onOpenChangeProp,
  defaultOpen,
  children,
  ...props
}: Omit<React.ComponentProps<typeof SelectPrimitive.Root>, 'value' | 'defaultValue' | 'onValueChange' | 'onOpenChange' | 'children'> & {
  value?: string
  defaultValue?: string
  onValueChange?: (value: string) => void
  onOpenChange?: (open: boolean) => void
  children?: React.ReactNode
}) {
  const isMobile = useIsMobile()

  const [internalValue, setInternalValue] = React.useState(defaultValue ?? '')

  const valueFromParent =
    valueProp !== undefined && valueProp !== null && valueProp !== ''
      ? valueProp
      : undefined
  const value = valueFromParent ?? internalValue

  const [drawerOpen, setDrawerOpen] = React.useState(defaultOpen ?? false)
  const open = openProp ?? drawerOpen

  const [itemLabels, setItemLabels] = React.useState<
    Record<string, { text: string; node: React.ReactNode }>
  >({})
  const registerLabel = React.useCallback(
    (itemValue: string, label: React.ReactNode) => {
      const text = extractText(label)
      setItemLabels((prev) => {
        if (prev[itemValue]?.text === text) return prev
        return { ...prev, [itemValue]: { text, node: label } }
      })
    },
    [],
  )

  const handleOpenChange = React.useCallback(
    (isOpen: boolean) => {
      setDrawerOpen(isOpen)
      ;(onOpenChangeProp as (open: boolean) => void)?.(isOpen)
    },
    [onOpenChangeProp],
  )

  const handleValueChange = React.useCallback(
    (val: string) => {
      setInternalValue(val)
      ;(onValueChangeProp as (value: string) => void)?.(val)
      if (isMobile) handleOpenChange(false)
    },
    [onValueChangeProp, isMobile, handleOpenChange],
  )

  return (
    <SelectContext.Provider
      value={{
        isMobile,
        open,
        onOpenChange: handleOpenChange,
        value,
        onValueChange: handleValueChange,
        itemLabels,
        registerLabel,
      }}
    >
      <div className="hidden" aria-hidden="true">
        <SelectItemModeContext.Provider value="discovery">
          {children}
        </SelectItemModeContext.Provider>
      </div>

      <SelectPrimitive.Root
        open={isMobile ? false : open}
        onOpenChange={handleOpenChange as any}
        value={value}
        onValueChange={handleValueChange as any}
        {...props}
      >
        {children}
      </SelectPrimitive.Root>
    </SelectContext.Provider>
  )
}

function SelectGroup({
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Group>) {
  return <SelectPrimitive.Group data-slot="select-group" {...props} />
}

function SelectValue({
  className,
  placeholder,
  children,
  ...props
}: Omit<React.ComponentProps<typeof SelectPrimitive.Value>, 'children'> & {
  children?: React.ReactNode
}) {
  const ctx = React.useContext(SelectContext)

  const label = ctx && ctx.value ? ctx.itemLabels[ctx.value]?.node : undefined
  const content = children ?? label ?? placeholder

  if (ctx?.isMobile) {
    return (
      <span
        data-slot="select-value"
        className={cn(!content && 'text-muted-foreground/50', className)}
      >
        {content}
      </span>
    )
  }

  return (
    <SelectPrimitive.Value
      data-slot="select-value"
      className={cn('empty:text-muted-foreground/50', className)}
      placeholder={placeholder}
      {...props}
    >
      {content}
    </SelectPrimitive.Value>
  )
}

function SelectTrigger({
  className,
  children,
  removeIcon = false,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Trigger> & {
  removeIcon?: boolean
}) {
  const mode = React.useContext(SelectItemModeContext)
  const { trigger } = useHaptics()

  if (mode === 'discovery') {
    return null
  }

  return (
    <SelectPrimitive.Trigger
      suppressHydrationWarning
      data-slot="select-trigger"
      className={cn(
        'border-transparent text-foreground flex h-12 w-full items-center justify-between gap-2 rounded-xl bg-input px-4 py-2 transition-[color] disabled:cursor-not-allowed disabled:opacity-75 *:data-[slot=select-value]:flex *:data-[slot=select-value]:items-center *:data-[slot=select-value]:gap-2 *:data-[slot=select-value]:min-w-max [&_svg]:pointer-events-none [&_svg]:shrink-0 outline-none aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive data-placeholder:text-muted-foreground/50',
        'focus-visible:border-transparent focus-visible:aria-invalid:ring-destructive focus-visible:ring-ring/50 focus-visible:ring-[3px] cursor-pointer select-none',
        className,
      )}
      {...props}
      onClick={(e) => {
        trigger('click')
        props.onClick?.(e)
      }}
    >
      {children}

      {!removeIcon && (
        <SelectPrimitive.Icon>
          <Icon
            name="ChevronDown"
            size={16}
            className="text-muted-foreground/80 in-aria-invalid:text-destructive/80 shrink-0 ml-auto"
          />
        </SelectPrimitive.Icon>
      )}
    </SelectPrimitive.Trigger>
  )
}

function SelectContent({
  className,
  children,
  position = 'popper',
  align,
  side,
  ...props
}: Omit<React.ComponentProps<typeof SelectPrimitive.Popup>, 'children'> & {
  children?: React.ReactNode
  position?: 'popper' | 'item-aligned'
  align?: 'center' | 'end' | 'start'
  side?: 'bottom' | 'left' | 'right' | 'top'
}) {
  const ctx = React.useContext(SelectContext)
  const mode = React.useContext(SelectItemModeContext)

  if (mode === 'discovery') {
    return <>{children}</>
  }

  if (ctx?.isMobile) {
    return (
      <>
        <SelectPrimitive.Portal>
          <SelectPrimitive.Positioner align={align} side={side}>
            <SelectPrimitive.Popup
              className="hidden"
              aria-hidden
            >
              <SelectPrimitive.List>
                <SelectItemModeContext.Provider value="desktop">
                  {cloneSelectChildren(children, 'native')}
                </SelectItemModeContext.Provider>
              </SelectPrimitive.List>
            </SelectPrimitive.Popup>
          </SelectPrimitive.Positioner>
        </SelectPrimitive.Portal>

        <Drawer
          open={ctx.open}
          onOpenChange={ctx.onOpenChange}
          direction="bottom"
        >
          <DrawerContent title="Select" showDivider>
            <SelectItemModeContext.Provider value="interactive">
              <div className="overflow-y-auto p-2 pb-6">
                {cloneSelectChildren(children, 'drawer')}
              </div>
            </SelectItemModeContext.Provider>
          </DrawerContent>
        </Drawer>
      </>
    )
  }

  return (
    <SelectPrimitive.Portal>
      <SelectPrimitive.Positioner align={align}>
        <SelectPrimitive.Popup
          data-slot="select-content"
          className={cn(
            'border-transparent glass-popover p-1 text-popover-foreground data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 relative z-50 max-h-[min(24rem,var(--available-height))] min-w-32 overflow-hidden rounded-xl **:[[role=group]]:py-1 outline-none',
            position === 'popper' &&
              'min-w-(--anchor-width) data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1',
            className,
          )}
          {...props}
        >
          <SelectScrollUpButton />

          <SelectPrimitive.List className={cn(
            'p-1',
            position === 'popper' && 'h-(--anchor-height)',
          )}>
            {children}
          </SelectPrimitive.List>

          <SelectScrollDownButton />
        </SelectPrimitive.Popup>
      </SelectPrimitive.Positioner>
    </SelectPrimitive.Portal>
  )
}

function SelectLabel({
  className,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Label>) {
  return (
    <SelectPrimitive.Label
      data-slot="select-label"
      className={cn(
        'text-muted-foreground py-1.5 ps-8 pe-2 text-xs font-medium',
        className,
      )}
      {...props}
    />
  )
}

function SelectItem({
  className,
  children,
  value,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Item>) {
  const ctx = React.useContext(SelectContext)
  const mode = React.useContext(SelectItemModeContext)

  const { trigger } = useHaptics()

  React.useEffect(() => {
    if (ctx) {
      ctx.registerLabel(value, children)
    }
  }, [ctx, value, children])

  if (mode === 'discovery') {
    return null
  }

  if (mode === 'interactive') {
    const isSelected = ctx?.value === value
    return (
      <button
        type="button"
        data-slot="select-item"
        className={cn(
          'relative flex w-full cursor-pointer items-center gap-4 p-4 lg:p-2.5 lg:pe-12 outline-hidden select-none rounded-lg',
          isSelected ? 'text-foreground' : 'text-muted-foreground',
          'hover:bg-muted hover:text-foreground',
          className,
        )}
        onClick={() => {
          trigger('click')
          ctx?.onValueChange(value)
        }}
      >
        {isSelected && (
          <Icon
            name="Check"
            strokeWidth={4}
            className="absolute inset-e-4 flex size-4 items-center justify-center"
          />
        )}

        {children}
      </button>
    )
  }

  return (
    <SelectPrimitive.Item
      data-slot="select-item"
      className={cn(
        'focus:bg-muted focus:text-foreground relative flex w-full cursor-pointer items-center p-2.5 pe-8! outline-hidden select-none data-disabled:pointer-events-none data-disabled:opacity-50 rounded-lg data-[state=unchecked]:text-muted-foreground data-[state=checked]:text-foreground',
        className,
      )}
      value={value}
      {...props}
    >
      <span className="absolute inset-e-2 flex size-3.5 items-center justify-center">
        <SelectPrimitive.ItemIndicator>
          <Icon name="Check" size={16} />
        </SelectPrimitive.ItemIndicator>
      </span>
      <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
    </SelectPrimitive.Item>
  )
}

function SelectSeparator({
  className,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Separator>) {
  return (
    <SelectPrimitive.Separator
      data-slot="select-separator"
      className={cn('bg-border -mx-1 my-1 h-px', className)}
      {...props}
    />
  )
}

function SelectScrollUpButton({
  className,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.ScrollUpArrow>) {
  return (
    <SelectPrimitive.ScrollUpArrow
      data-slot="select-scroll-up-button"
      className={cn(
        'text-muted-foreground/80 flex cursor-default items-center justify-center py-1',
        className,
      )}
      {...props}
    >
      <Icon name="ChevronUp" size={16} />
    </SelectPrimitive.ScrollUpArrow>
  )
}

function SelectScrollDownButton({
  className,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.ScrollDownArrow>) {
  return (
    <SelectPrimitive.ScrollDownArrow
      data-slot="select-scroll-down-button"
      className={cn(
        'text-muted-foreground/80 flex cursor-default items-center justify-center py-1',
        className,
      )}
      {...props}
    >
      <Icon name="ChevronDown" size={16} />
    </SelectPrimitive.ScrollDownArrow>
  )
}

export {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectScrollDownButton,
  SelectScrollUpButton,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
}
