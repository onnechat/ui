'use client'

import { cn } from '@/lib/cn'

import { Icon, type IconType } from '@/components/icon'

import { Card } from './card'

export function EmptyState({
  icon,
  title,
  description,
  children,
  variant = 'default',
  className,
  classNames,
}: {
  icon: IconType
  title?: string
  description?: string
  children?: React.ReactNode
  /**
   * - `embedded` — removes outer `Card` padding (`p-0`) when nested in another
   *   `Card` or padded region (see workspace appearance preview).
   * - `embeddedFlat` — same as `embedded`, plus strips inner content chrome
   *   (`bg-muted`, default padding) so the empty state does not look like a
   *   second card (dialogs, dropzones, dev tools). Add spacing with
   *   `className` or `classNames.content` (e.g. `p-6`, `py-8`).
   */
  variant?: 'default' | 'embedded' | 'embeddedFlat'
  className?: string
  classNames?: {
    card?: string
    icon?: string
    title?: string
    content?: string
    description?: string
  }
}) {
  const isEmbedded = variant === 'embedded' || variant === 'embeddedFlat'
  const isFlat = variant === 'embeddedFlat'

  return (
    <Card className={cn(isEmbedded && 'p-0', classNames?.card)}>
      <Card.Content
        className={cn(
          'flex flex-col items-center justify-center gap-4 text-center',
          isFlat ? 'rounded-none bg-transparent p-0' : 'rounded-xl p-8',
          className,
          classNames?.content,
        )}
      >
        {icon && (
          <Icon
            name={icon}
            className={cn('size-8 text-muted-foreground', classNames?.icon)}
          />
        )}

        <div className="flex flex-col items-center justify-center gap-2 text-balance max-w-md">
          {title && (
            <p className={cn('text-foreground text-lg', classNames?.title)}>
              {title}
            </p>
          )}

          {description && (
            <p
              className={cn(
                'text-muted-foreground text-sm',
                classNames?.description,
              )}
            >
              {description}
            </p>
          )}
        </div>

        {children}
      </Card.Content>
    </Card>
  )
}
