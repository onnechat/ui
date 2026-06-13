'use client'

import { cn } from '@/lib/cn'

import { Icon, type IconType } from '@/components/icon'

import { Card } from '@/components/card'

export function EmptyState({
  icon = 'Archive',
  title,
  description,
  children,
  variant = 'default',
  className,
}: {
  icon?: IconType
  title?: string
  description?: string
  children?: React.ReactNode
  variant?: 'default' | 'embedded' | 'flat'
  className?: string
}) {

  return (
    <Card className={cn(
      ['embedded', 'flat'].includes(variant) && 'p-0',
    )}>
      <Card.Content
        className={cn(
          'flex flex-col items-center justify-center gap-4 text-center',
          variant === 'flat' ? 'rounded-none bg-transparent p-0' : 'rounded-xl p-8',
          className,
        )}
      >
        {icon && (
          <Icon
            name={icon}
            className="size-8 text-muted-foreground"
          />
        )}

        {(title || description) && (
          <div className="flex flex-col items-center justify-center gap-1 text-balance max-w-md">
            {title && (
              <p className="text-foreground text-lg">
                {title}
              </p>
            )}

            {description && (
              <p className="text-muted-foreground text-sm">
                {description}
              </p>
            )}
          </div>
        )}

        {children}
      </Card.Content>
    </Card>
  )
}
