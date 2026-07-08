import * as React from 'react'

import { cn } from '@/lib/cn'

type InputProps = React.ComponentProps<'input'>

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ type, className, ...props }, ref) => {
    return (
      <input
        ref={ref}
        type={type}
        data-slot="input"
        suppressHydrationWarning
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
  },
)
Input.displayName = 'Input'

export { Input }
export type { InputProps }
