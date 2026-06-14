
import { cn } from '@/lib/cn'

import { Icon } from '@/components/icon'

import { Button } from '@/components/ui/button'

interface BreadcrumbItem {
  label: string
  href?: string
}

interface PageBreadcrumbProps {
  items: BreadcrumbItem[]
  className?: string
}

export function PageBreadcrumb({ items, className }: PageBreadcrumbProps) {
  const penultimate = items.length > 1 ? items[items.length - 2] : null

  return (
    <div className={cn('flex items-center gap-3', className)}>
      {penultimate?.href && (
        <Button
          asChild
          size="icon-sm"
          variant="secondary"
          className="rounded-lg! text-muted-foreground hover:text-foreground transition-colors"
        >
          <a href={penultimate.href}>
            <Icon name="ArrowLeft" className="size-4" />
          </a>
        </Button>
      )}

      <nav aria-label="breadcrumb" className="flex items-center gap-1 text-sm">
        {items.map((item, index) => {
          const isLast = index === items.length - 1

          return (
            <span key={index} className="flex items-center gap-1">
              {index > 0 && (
                <Icon
                  name="ChevronRight"
                  className="size-3.5 text-muted-foreground"
                />
              )}
              {item.href && !isLast ? (
                <a
                  href={item.href}
                  className={cn(
                    'inline-flex items-center rounded-lg text-muted-foreground hover:text-foreground',
                    'outline-none focus-visible:outline-none focus-visible:ring-inset focus-visible:ring-[3px] focus-visible:ring-ring/50',
                  )}
                >
                  {item.label}
                </a>
              ) : (
                <span
                  className={cn(
                    isLast
                      ? 'text-foreground font-medium'
                      : 'text-muted-foreground',
                  )}
                >
                  {item.label}
                </span>
              )}
            </span>
          )
        })}
      </nav>
    </div>
  )
}
