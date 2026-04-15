'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

import { cn } from '@/lib/cn'

import { Icon, type IconType } from '@/components/icon'

export interface SubNavigationTabItem {
  label: string
  icon: IconType
  href: string
  exact?: boolean
  disabled?: boolean
  badge?: React.ReactNode
  iconClassName?: {
    active?: string
    inactive?: string
  }
}

interface SubNavigationTabsProps {
  items: SubNavigationTabItem[]
  children: React.ReactNode
  className?: string
  contentClassName?: string
}

export function SubNavigationTabs({
  items,
  children,
  className,
  contentClassName,
}: SubNavigationTabsProps) {
  const pathname = usePathname()

  return (
    <div className={cn('grid w-full', className)}>
      <div className="[--header-height:4rem] sticky top-[calc(var(--announcement-height,0px)+var(--header-height))] group/navigation [--navigation-padding:.65rem] flex flex-nowrap items-start gap-1 w-full overflow-x-auto overflow-y-hidden z-10 px-4 pt-(--navigation-padding) border-b border-border/70 h-(--header-height) glass-dashboard-header">
        {items.map((item) => {
          const isActive = item.exact
            ? pathname === item.href
            : pathname.startsWith(item.href)

          const isDisabled = item.disabled ?? false
          const Comp = isDisabled ? 'div' : Link

          return (
            <Comp
              key={item.label}
              href={item.href}
              className={cn(
                'group/nav-item relative h-full outline-none focus-visible:outline-none',
                !isDisabled && 'sub-navigation-tab-link',
                isActive ? 'text-foreground' : 'text-muted-foreground',
                'transition-all duration-300 pb-(--navigation-padding)',
                isDisabled && 'opacity-50 pointer-events-none select-none',
              )}
            >
              <div className="flex items-center gap-2 lg:gap-2.5 navigation-tabs rounded-xl outline-none transition-all duration-100 hover:bg-card hover:text-foreground">
                <Icon
                  name={item.icon}
                  className={cn(
                    'size-4',
                    isActive
                      ? cn('text-primary', item.iconClassName?.active)
                      : cn(
                          'text-muted-foreground',
                          item.iconClassName?.inactive,
                        ),
                  )}
                />

                <span className="text-sm text-nowrap">{item.label}</span>

                {item.badge}
              </div>

              <div
                className={cn(
                  'hidden lg:block absolute bottom-0 left-0 w-full h-[0.15rem] rounded-t-full transition-all duration-200',
                  isActive
                    ? 'bg-foreground'
                    : 'bg-transparent translate-y-full group-hover/nav-item:bg-accent group-hover/nav-item:translate-y-0',
                )}
              />
            </Comp>
          )
        })}
      </div>

      <div
        className={cn(
          'p-4 w-full overflow-x-hidden space-y-4',
          contentClassName,
        )}
      >
        {children}
      </div>
    </div>
  )
}
