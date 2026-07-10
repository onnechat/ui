import * as React from 'react'

import { cva, type VariantProps } from 'class-variance-authority'

import { cn } from '@/lib/cn'

const inputVariants = cva(
  'file:text-foreground placeholder:text-muted-foreground/50 placeholder:pointer-events-none placeholder:select-none bg-input flex w-full min-w-0 rounded-xl border border-transparent transition-all outline-none file:inline-flex file:border-0 file:bg-transparent file:font-medium text-foreground focus-visible:border-transparent focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive disabled:pointer-events-none disabled:cursor-not-allowed disabled:brightness-75 read-only:pointer-events-none read-only:cursor-not-allowed read-only:brightness-75',
  {
    variants: {
      // Heights mirror the Button exactly: sm=h-8 (32px), default=h-10 (40px),
      // lg=h-12 (48px). Keep these in sync across all field-like components.
      size: {
        sm: 'h-8 px-3 py-1 text-sm file:h-6',
        default: 'h-10 px-3 py-2 text-sm file:h-7',
        lg: 'h-12 px-4 py-2.5 text-base file:h-8',
      },
    },
    defaultVariants: {
      size: 'default',
    },
  },
)

type InputProps = Omit<React.ComponentProps<'input'>, 'size'> &
  VariantProps<typeof inputVariants>

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ type, size, className, ...props }, ref) => {
    return (
      <input
        ref={ref}
        type={type}
        data-slot="input"
        data-size={size ?? 'default'}
        suppressHydrationWarning
        className={cn(inputVariants({ size }), className)}
        {...props}
      />
    )
  },
)
Input.displayName = 'Input'

export { Input, inputVariants }
export type { InputProps }
