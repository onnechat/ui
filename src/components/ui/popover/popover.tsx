'use client'

import * as React from 'react'

import { Popover as PopoverPrimitive } from '@base-ui/react/popover'

import { cn } from '@/lib/cn'

const PopoverAnchorContext = React.createContext<{
  anchor: HTMLElement | null
  setAnchor: (el: HTMLElement | null) => void
} | null>(null)

function PopoverRoot({ children, ...props }: PopoverPrimitive.Root.Props) {
  const [anchor, setAnchor] = React.useState<HTMLElement | null>(null)

  return (
    <PopoverAnchorContext.Provider value={{ anchor, setAnchor }}>
      <PopoverPrimitive.Root data-slot="popover" {...props}>
        {children}
      </PopoverPrimitive.Root>
    </PopoverAnchorContext.Provider>
  )
}

function PopoverTrigger({
  asChild,
  children,
  ...props
}: PopoverPrimitive.Trigger.Props & {
  asChild?: boolean
}) {
  if (asChild && React.isValidElement(children)) {
    return (
      <PopoverPrimitive.Trigger
        data-slot="popover-trigger"
        nativeButton={
          typeof children.type === 'string' ? children.type === 'button' : true
        }
        render={children as React.ReactElement<Record<string, unknown>>}
        {...props}
      />
    )
  }

  return (
    <PopoverPrimitive.Trigger
      data-slot="popover-trigger"
      className="cursor-pointer"
      {...props}
    >
      {children}
    </PopoverPrimitive.Trigger>
  )
}

function PopoverContent({
  className,
  align = 'center',
  side,
  sideOffset = 4,
  alignOffset,
  showArrow = false,
  children,
  ...props
}: PopoverPrimitive.Popup.Props &
  Pick<
    PopoverPrimitive.Positioner.Props,
    'align' | 'side' | 'sideOffset' | 'alignOffset'
  > & {
    showArrow?: boolean
  }) {
  const anchorCtx = React.useContext(PopoverAnchorContext)

  return (
    <PopoverPrimitive.Portal>
      <PopoverPrimitive.Positioner
        data-slot="popover-positioner"
        align={align}
        side={side}
        sideOffset={sideOffset}
        alignOffset={alignOffset}
        anchor={anchorCtx?.anchor ?? undefined}
        className="z-50"
      >
        <PopoverPrimitive.Popup
          data-slot="popover-content"
          className={cn(
            'bg-popover text-popover-foreground z-50 w-72 rounded-lg border p-4 shadow-md outline-hidden origin-(--transform-origin)',
            'transition-[transform,scale,opacity] duration-300 ease-spring motion-reduce:transition-none',
            'data-starting-style:scale-[0.96] data-starting-style:opacity-0',
            'data-ending-style:scale-[0.96] data-ending-style:opacity-0 data-ending-style:duration-150 data-ending-style:ease-in',
            className,
          )}
          {...props}
        >
          {children}
          {showArrow && (
            <PopoverPrimitive.Arrow className="-my-px flex data-[side=bottom]:top-[-6px] data-[side=top]:bottom-[-6px] data-[side=top]:rotate-180 data-[side=left]:right-[-10px] data-[side=left]:rotate-90 data-[side=right]:left-[-10px] data-[side=right]:-rotate-90">
              <svg width="14" height="7" viewBox="0 0 14 7" fill="none">
                <path
                  d="M0 7L6.29289 0.707107C6.68342 0.316583 7.31658 0.316583 7.70711 0.707107L14 7H0Z"
                  className="fill-popover drop-shadow-[0_1px_0_var(--border)]"
                />
              </svg>
            </PopoverPrimitive.Arrow>
          )}
        </PopoverPrimitive.Popup>
      </PopoverPrimitive.Positioner>
    </PopoverPrimitive.Portal>
  )
}

function PopoverAnchor({ children, ...props }: React.ComponentProps<'span'>) {
  const anchorCtx = React.useContext(PopoverAnchorContext)

  return (
    <span
      data-slot="popover-anchor"
      ref={el => anchorCtx?.setAnchor(el)}
      {...props}
    >
      {children}
    </span>
  )
}

const Popover = Object.assign(PopoverRoot, {
  Trigger: PopoverTrigger,
  Content: PopoverContent,
  Anchor: PopoverAnchor,
})
export { Popover }
