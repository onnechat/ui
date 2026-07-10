'use client'

import * as React from 'react'

import { Select as SelectPrimitive } from '@base-ui/react/select'
import { Separator as SeparatorPrimitive } from '@base-ui/react/separator'

import { cva, type VariantProps } from 'class-variance-authority'

import { Icon } from '@/components/icon'

import { cn } from '@/lib/cn'

import { useHaptics } from '@/hooks/use-haptics'
import { useIsMobile } from '@/hooks/use-mobile'

import { Drawer } from '@/components/ui/drawer'

/** Same option list is rendered twice on mobile (hidden discovery items + drawer). Clone so each tree is independent. */
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
// 'desktop'     → Base UI SelectPrimitive.Item (default)
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

function SelectRoot({
  value: valueProp,
  defaultValue,
  onValueChange: onValueChangeProp,
  open: openProp,
  onOpenChange: onOpenChangeProp,
  defaultOpen,
  children,
  ...props
}: Omit<
  SelectPrimitive.Root.Props<string>,
  'value' | 'defaultValue' | 'onValueChange' | 'onOpenChange'
> & {
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
      setItemLabels(prev => {
        if (prev[itemValue]?.text === text) return prev
        return { ...prev, [itemValue]: { text, node: label } }
      })
    },
    [],
  )

  const handleOpenChange = React.useCallback(
    (isOpen: boolean) => {
      setDrawerOpen(isOpen)
      onOpenChangeProp?.(isOpen)
    },
    [onOpenChangeProp],
  )

  const handleValueChange = React.useCallback(
    (val: string | null) => {
      setInternalValue(val ?? '')
      onValueChangeProp?.(val ?? '')
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
        onOpenChange={handleOpenChange}
        value={value}
        onValueChange={handleValueChange}
        {...props}
      >
        {children}
      </SelectPrimitive.Root>
    </SelectContext.Provider>
  )
}

function SelectGroup({ ...props }: SelectPrimitive.Group.Props) {
  return <SelectPrimitive.Group data-slot="select-group" {...props} />
}

