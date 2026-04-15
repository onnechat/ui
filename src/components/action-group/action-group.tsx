import React from 'react'

import { cn } from '@/lib/cn'

import { Icon, type IconType } from '@/components/icon'

import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

type ActionItem = {
  label: string
  icon?: IconType
  href?: string
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void
  disabled?: boolean
  className?: string
}

export function ActionGroup({
  items,
  disabled,
  children,
  className,
}: {
  items: ActionItem[][]
  disabled?: boolean
  className?: string
  children?: React.ReactNode
}) {
  const itemsLength = items?.flat().length ?? 0
  const isDisabled = !!disabled || itemsLength === 0

  return (
    <div className="flex justify-end">
      <DropdownMenu>
        <DropdownMenuTrigger
          asChild
          disabled={isDisabled}
          className={className}
          data-action-group-trigger
          onClick={(e) => e.stopPropagation()}
        >
          {children ?? (
            <Button
              variant="ghost"
              disabled={isDisabled}
              className=" min-h-8 min-w-8 max-h-8 max-w-8 p-0 shrink-0"
            >
              <Icon className="h-4 w-4" name="MoreHorizontal" />
            </Button>
          )}
        </DropdownMenuTrigger>

        <DropdownMenuContent
          align="end"
          className="min-w-36 w-(--radix-dropdown-menu-trigger-width) bg-sidebar/50 rounded-2xl overflow-hidden"
        >
          {items.map((group, groupIndex) => {
            const isLastGroup = groupIndex === items.length - 1

            return (
              <React.Fragment key={groupIndex}>
                <DropdownMenuGroup key={groupIndex} className="flex flex-col">
                  {group.map((item, itemIndex) => {
                    const isFirst = groupIndex === 0 && itemIndex === 0
                    const isLast = isLastGroup && itemIndex === group.length - 1

                    return (
                      <DropdownMenuItem
                        key={`${item.label}-${itemIndex}`}
                        onClick={(e) => {
                          e.stopPropagation()
                          item.onClick?.(
                            e as unknown as React.MouseEvent<HTMLButtonElement>,
                          )
                        }}
                        className={cn(
                          'text-muted-foreground',
                          isFirst && 'rounded-t-xl',
                          isLast && 'rounded-b-xl',
                          item.disabled && 'opacity-50 cursor-not-allowed',
                          'flex items-center gap-2 w-full relative z-10 group/menu-button hover:bg-muted! data-[active=true]:bg-transparent data-[active=false]:hover:text-foreground/75 text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2.5 data-[disabled=true]:pointer-events-none data-[disabled=true]:opacity-50 transition-[transform,opacity] duration-200 active:scale-[99.35%] outline-none cursor-pointer ring-0!',
                          item.className,
                        )}
                      >
                        <Icon
                          name={item.icon ?? 'MoreHorizontal'}
                          className="size-4 text-current"
                        />

                        {item.label}
                      </DropdownMenuItem>
                    )
                  })}
                </DropdownMenuGroup>

                {!isLastGroup && (
                  <DropdownMenuSeparator className="max-lg:hidden" />
                )}
              </React.Fragment>
            )
          })}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
