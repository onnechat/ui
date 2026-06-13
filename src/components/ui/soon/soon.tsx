import { cn } from '@/lib/cn'

export function Soon({
  children,
  className,
}: {
  children?: React.ReactNode
  className?: string
}) {
  return (
    <span
      className={cn(
        'text-xs text-nowrap min-w-fit uppercase bg-accent text-accent-foreground rounded-lg px-2 py-0.5 scale-90 origin-right select-none',
        className,
      )}
    >
      {children ?? 'Em breve'}
    </span>
  )
}
