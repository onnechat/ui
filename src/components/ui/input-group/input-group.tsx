import * as React from 'react'

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
        'file:text-foreground placeholder:text-muted-foreground/50 placeholder:pointer-events-none placeholder:select-none bg-input flex h-12 w-full min-w-0 rounded-xl border border-transparent px-3 py-2 transition-all outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:font-medium text-foreground',
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

type InputGroupAddonProps = React.HTMLAttributes<HTMLDivElement> & {
  align?: 'inline-start' | 'inline-end'
}

function InputGroupAddon({
  align = 'inline-start',
  className,
  ...props
}: InputGroupAddonProps) {
  return (
    <div
      data-slot="input-group-addon"
      data-align={align}
      className={cn(
        'absolute inset-y-0 flex items-center justify-center pointer-events-none',
        align === 'inline-start' && 'left-0 w-10',
        align === 'inline-end' && 'right-0 w-10',
        className,
      )}
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