function SelectValue({
  className,
  placeholder,
  children,
  ...props
}: SelectPrimitive.Value.Props) {
  const ctx = React.useContext(SelectContext)

  const label = ctx && ctx.value ? ctx.itemLabels[ctx.value]?.node : undefined
  const content = children ?? label ?? placeholder

  if (ctx?.isMobile) {
    return (
      <span
        data-slot="select-value"
        className={cn(!content && 'text-muted-foreground/50', className)}
      >
        {content as React.ReactNode}
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

const selectTriggerVariants = cva(
  'border-transparent text-foreground flex w-full items-center justify-between gap-2 rounded-xl bg-input transition-[color] disabled:cursor-not-allowed disabled:opacity-75 *:data-[slot=select-value]:flex *:data-[slot=select-value]:items-center *:data-[slot=select-value]:gap-2 *:data-[slot=select-value]:min-w-max [&_svg]:pointer-events-none [&_svg]:shrink-0 outline-none aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive data-placeholder:text-muted-foreground/50 focus-visible:border-transparent focus-visible:aria-invalid:ring-destructive focus-visible:ring-ring/50 focus-visible:ring-[3px] cursor-pointer select-none',
  {
    variants: {
      // Height mirrors the Button/Input field scale: h-8 / h-10 / h-12.
      size: {
        sm: 'h-8 px-3 py-1 text-sm',
        default: 'h-10 px-4 py-2 text-sm',
        lg: 'h-12 px-4 py-2.5 text-base',
      },
    },
    defaultVariants: {
      size: 'default',
    },
  },
)

const SelectTrigger = React.forwardRef<
  HTMLButtonElement,
  Omit<SelectPrimitive.Trigger.Props, 'size'> & {
    removeIcon?: boolean
    size?: VariantProps<typeof selectTriggerVariants>['size']
  }
>(function SelectTrigger(
  { className, children, removeIcon = false, size, ...props },
  ref,
) {
  const mode = React.useContext(SelectItemModeContext)
  const { trigger } = useHaptics()

  if (mode === 'discovery') {
    return null
  }

  return (
    <SelectPrimitive.Trigger
      ref={ref}
      suppressHydrationWarning
      data-slot="select-trigger"
      data-size={size ?? 'default'}
      className={cn(selectTriggerVariants({ size }), className)}
      {...props}
      onClick={e => {
        trigger('click')
        props.onClick?.(e)
      }}
    >
      {children}

      {!removeIcon && (
        <SelectPrimitive.Icon
          render={
            <Icon
              name="ChevronDown"
              size={16}
              className="text-muted-foreground/80 in-aria-invalid:text-destructive/80 shrink-0 ml-auto"
            />
          }
        />
      )}
    </SelectPrimitive.Trigger>
  )
})

function SelectContent({
  className,
  children,
  position = 'popper',
  side,
  align,
  sideOffset = 4,
  ...props
}: SelectPrimitive.Popup.Props &
  Pick<SelectPrimitive.Positioner.Props, 'side' | 'align' | 'sideOffset'> & {
    position?: 'popper' | 'item-aligned'
  }) {
  const ctx = React.useContext(SelectContext)
  const mode = React.useContext(SelectItemModeContext)

  if (mode === 'discovery') {
    return <>{children}</>
  }

  if (ctx?.isMobile) {
    return (
      <Drawer
        open={ctx.open}
        onOpenChange={ctx.onOpenChange}
        direction="bottom"
      >
        <Drawer.Content title="Select" showDivider>
          <SelectItemModeContext.Provider value="interactive">
            <div className="overflow-y-auto p-2 pb-6">
              {cloneSelectChildren(children, 'drawer')}
            </div>
          </SelectItemModeContext.Provider>
        </Drawer.Content>
      </Drawer>
    )
  }

  return (
    <SelectPrimitive.Portal>
      <SelectPrimitive.Positioner
        data-slot="select-positioner"
        side={side}
        align={align}
        sideOffset={sideOffset}
        alignItemWithTrigger={position === 'item-aligned'}
        className="z-50"
      >
        <SelectPrimitive.Popup
          data-slot="select-content"
          className={cn(
            'border-transparent glass-popover p-1 text-popover-foreground relative z-50 max-h-[min(24rem,var(--available-height))] min-w-32 overflow-hidden rounded-xl **:[[role=group]]:py-1 outline-none origin-(--transform-origin)',
            'transition-[transform,scale,opacity] duration-150 ease-out',
            'data-starting-style:scale-95 data-starting-style:opacity-0',
            'data-ending-style:scale-95 data-ending-style:opacity-0 data-ending-style:duration-100 data-ending-style:ease-in',
            position === 'popper' && 'min-w-(--anchor-width)',
            className,
          )}
          {...props}
        >
          <SelectPrimitive.List
            data-slot="select-list"
            className="scroll-fade-y max-h-[min(24rem,var(--available-height))] overflow-x-hidden overflow-y-auto p-1"
          >
            {children}
          </SelectPrimitive.List>
        </SelectPrimitive.Popup>
      </SelectPrimitive.Positioner>
    </SelectPrimitive.Portal>
  )
}

function SelectLabel({
  className,
  ...props
}: SelectPrimitive.GroupLabel.Props) {
  return (
    <SelectPrimitive.GroupLabel
      data-slot="select-label"
      className={cn(
        'px-2 pt-2 pb-1.5 text-xs font-medium uppercase text-muted-foreground/50 select-none',
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
}: SelectPrimitive.Item.Props) {
  const ctx = React.useContext(SelectContext)
  const mode = React.useContext(SelectItemModeContext)

  const { trigger } = useHaptics()

  React.useEffect(() => {
    if (ctx) {
      ctx.registerLabel(value as string, children)
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
          ctx?.onValueChange(value as string)
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
        'data-highlighted:bg-muted data-highlighted:text-foreground relative flex w-full cursor-pointer items-center p-2.5 pe-8! outline-hidden select-none data-disabled:pointer-events-none data-disabled:opacity-50 rounded-lg not-data-selected:text-muted-foreground data-selected:text-foreground',
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

function SelectSeparator({ className, ...props }: SeparatorPrimitive.Props) {
  return (
    <SeparatorPrimitive
      data-slot="select-separator"
      className={cn('bg-border -mx-1 my-1 h-px', className)}
      {...props}
    />
  )
}

function SelectScrollUpButton({
  className,
  ...props
}: SelectPrimitive.ScrollUpArrow.Props) {
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
}: SelectPrimitive.ScrollDownArrow.Props) {
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

const Select = Object.assign(SelectRoot, {
  Content: SelectContent,
  Group: SelectGroup,
  Item: SelectItem,
  Label: SelectLabel,
  ScrollDownButton: SelectScrollDownButton,
  ScrollUpButton: SelectScrollUpButton,
  Separator: SelectSeparator,
  Trigger: SelectTrigger,
  Value: SelectValue,
})
export { Select }
