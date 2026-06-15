'use client'

import * as React from 'react'

import { Switch as SwitchPrimitive } from '@base-ui/react/switch'

import { cn } from '@/lib/cn'

const Switch = React.forwardRef<
  React.ElementRef<typeof SwitchPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof SwitchPrimitive.Root>
>(({ className, ...props }, ref) => {
  return (
    <SwitchPrimitive.Root
      ref={ref}
      data-slot="switch"
      className={cn(
        '[--switch-width:--spacing(12)] [--switch-height:--spacing(6.25)]',
        'peer data-[state=checked]:bg-primary data-[state=unchecked]:bg-input focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 aria-invalid:border-destructive shrink-0 rounded-full border-2 outline-2 data-[state=checked]:outline-primary data-[state=unchecked]:outline-border data-[state=checked]:border-border data-[state=unchecked]:border-input focus-visible:ring-3 aria-invalid:ring-3 h-(--switch-height) w-(--switch-width) relative inline-flex items-center transition-all after:absolute after:-inset-x-3 after:-inset-y-2 data-disabled:cursor-not-allowed data-disabled:opacity-50 cursor-pointer',
        className,
      )}
      {...props}
    >
      <SwitchPrimitive.Thumb
        data-slot="switch-thumb"
        className={cn(
          'data-[state=checked]:bg-primary-foreground bg-background rounded-full h-full w-1/2 data-[state=checked]:translate-x-full pointer-events-none block ring-0 transition-transform',
        )}
      />
    </SwitchPrimitive.Root>
  )
})
Switch.displayName = 'Switch'

export { Switch }
