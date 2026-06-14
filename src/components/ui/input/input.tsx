import * as React from 'react'

import { cn } from '@/lib/cn'

type InputProps = React.ComponentProps<'input'> & {
  containerClassName?: string
  prefix?: React.ReactNode
  sufix?: React.ReactNode
  sufixClassName?: string
  prefixClassName?: string
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      type,
      sufix,
      prefix,
      className,
      containerClassName,
      sufixClassName: sufixCustomClassName,
      prefixClassName: prefixCustomClassName,
      ...props
    },
    ref,
  ) => {
    const affixClassName =
      'flex items-center absolute top-1/2 -translate-y-1/2 size-4 text-muted-foreground cursor-pointer hover:text-foreground transition-colors'

    const prefixClassName = cn(
      affixClassName,
      'left-2 justify-start',
      prefixCustomClassName,
    )
    const sufixClassName = cn(
      affixClassName,
      'right-2 justify-end',
      sufixCustomClassName,
    )

    return (
      <div className={cn('relative w-full', containerClassName)}>
        {prefix && <div className={prefixClassName}>{prefix}</div>}

        <input
          ref={ref}
          type={type}
          data-slot="input"
          suppressHydrationWarning
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

        {sufix && <div className={sufixClassName}>{sufix}</div>}
      </div>
    )
  },
)
Input.displayName = 'Input'

export { Input }
