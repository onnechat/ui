'use client'

import { useEffect, useState } from 'react'


import { cn } from '@/lib/cn'

import { useMe } from '@/hooks/user/use-me'

import { Logo } from '@/components/logo'

import { Button } from '@/components/ui/button'
import { SidebarTrigger } from '@/components/ui/sidebar'
import { Skeleton } from '@/components/ui/skeleton'

import { SidebarUser } from './sidebar/sidebar-user'

export const DashboardHeader = ({
  actionPortalClassName,
  actionPortalMobileClassName,
}: {
  actionPortalClassName?: string
  actionPortalMobileClassName?: string
}) => {
  const { me: user, isFetching: isFetchingMe } = useMe()

  const [isSticked, setIsSticked] = useState(false)
  const [scrollY, setScrollY] = useState(0)

  useEffect(() => {
    const spacing = getComputedStyle(document.documentElement)
      .getPropertyValue('--spacing')
      .replace('rem', '')

    const rem = parseFloat(spacing) * 16
    const value = rem * 2

    const handleScroll = () => {
      const scrollY = window.scrollY
      const sticked = scrollY > value

      setIsSticked(sticked)
      setScrollY(scrollY)
    }

    handleScroll()

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <>
      <div className="lg:hidden flex items-center justify-between gap-2 md:gap-4 p-4 min-h-16 h-full max-h-16 glass-dashboard-header max-lg:sticky top-(--announcement-height,0px) z-50 transition-all max-lg:border-b max-lg:border-border/70">
        <div className="flex min-w-0 flex-1 items-center gap-4">
          <a href="/" className="shrink-0 active:scale-99">
            <Logo variant="icon" />
          </a>

          <div className="flex min-h-7 min-w-0 flex-1 items-center overflow-hidden">
            <div
              id="header-title-portal-mobile"
              className="flex min-w-0 flex-1 items-center"
            />
          </div>
        </div>

        <div
          id="header-action-portal-mobile"
          className={actionPortalMobileClassName}
        />

        <Button
          size="icon"
          variant="ghost"
          className="size-10"
          asChild={!(isFetchingMe || !user)}
        >
          {isFetchingMe || !user ? (
            <Skeleton className="size-full" />
          ) : (
            <SidebarUser
              triggerClassName="size-full rounded-2xl"
              itemClassName="w-full"
            />
          )}
        </Button>
      </div>

      <div
        className={cn(
          'max-lg:hidden sticky top-(--announcement-height,0px) z-50 w-full flex items-center gap-2 md:gap-4 p-4 min-h-16 h-full max-h-16 border-b glass-dashboard-header border-border/70 transition-colors',
          isSticked && scrollY > 64 ? 'lg:rounded-t-none' : 'lg:rounded-t-2xl',
        )}
      >
        <SidebarTrigger
          size="icon"
          variant="ghost"
          className="max-lg:hidden"
          iconProps={{ className: '!size-4 text-foreground' }}
        />

        <div className="flex min-h-7 min-w-0 flex-1 items-center overflow-hidden">
          <div
            id="header-title-portal-desktop"
            className="flex min-w-0 flex-1 items-center"
          />
        </div>

        <div
          id="header-action-portal"
          className={cn('ml-auto', actionPortalClassName)}
        />
      </div>
    </>
  )
}
