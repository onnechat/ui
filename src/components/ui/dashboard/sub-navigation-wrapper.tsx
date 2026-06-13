'use client'

import * as React from 'react'

import { cn } from '@/lib/cn'

import { useIsMobile } from '@/hooks/use-mobile'

import { Icon, type IconType } from '@/components/icon'

import { Button } from '@/components/internal/button'
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerTrigger,
} from '@/components/internal/drawer'
import { SidebarMenuButton } from '@/components/internal/sidebar'

/**
 * Mirrors `SidebarMenuButton` classes in `sidebar-item.tsx`.
 * Used for the sub navigation wrapper.
 **/
const subNavMenuButtonClassName =
  'relative z-10 group/menu-button hover:bg-sidebar-accent! data-[active=true]:bg-transparent data-[active=false]:hover:text-foreground/75 h-auto! p-2.5! text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2.5 data-[disabled=true]:pointer-events-none data-[disabled=true]:opacity-50 transition-[transform,opacity] duration-200 active:scale-[99.35%] cursor-pointer shrink-0 w-full'

export interface InnerNavigationItem {
  label: string
  icon: IconType
  href: string
  disabled?: boolean
  exact?: boolean
  iconClassName?: {
    active?: string
    inactive?: string
  }
}

function useActiveSubNavItem(items: InnerNavigationItem[], pathname: string) {
  return React.useMemo(() => {
    const active = items.find((item) => {
      const d = item.disabled ?? false
      if (d) return false

      return item.exact
        ? pathname === item.href
        : pathname.startsWith(item.href)
    })

    if (active) return active

    const firstEnabled = items.find((i) => !i.disabled)
    return firstEnabled ?? items[0]
  }, [items, pathname])
}

function SubNavListItem({
  item,
  pathname,
  variant,
}: {
  item: InnerNavigationItem
  pathname: string
  variant: 'desktop' | 'drawer'
}) {
  const isDisabled = item.disabled ?? false
  const isActive =
    !isDisabled &&
    (item.exact ? pathname === item.href : pathname.startsWith(item.href))

  const row = (
    <>
      <div
        className={cn(
          'flex aspect-square size-4 shrink-0 items-center justify-center',
          isActive ? 'text-primary' : 'text-secondary',
        )}
      >
        <Icon
          name={item.icon}
          className={cn(
            isActive
              ? item.iconClassName?.active
              : item.iconClassName?.inactive,
          )}
        />
      </div>

      <span data-active={isActive} className="min-w-0 flex-1 truncate text-sm">
        {item.label}
      </span>

      {item.disabled && (
        <Icon name="Lock" className="ml-auto size-4 shrink-0" />
      )}
    </>
  )

  const linkClassName = cn(
    'flex min-w-0 w-full items-center gap-3',
    isDisabled && 'cursor-blocked',
  )

  return (
    <li>
      <SidebarMenuButton
        asChild
        isActive={isActive}
        disabled={isDisabled}
        className={subNavMenuButtonClassName}
      >
        {isDisabled ? (
          <div
            className={cn(linkClassName, 'cursor-default')}
            role="presentation"
          >
            {row}
          </div>
        ) : variant === 'drawer' ? (
          <DrawerClose asChild>
            <a href={item.href} className={linkClassName}>
              {row}
            </a>
          </DrawerClose>
        ) : (
          <a href={item.href} className={linkClassName}>
            {row}
          </a>
        )}
      </SidebarMenuButton>
    </li>
  )
}

interface SubNavigationWrapperProps {
  items: InnerNavigationItem[]
  children: React.ReactNode
  className?: string
}

export function SubNavigationWrapper({
  items,
  children,
  className,
}: SubNavigationWrapperProps) {
  const pathname = "/";
  const isMobile = useIsMobile()

  const [drawerOpen, setDrawerOpen] = React.useState(false)

  const activeItem = useActiveSubNavItem(items, pathname)
  const triggerIsActive = Boolean(
    activeItem &&
    !activeItem.disabled &&
    (activeItem.exact
      ? pathname === activeItem.href
      : pathname.startsWith(activeItem.href)),
  )

  React.useEffect(() => {
    setDrawerOpen(false)
  }, [pathname])

  return (
    <div
      className={cn(
        'grid w-full min-w-0 grid-cols-1 gap-4 lg:gap-6 lg:grid-cols-[14rem_1fr]',
        className,
      )}
    >
      <div className="min-w-0 lg:sticky lg:self-start">
        {isMobile ? (
          <Drawer
            direction="bottom"
            open={drawerOpen}
            onOpenChange={setDrawerOpen}
          >
            <DrawerTrigger asChild>
              <Button
                type="button"
                variant="outline"
                className="h-auto min-h-10 w-full justify-between gap-2 py-2.5"
                aria-label={'openMenu'}
              >
                <span className="flex min-w-0 items-center gap-2 text-left font-normal">
                  {activeItem && (
                    <>
                      <div
                        className={cn(
                          'flex size-4 shrink-0 items-center justify-center',
                          triggerIsActive ? 'text-primary' : 'text-secondary',
                        )}
                      >
                        <Icon name={activeItem.icon} />
                      </div>

                      <span className="truncate font-medium">
                        {activeItem.label}
                      </span>
                    </>
                  )}
                </span>

                <Icon
                  aria-hidden
                  name="ChevronDown"
                  className="ml-auto size-4 shrink-0 opacity-70"
                />
              </Button>
            </DrawerTrigger>

            <DrawerContent showDivider title={'sheetTitle'}>
              <nav
                aria-label="Section"
                className="max-h-[min(60vh,24rem)] overflow-y-auto overflow-x-hidden px-2 pb-[max(1rem,env(safe-area-inset-bottom))] pt-2"
              >
                <ul className="flex flex-col gap-1">
                  {items.map((item) => (
                    <SubNavListItem
                      key={item.label}
                      item={item}
                      pathname={pathname}
                      variant="drawer"
                    />
                  ))}
                </ul>
              </nav>
            </DrawerContent>
          </Drawer>
        ) : (
          <nav aria-label="Section" className="min-w-0">
            <ul className="flex flex-col gap-1">
              {items.map((item) => (
                <SubNavListItem
                  key={item.label}
                  item={item}
                  pathname={pathname}
                  variant="desktop"
                />
              ))}
            </ul>
          </nav>
        )}
      </div>

      <main className="w-full min-w-0 overflow-x-hidden space-y-4">
        {children}
      </main>
    </div>
  )
}
