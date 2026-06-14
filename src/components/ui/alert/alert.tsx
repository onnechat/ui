import * as React from 'react'

import { cva, type VariantProps } from 'class-variance-authority'

import { cn } from '@/lib/cn'

const alertVariants = cva(
  'relative w-fit rounded-2xl px-4 py-3 text-sm grid has-[>svg]:gap-x-2 gap-y-0.5 has-[>svg]:grid-cols-[calc(var(--spacing)*4)_1fr] grid-cols-[0_1fr] items-start [&>svg]:size-4 [&>svg]:translate-y-1 [&:has(*[data-slot=alert-description]):not(:has(*[data-slot=alert-title]))]:[&>svg]:translate-y-0.5 [&>svg]:text-current',
  {
    variants: {
      variant: {
        default: 'bg-card text-card-foreground',
        destructive:
          'text-destructive bg-destructive/5 [&>svg]:text-current *:data-[slot=alert-description]:text-destructive/70',
        warning:
          'text-warning bg-warning/5 [&>svg]:text-current *:data-[slot=alert-description]:text-warning/70',
        info: 'text-info bg-info/5 [&>svg]:text-current *:data-[slot=alert-description]:text-info/70',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
)

function Alert({
  className,
  variant,
  ...props
}: React.ComponentProps<'div'> & VariantProps<typeof alertVariants>) {
  return (
    <div
      data-slot="alert"
      role="alert"
      className={cn(alertVariants({ variant }), className)}
      {...props}
    />
  )
}

function AlertTitle({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="alert-title"
      className={cn('col-start-2 line-clamp-1 min-h-4 text-base', className)}
      {...props}
    />
  )
}

function AlertDescription({
  className,
  ...props
}: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="alert-description"
      className={cn(
        'text-muted-foreground col-start-2 grid justify-items-start gap-1 text-sm [&_p]:leading-relaxed',
        className,
      )}
      {...props}
    />
  )
}

export { Alert, AlertDescription, AlertTitle }
