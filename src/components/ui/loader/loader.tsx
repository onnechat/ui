'use client'

import { cn } from '@/lib/cn'

export function Loader({
  text,
  variant = 'default',
  className,
  iconClassName,
}: {
  text?: string
  variant?: 'default' | 'screen' | 'center' | 'button' | 'clean'
  className?: string
  iconClassName?: string
}) {
  const defaultClasses = cn(
    /**
     * Default inline layout: icon and text centered
     * side by side.
     */
    variant === 'default' &&
    'flex flex-col justify-center items-center gap-2',
    /**
     * Center the loader in the center of the screen
     * if the variant is 'center'.
     */
    variant === 'center' &&
    'flex flex-col flex-1 justify-center items-center gap-4 min-h-dvh',
    /**
     * Center the loader in the center of the screen
     * if the variant is 'screen'.
     */
    variant === 'screen' &&
    'flex flex-col flex-1 justify-center items-center gap-4 min-h-dvh min-w-dvw',
    /**
     * Add padding to the loader if the variant is 'clean'.
     */
    variant === 'clean' &&
    'flex flex-col flex-1 justify-center items-center gap-4 p-24',
    /**
     * Add text color to the loader if the variant
     * is not 'button' to make it less visible.
     */
    variant !== 'button' && 'text-muted-foreground',
  )

  return (
    <div suppressHydrationWarning className={cn(defaultClasses, className)}>
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        xmlns="http://www.w3.org/2000/svg"
        suppressHydrationWarning
        className={cn(
          'animate-spin text-current shrink-0',
          variant === 'button'
            ? 'min-w-3 min-h-3 size-3'
            : 'min-h-5 min-w-5 size-5',
          iconClassName,
        )}
      >
        <path d="M12 2v4" />
        <path d="m16.2 7.8 2.9-2.9" />
        <path d="M18 12h4" />
        <path d="m16.2 16.2 2.9 2.9" />
        <path d="M12 18v4" />
        <path d="m4.9 19.1 2.9-2.9" />
        <path d="M2 12h4" />
        <path d="m4.9 4.9 2.9 2.9" />
      </svg>

      {text && <span className="text-current">{text}</span>}
    </div>
  )
}
