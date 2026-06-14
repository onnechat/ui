'use client'

import { Menu as MenuPrimitive } from '@base-ui/react/menu'

import * as React from 'react'

import { AnimatePresence, motion } from 'motion/react'

import { cn } from '@/lib/cn'

import { Icon } from '@/components/icon'

import { useHaptics } from '@/hooks/use-haptics'
import { useIsMobile } from '@/hooks/use-mobile'

import { ANIMATION } from '@/constants/animations'

import { Drawer, DrawerContent } from '@/components/internal/drawer'

import { KeyboardShortcut } from './keyboard-shortcut'

type DropdownMenuContextValue = {
  isMobile: boolean
  open: boolean
  onOpenChange: (open: boolean) => void
  view: React.ReactNode | null
  setView: (view: React.ReactNode | null) => void
}

const DropdownMenuContext =
  React.createContext<DropdownMenuContextValue | null>(null)

type DropdownMenuProps = Omit<MenuPrimitive.Root.Props, 'onOpenChange'> & {
  onOpenChange?: (open: boolean) => void
}

function DropdownMenu({
  open,
  onOpenChange,
  defaultOpen,
  children,
  ...props
}: DropdownMenuProps) {
  const isMobile = useIsMobile()

  const [drawerOpen, setDrawerOpen] = React.useState(defaultOpen ?? false)
  const [view, setView] = React.useState<React.ReactNode | null>(null)

  const internalOpen = open ?? drawerOpen

  const handleOpenChange = React.useCallback(
    (isOpen: boolean) => {
      setDrawerOpen(isOpen)
      onOpenChange?.(isOpen)

      if (!isOpen) {
        setTimeout(() => setView(null), 200)
      }
    },
    [onOpenChange],
  )

  return (
    <DropdownMenuContext.Provider
      value={{ isMobile, open: internalOpen, onOpenChange: handleOpenChange, view, setView }}
    >
      <MenuPrimitive.Root
        data-slot="dropdown-menu"
        open={isMobile ? false : internalOpen}
        onOpenChange={handleOpenChange}
        {...props}
      >
        {children}
      </MenuPrimitive.Root>
    </DropdownMenuContext.Provider>
  )
}

function DropdownMenuPortal({
  children,
  ...props
}: MenuPrimitive.Portal.Props) {
  return (
    <MenuPrimitive.Portal data-slot="dropdown-menu-portal" {...props}>
      {children}
    </MenuPrimitive.Portal>
  )
}

function DropdownMenuTrigger({
  className,
  asChild,
  children,
  ...props
}: MenuPrimitive.Trigger.Props & {
  asChild?: boolean
}) {
  const { trigger } = useHaptics()

  if (asChild && React.isValidElement<{ className?: string }>(children)) {
    return (
      <MenuPrimitive.Trigger
        data-slot="dropdown-menu-trigger"
        nativeButton={true}
        {...props}
        onClick={(e) => {
          trigger('click')
          props.onClick?.(e)
        }}
        render={(triggerProps) => {
          return React.cloneElement(children, {
            ...triggerProps,
            ...children.props,
            className: cn(className, children.props.className),
          })
        }}
      />
    )
  }

  return (
    <MenuPrimitive.Trigger
      data-slot="dropdown-menu-trigger"
      className={className}
      {...props}
      onClick={(e) => {
        trigger('click')
        props.onClick?.(e)
      }}
    >
      {children}
    </MenuPrimitive.Trigger>
  )
}

