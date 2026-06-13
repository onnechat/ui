import { cn } from '@/lib/cn'

function Skeleton({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="skeleton"
      suppressHydrationWarning
      className={cn('bg-skeleton animate-pulse rounded-2xl', className)}
      {...props}
    />
  )
}

export { Skeleton }
