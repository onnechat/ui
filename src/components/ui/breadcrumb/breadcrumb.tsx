import { cn } from '@/lib/cn';

import { Icon } from '@/components/icon';

import { Button } from '@/components/ui/button';

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
  className?: string;
  hideBackButton?: boolean;
  disableLinks?: boolean;
  /** Accessible name (`aria-label`) for the icon-only back link. */
  backAriaLabel?: string;
}

export function Breadcrumb({
  items,
  className,
  hideBackButton,
  disableLinks,
  backAriaLabel = 'Back',
}: BreadcrumbProps) {
  const penultimate = items.length > 1 ? items[items.length - 2] : null;

  return (
    <div className={cn('flex items-center gap-3', className)}>
      {penultimate?.href && !hideBackButton && (
        <Button
          asChild
          size="icon-sm"
          variant="secondary"
          className="text-muted-foreground hover:text-foreground transition-colors"
        >
          <a href={penultimate.href} aria-label={backAriaLabel}>
            <Icon name="ArrowLeft" className="size-4" />
          </a>
        </Button>
      )}

      <nav aria-label="breadcrumb" className="flex items-center gap-1 text-sm">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;

          return (
            <span key={index} className="flex items-center gap-1">
              {index > 0 && (
                <Icon
                  name="ChevronRight"
                  className="size-3.5 text-muted-foreground"
                />
              )}
              {item.href && !isLast && !disableLinks ? (
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
          );
        })}
      </nav>
    </div>
  );
}
