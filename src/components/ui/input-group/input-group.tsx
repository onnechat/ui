import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'

import { cn } from '@/lib/cn'

type InputGroupProps = React.HTMLAttributes<HTMLDivElement>

function InputGroupRoot({ className, ...props }: InputGroupProps) {
  return (
    <div
      data-slot="input-group"
      className={cn(
        'relative',
        '[&:has([data-align="inline-start"])_[data-slot="input-group-control"]]:pl-10',
        '[&:has([data-align="inline-end"])_[data-slot="input-group-control"]]:pr-10',
        '[&:has([data-align="inline-start"][data-variant="filled"])_[data-slot="input-group-control"]]:pl-12',
        '[&:has([data-align="inline-end"][data-variant="filled"])_[data-slot="input-group-control"]]:pr-12',
        className,
      )}
      {...props}
    />
  )
}

type InputGroupInputProps = React.ComponentProps<'input'>

function InputGroupInput({ className, ...props }: InputGroupInputProps) {
  return (
    <input
      data-slot="input-group-control"
      className={cn(
        'file:text-foreground placeholder:text-muted-foreground/50 placeholder:pointer-events-none placeholder:select-none bg-input flex h-10 w-full min-w-0 rounded-xl border border-transparent px-3 py-2 text-sm transition-all outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:font-medium text-foreground',
        'focus-visible:border-transparent focus-visible:ring-ring/50 focus-visible:ring-[3px]',
        'aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive',
        'disabled:pointer-events-none disabled:cursor-not-allowed disabled:brightness-75',
        'read-only:pointer-events-none read-only:cursor-not-allowed read-only:brightness-75',
        className,
      )}
      {...props}
    />
  )
}
InputGroupInput.displayName = 'InputGroupInput'

const inputGroupAddonVariants = cva(
  'absolute inset-y-0 flex items-center justify-center pointer-events-none',
  {
    variants: {
      align: {
        'inline-start': 'left-0 w-10',
        'inline-end': 'right-0 w-10',
      },
      variant: {
        default: '',
        filled: 'bg-accent',
      },
    },
    compoundVariants: [
      { align: 'inline-start', variant: 'filled', className: 'rounded-l-xl' },
      { align: 'inline-end', variant: 'filled', className: 'rounded-r-xl' },
    ],
    defaultVariants: {
      align: 'inline-start',
      variant: 'default',
    },
  },
)

type InputGroupAddonProps = React.HTMLAttributes<HTMLDivElement> &
  VariantProps<typeof inputGroupAddonVariants>

function InputGroupAddon({
  align = 'inline-start',
  variant = 'default',
  className,
  ...props
}: InputGroupAddonProps) {
  return (
    <div
      data-slot="input-group-addon"
      data-align={align}
      data-variant={variant}
      className={cn(inputGroupAddonVariants({ align, variant }), className)}
      {...props}
    />
  )
}
InputGroupAddon.displayName = 'InputGroupAddon'

type InputGroupTextProps = React.HTMLAttributes<HTMLSpanElement>

function InputGroupText({ className, ...props }: InputGroupTextProps) {
  return (
    <span
      data-slot="input-group-text"
      className={cn('text-sm text-muted-foreground', className)}
      {...props}
    />
  )
}
InputGroupText.displayName = 'InputGroupText'

const InputGroup = Object.assign(InputGroupRoot, { Input: InputGroupInput, Addon: InputGroupAddon, Text: InputGroupText })
export { InputGroup }
