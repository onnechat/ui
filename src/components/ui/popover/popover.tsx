'use client'

import * as React from 'react'

import { Popover } from '@base-ui/react/popover'

import { cn } from '@/lib/cn'

function PopoverRoot({
  ...props
}: React.ComponentProps<typeof Popover.Root>) {
  return <Popover.Root data-slot="popover" {...props} />
}

function PopoverTrigger({
  ...props
}: React.ComponentProps<typeof Popover.Trigger>) {
  return <Popover.Trigger data-slot="popover-trigger" {...props} />
}

function PopoverContent({
  className,
  align = 'center',
  sideOffset = 4,
  showArrow = false,
  ...props
}: React.ComponentProps<typeof Popover.Popup> & {
  showArrow?: boolean
  align?: 'center' | 'end' | 'start'
  sideOffset?: number
}) {
  return (
    <Popover.Portal>
      <Popover.Positioner align={align} sideOffset={sideOffset}>
        <Popover.Popup
          data-slot="popover-content"
          className={cn(
            'bg-popover text-popover-foreground data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 z-50 w-72 rounded-lg border p-4 shadow-md outline-hidden origin-(--transform-origin)',
            className,
          )}
          {...props}
        >
          {props.children}
          {showArrow && (
            <Popover.Arrow className="fill-popover -my-px drop-shadow-[0_1px_0_hsl(var(--border))]" />
          )}
        </Popover.Popup>
      </Popover.Positioner>
    </Popover.Portal>
  )
}

export { PopoverRoot as Popover, PopoverContent, PopoverTrigger }
