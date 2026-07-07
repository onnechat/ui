import React from 'react'

import { cn } from '@/lib/cn'

import { Icon, type IconType } from '@/components/icon'

import { Button } from '@/components/ui/button'
import { DropdownMenu } from '@/components/ui/dropdown-menu'
import type { ComponentVariant } from '@/types'

type ActionItem = {
  label: string
  icon?: IconType
  href?: string
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void
  disabled?: boolean
  className?: string
  variant?: ComponentVariant
}

type ActionGroupAlign = 'start' | 'center' | 'end'

export function ActionGroup({
  items = [],
  disabled,
  children,
  className,
  align = 'end',
}: {
  items?: ActionItem[][]
  disabled?: boolean
  className?: string
  children?: React.ReactNode
  align?: ActionGroupAlign
}) {
  const itemsLength = items.flat().length
  const isDisabled = !!disabled || itemsLength === 0

  return (
    <DropdownMenu>
      <DropdownMenu.Trigger
        asChild
        disabled={isDisabled}
        className={className}
        data-action-group-trigger
        onClick={(e) => e.stopPropagation()}
      >
        {children ?? (
          <Button
            variant="secondary"
            disabled={isDisabled}
            className="relative min-h-8 min-w-8 max-h-8 max-w-8 p-0 shrink-0 disabled:opacity-50"
          >
            <Icon className="h-4 w-4" name="Dots" />

            {isDisabled && (
              <div className="absolute top-0 right-0 bg-card rounded-full p-1">
                <Icon className="size-2 shrink-0" name="Lock" />
              </div>
            )}
          </Button>
        )}
      </DropdownMenu.Trigger>

      <DropdownMenu.Content
        align={align}
        className="min-w-36 w-(--anchor-width) bg-sidebar/50 rounded-2xl overflow-hidden"
      >
        {items.map((group, groupIndex) => {
          const isLastGroup = groupIndex === items.length - 1

          return (
            <React.Fragment key={groupIndex}>
              <DropdownMenu.Group key={groupIndex} className="flex flex-col">
                {group.map((item, itemIndex) => {
                  const isFirst = groupIndex === 0 && itemIndex === 0
                  const isLast = isLastGroup && itemIndex === group.length - 1

                  return (
                    <DropdownMenu.Item
                      key={`${item.label}-${itemIndex}`}
                      onClick={(e) => {
                        e.stopPropagation()
                        item.onClick?.(
                          e as unknown as React.MouseEvent<HTMLButtonElement>,
                        )
                      }}
                      data-variant={item.variant ?? 'default'}
                      className={cn(
                        'text-muted-foreground',
                        isFirst && 'rounded-t-xl',
                        isLast && 'rounded-b-xl',
                        item.disabled && 'opacity-50 cursor-not-allowed',
                        'flex items-center gap-2 w-full relative z-10 group/menu-button hover:bg-muted! data-[active=true]:bg-transparent data-[active=false]:hover:text-foreground/75 text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2.5 data-[disabled=true]:pointer-events-none data-[disabled=true]:opacity-50 transition-[transform,opacity] duration-200 active:scale-[99.35%] outline-none cursor-pointer ring-0!',
                        'data-[variant=destructive]:text-destructive data-[variant=destructive]:hover:text-destructive/80 data-[variant=destructive]:hover:bg-destructive/10! data-[variant=destructive]:hover:border-destructive/20',
                        item.className,
                      )}
                    >
                      <Icon
                        name={item.icon ?? 'Dots'}
                        className="size-4 text-current"
                      />

                      {item.label}
                    </DropdownMenu.Item>
                  )
                })}
              </DropdownMenu.Group>

              {!isLastGroup && (
                <DropdownMenu.Separator className="max-lg:hidden" />
              )}
            </React.Fragment>
          )
        })}
      </DropdownMenu.Content>
    </DropdownMenu>
  )
}