function DropdownMenuContent({
  className,
  sideOffset = 4,
  align = 'start',
  side = 'bottom',
  children,
  ...props
}: MenuPrimitive.Positioner.Props & {
  sideOffset?: number
}) {
  const { trigger } = useHaptics()

  const ctx = React.useContext(DropdownMenuContext)

  if (ctx?.isMobile) {
    return (
      <Drawer
        open={ctx.open}
        direction="bottom"
        onOpenChange={ctx.onOpenChange}
      >
        <DrawerContent title={'dropdownMenu.title'} showDivider>
          <div className="overflow-y-auto overflow-x-hidden p-2 pb-6">
            <AnimatePresence mode="wait">
              {ctx.view ? (
                <motion.div
                  key="submenu"
                  initial={{ opacity: 0, transform: 'translateY(20px)' }}
                  animate={{ opacity: 1, transform: 'translateY(0px)' }}
                  exit={{ opacity: 0, transform: 'translateY(20px)' }}
                  transition={{ duration: ANIMATION.DURATION_FLOAT }}
                >
                  <button
                    onClick={() => {
                      trigger('click')
                      ctx.setView(null)
                    }}
                    className="flex w-full items-center gap-2 rounded-sm p-4 text-sm font-medium hover:bg-accent text-muted-foreground"
                  >
                    <Icon name="ChevronRight" className="size-4 rotate-180" />
                    {'dropdownMenu.back'}
                  </button>

                  {ctx.view}
                </motion.div>
              ) : (
                <motion.div
                  key="main"
                  initial={{ opacity: 0, transform: 'translateY(-20px)' }}
                  animate={{ opacity: 1, transform: 'translateY(0px)' }}
                  exit={{ opacity: 0, transform: 'translateY(-20px)' }}
                  transition={{ duration: ANIMATION.DURATION_FLOAT }}
                >
                  {children}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </DrawerContent>
      </Drawer>
    )
  }

  return (
    <MenuPrimitive.Portal>
      <MenuPrimitive.Positioner
        data-slot="dropdown-menu-positioner"
        side={side}
        align={align}
        sideOffset={sideOffset}
        className="z-50"
        {...props}
      >
        <MenuPrimitive.Popup
          data-slot="dropdown-menu-content"
          className={cn(
            'z-50! max-h-(--available-height) min-w-32 origin-(--transform-origin) overflow-x-hidden overflow-y-auto rounded-lg glass-popover p-1 text-popover-foreground shadow-md outline-none',
            'transition-[transform,scale,opacity,filter] duration-150 ease-out',
            'data-starting-style:scale-95 data-starting-style:opacity-0 data-starting-style:blur-[2px]',
            'data-ending-style:scale-95 data-ending-style:opacity-0 data-ending-style:blur-[2px] data-ending-style:duration-100 data-ending-style:ease-in',
            className,
          )}
        >
          {children}
        </MenuPrimitive.Popup>
      </MenuPrimitive.Positioner>
    </MenuPrimitive.Portal>
  )
}

function DropdownMenuGroup({ children, ...props }: MenuPrimitive.Group.Props) {
  return (
    <MenuPrimitive.Group data-slot="dropdown-menu-group" {...props}>
      {children}
    </MenuPrimitive.Group>
  )
}

function DropdownMenuItem({
  className,
  inset,
  variant = 'default',
  resetClassName = false,
  asChild,
  children,
  ...props
}: MenuPrimitive.Item.Props & {
  inset?: boolean
  variant?: 'default' | 'destructive'
  resetClassName?: boolean
  asChild?: boolean
}) {
  const { trigger } = useHaptics()
  const ctx = React.useContext(DropdownMenuContext)

  const itemClassName = cn(
    !resetClassName &&
    "relative flex items-center gap-2 rounded-sm p-4 lg:px-2 lg:py-2 text-sm font-medium outline-hidden select-none data-highlighted:bg-accent data-highlighted:text-accent-foreground data-disabled:pointer-events-none data-disabled:opacity-50 data-inset:pl-8 data-[variant=destructive]:text-destructive data-[variant=destructive]:data-highlighted:bg-destructive/5 data-[variant=destructive]:data-highlighted:text-destructive dark:data-[variant=destructive]:data-highlighted:bg-destructive/20 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 [&_svg:not([class*='text-'])]:text-muted-foreground data-[variant=destructive]:*:[svg]:text-destructive! cursor-pointer",
    className,
  )

  if (ctx?.isMobile) {
    const { onClick, disabled } = props as {
      onClick?: React.MouseEventHandler
      disabled?: boolean
    }

    const mobileItemClassName = cn(
      !resetClassName &&
      "relative flex items-center gap-2 rounded-sm p-4 lg:px-2 lg:py-2 text-sm font-medium outline-hidden select-none hover:bg-accent hover:text-accent-foreground active:bg-accent active:text-accent-foreground disabled:pointer-events-none disabled:opacity-50 data-[inset]:pl-8 data-[variant=destructive]:text-destructive data-[variant=destructive]:hover:bg-destructive/5 data-[variant=destructive]:hover:text-destructive dark:data-[variant=destructive]:hover:bg-destructive/20 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 [&_svg:not([class*='text-'])]:text-muted-foreground cursor-pointer w-full text-left",
      className,
    )

    if (asChild && React.isValidElement(children)) {
      return React.cloneElement(
        children as React.ReactElement<React.HTMLAttributes<HTMLElement>>,
        {
          className: cn(
            mobileItemClassName,
            (children as React.ReactElement<{ className?: string }>).props
              .className,
          ),
          onClick: (e: React.MouseEvent<HTMLElement>) => {
            trigger('click')

            const childOnClick = (
              children as React.ReactElement<React.HTMLAttributes<HTMLElement>>
            ).props.onClick

            childOnClick?.(e)
            ctx.onOpenChange(false)
          },
        },
      )
    }

    return (
      <button
        type="button"
        data-slot="dropdown-menu-item"
        data-inset={inset}
        data-variant={variant}
        disabled={disabled}
        className={mobileItemClassName}
        onClick={(e) => {
          trigger('click')
          onClick?.(e)
          ctx.onOpenChange(false)
        }}
      >
        {children}
      </button>
    )
  }

  if (asChild && React.isValidElement(children)) {
    const isNativeButton = children.type === 'button'

    return (
      <MenuPrimitive.Item
        data-slot="dropdown-menu-item"
        data-inset={inset}
        data-variant={variant}
        nativeButton={isNativeButton}
        {...props}
        onClick={(e) => {
          trigger('click')
          props.onClick?.(e)
        }}
        closeOnClick={true}
        render={(itemProps) => {
          return React.cloneElement(children, {
            ...itemProps,
            ...(children.props as { className?: string }),
            className: cn(
              itemClassName,
              'flex items-center gap-3 w-full relative z-10 group/menu-button hover:bg-accent! data-[active=true]:bg-transparent p-2! text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2.5 data-[disabled=true]:pointer-events-none data-[disabled=true]:opacity-50 transition-[transform,opacity] duration-200 active:scale-[99.35%] rounded-sm outline-none cursor-pointer ring-0!',
              (children.props as { className?: string }).className,
            ),
          } as React.ComponentProps<typeof MenuPrimitive.Item>)
        }}
      />
    )
  }

  return (
    <MenuPrimitive.Item
      data-slot="dropdown-menu-item"
      data-inset={inset}
      data-variant={variant}
      className={itemClassName}
      {...props}
      onClick={(e) => {
        trigger('click')
        props.onClick?.(e)
      }}
      closeOnClick={true}
    >
      {children}
    </MenuPrimitive.Item>
  )
}

function DropdownMenuCheckboxItem({
  className,
  children,
  checked,
  onCheckedChange,
  ...props
}: MenuPrimitive.CheckboxItem.Props) {
  return (
    <MenuPrimitive.CheckboxItem
      data-slot="dropdown-menu-checkbox-item"
      className={cn(
        "relative flex cursor-default items-center gap-2 rounded-sm py-1.5 pr-2 pl-8 text-sm outline-hidden select-none data-highlighted:bg-accent data-highlighted:text-accent-foreground data-disabled:pointer-events-none data-disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        className,
      )}
      checked={checked}
      onCheckedChange={onCheckedChange}
      {...props}
    >
      <span className="pointer-events-none absolute left-2 flex size-3.5 items-center justify-center">
        <MenuPrimitive.CheckboxItemIndicator>
          <Icon name="Check" className="size-4" />
        </MenuPrimitive.CheckboxItemIndicator>
      </span>
      {children}
    </MenuPrimitive.CheckboxItem>
  )
}

function DropdownMenuRadioGroup({
  children,
  ...props
}: MenuPrimitive.RadioGroup.Props) {
  return (
    <MenuPrimitive.RadioGroup data-slot="dropdown-menu-radio-group" {...props}>
      {children}
    </MenuPrimitive.RadioGroup>
  )
}

function DropdownMenuRadioItem({
  className,
  children,
  ...props
}: MenuPrimitive.RadioItem.Props) {
  return (
    <MenuPrimitive.RadioItem
      data-slot="dropdown-menu-radio-item"
      className={cn(
        "relative flex cursor-default items-center gap-2 rounded-sm p-4 lg:py-2 lg:pr-2 lg:pl-8 text-sm outline-hidden select-none data-highlighted:bg-accent data-highlighted:text-accent-foreground data-disabled:pointer-events-none data-disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        className,
      )}
      {...props}
    >
      <span className="pointer-events-none absolute left-2 flex size-3.5 items-center justify-center">
        <MenuPrimitive.RadioItemIndicator>
          <Icon name="Check" className="size-4" />
        </MenuPrimitive.RadioItemIndicator>
      </span>
      {children}
    </MenuPrimitive.RadioItem>
  )
}

function DropdownMenuLabel({
  className,
  inset,
  ...props
}: MenuPrimitive.GroupLabel.Props & {
  inset?: boolean
}) {
  return (
    <MenuPrimitive.GroupLabel
      data-slot="dropdown-menu-label"
      data-inset={inset}
      className={cn(
        'px-2 py-1 text-xs font-medium text-muted-foreground select-none data-inset:pl-8',
        className,
      )}
      {...props}
    />
  )
}

function DropdownMenuSeparator({
  className,
  ...props
}: MenuPrimitive.Separator.Props) {
  return (
    <MenuPrimitive.Separator
      data-slot="dropdown-menu-separator"
      className={cn('my-2 lg:-mx-1 lg:my-1 h-[0.5px] bg-border/50', className)}
      {...props}
    />
  )
}

function DropdownMenuShortcut({
  className,
  ...props
}: React.ComponentProps<typeof KeyboardShortcut>) {
  return (
    <KeyboardShortcut
      data-slot="dropdown-menu-shortcut"
      className={cn('ml-auto text-xs text-muted-foreground', className)}
      {...props}
    />
  )
}

const DropdownMenuSubContext = React.createContext<{
  content: React.ReactNode | null
  setContent: (content: React.ReactNode | null) => void
} | null>(null)

function DropdownMenuSub({
  children,
  ...props
}: MenuPrimitive.SubmenuRoot.Props) {
  const ctx = React.useContext(DropdownMenuContext)
  const [content, setContent] = React.useState<React.ReactNode | null>(null)

  if (ctx?.isMobile) {
    return (
      <DropdownMenuSubContext.Provider value={{ content, setContent }}>
        {children as React.ReactNode}
      </DropdownMenuSubContext.Provider>
    )
  }

  return (
    <MenuPrimitive.SubmenuRoot data-slot="dropdown-menu-sub" {...props}>
      {children}
    </MenuPrimitive.SubmenuRoot>
  )
}

function DropdownMenuSubTrigger({
  className,
  inset,
  children,
  ...props
}: MenuPrimitive.SubmenuTrigger.Props & {
  inset?: boolean
}) {
  const { trigger } = useHaptics()

  const ctx = React.useContext(DropdownMenuContext)
  const subCtx = React.useContext(DropdownMenuSubContext)

  const triggerClassName = cn(
    'flex items-center gap-3 w-full relative z-10 group/menu-button hover:bg-accent! data-[active=true]:bg-transparent p-2 text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2.5 data-[disabled=true]:pointer-events-none data-[disabled=true]:opacity-50 transition-[transform,opacity] duration-200 active:scale-[99.35%] rounded-sm outline-none cursor-pointer ring-0!',
    className,
  )

  if (ctx?.isMobile) {
    return (
      <button
        type="button"
        className={triggerClassName}
        onClick={() => {
          trigger('click')
          ctx.setView(subCtx?.content ?? null)
        }}
      >
        {children}
        <Icon name="ChevronRight" className="ml-auto size-4" />
      </button>
    )
  }

  return (
    <MenuPrimitive.SubmenuTrigger
      data-slot="dropdown-menu-sub-trigger"
      data-inset={inset}
      className={triggerClassName}
      {...props}
      onClick={(e) => {
        trigger('click')
        props.onClick?.(e)
      }}
    >
      {children}
      <Icon name="ChevronRight" className="ml-auto size-4" />
    </MenuPrimitive.SubmenuTrigger>
  )
}

function DropdownMenuSubContent({
  className,
  sideOffset = 0,
  alignOffset = -4,
  children,
}: {
  className?: string
  sideOffset?: number
  alignOffset?: number
  children?: React.ReactNode
}) {
  const ctx = React.useContext(DropdownMenuContext)
  const subCtx = React.useContext(DropdownMenuSubContext)

  React.useEffect(() => {
    if (ctx?.isMobile) {
      subCtx?.setContent(children ?? null)
    }
  }, [children, ctx?.isMobile, subCtx])

  if (ctx?.isMobile) {
    return null
  }

  return (
    <MenuPrimitive.Portal>
      <MenuPrimitive.Positioner
        side="right"
        sideOffset={sideOffset}
        alignOffset={alignOffset}
        className="z-50"
      >
        <MenuPrimitive.Popup
          data-slot="dropdown-menu-sub-content"
          className={cn(
            'z-50! min-w-32 origin-(--transform-origin) overflow-hidden rounded-lg glass-popover p-1 text-popover-foreground shadow-lg',
            'transition-[transform,scale,opacity,filter] duration-150 ease-out',
            'data-starting-style:scale-95 data-starting-style:opacity-0 data-starting-style:blur-[2px]',
            'data-ending-style:scale-95 data-ending-style:opacity-0 data-ending-style:blur-[2px] data-ending-style:duration-100 data-ending-style:ease-in',
            className,
          )}
        >
          {children}
        </MenuPrimitive.Popup>
      </MenuPrimitive.Positioner>
    </MenuPrimitive.Portal>
  )
}

function DropdownMenuArrow({ className, ...props }: MenuPrimitive.Arrow.Props) {
  return (
    <MenuPrimitive.Arrow
      data-slot="dropdown-menu-arrow"
      className={cn('fill-popover', className)}
      {...props}
    />
  )
}

export {
  DropdownMenu,
  DropdownMenuArrow,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
}
