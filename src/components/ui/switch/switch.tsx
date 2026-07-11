'use client'

import * as React from 'react'

import { Switch as SwitchPrimitive } from '@base-ui/react/switch'

import { cva, type VariantProps } from 'class-variance-authority'

import { cn } from '@/lib/cn'

const switchVariants = cva(
  'peer data-checked:bg-primary data-unchecked:bg-input focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 aria-invalid:border-destructive shrink-0 rounded-full border-2 outline-2 data-checked:outline-primary data-unchecked:outline-border data-checked:border-border data-unchecked:border-input focus-visible:ring-3 aria-invalid:ring-3 h-(--switch-height) w-(--switch-width) relative inline-flex items-center transition-all after:absolute after:-inset-x-3 after:-inset-y-2 data-disabled:cursor-not-allowed data-disabled:opacity-50 cursor-pointer',
  {
    variants: {
      // Toggle control: only the track (width/height) scales via CSS vars; the
      // thumb is relative (h-full w-1/2 + translate-x-full) so it follows along.
      size: {
        sm: '[--switch-width:--spacing(10)] [--switch-height:--spacing(5.25)]',
        default:
          '[--switch-width:--spacing(12)] [--switch-height:--spacing(6.25)]',
        lg: '[--switch-width:--spacing(14)] [--switch-height:--spacing(7.25)]',
      },
    },
    defaultVariants: {
      size: 'default',
    },
  },
)

type SwitchProps = Omit<
  React.ComponentPropsWithoutRef<typeof SwitchPrimitive.Root>,
  'size'
> &
  VariantProps<typeof switchVariants>

const Switch = React.forwardRef<
  React.ElementRef<typeof SwitchPrimitive.Root>,
  SwitchProps
>(({ className, size, ...props }, ref) => {
  return (
    <SwitchPrimitive.Root
      ref={ref}
      data-slot="switch"
      data-size={size ?? 'default'}
      className={cn(switchVariants({ size }), className)}
      {...props}
    >
      <SwitchPrimitive.Thumb
        data-slot="switch-thumb"
        className={cn(
          'data-checked:bg-primary-foreground bg-background rounded-full h-full w-1/2 data-checked:translate-x-full pointer-events-none block ring-0 transition-transform',
        )}
      />
    </SwitchPrimitive.Root>
  )
})
Switch.displayName = 'Switch'

export { Switch, switchVariants }
