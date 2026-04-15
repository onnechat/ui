import { cn } from '@/lib/cn'
import { env } from '@/lib/env'
import { version } from '@/lib/version'

export const CopyrightVersion = ({ className }: { className?: string }) => {
  return (
    <span
      suppressHydrationWarning
      className={cn('text-xs text-muted-foreground/50 p-2', className)}
    >
      &copy; {new Date().getFullYear()} {env.brand.name} — {version.semver}
    </span>
  )
}
