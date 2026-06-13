'use client'

import Cookies from 'js-cookie'

import { useCallback, useEffect, useState } from 'react'


import { AnimatePresence, motion } from 'motion/react'

import { cn } from '@/lib/cn'

import { useHaptics } from '@/hooks/use-haptics'
import { useWorkspace } from '@/hooks/workspaces/use-workspace'

import { ANIMATION } from '@/constants/animations'
import { COOKIES_KEYS } from '@/constants/keys'

import { Icon, type IconType } from '@/components/icon'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/internal/avatar'

import type { MenuItem } from './sidebar/data'

type NavbarMenuItem = MenuItem & { noBasePath?: boolean; catchAll?: boolean }

interface NavbarIconProps {
  item: NavbarMenuItem
  isActive: boolean
  workspace: { name: string; logoUrl?: string | null } | null | undefined
}

function NavbarIcon({ item, isActive, workspace }: NavbarIconProps) {
  if (item.url === '/menu' && workspace) {
    return (
      <Avatar className="relative flex shrink-0 overflow-hidden size-7 rounded-md">
        <AvatarImage
          src={workspace.logoUrl ?? undefined}
          alt={workspace.name}
          className="size-full object-cover"
        />
        <AvatarFallback name={workspace.name} />
      </Avatar>
    )
  }

  return (
    <Icon
      name={item.icon as IconType}
      className={cn(
        'size-full shrink-0',
        isActive ? 'text-primary' : 'text-muted-foreground',
      )}
    />
  )
}

export function AppNavbar() {
  const pathname = "/";
  const { trigger } = useHaptics()

  const [slug, setSlug] = useState<string>('')
  const { workspace } = useWorkspace(slug)

  const NAVBAR_MENU: NavbarMenuItem[] = [
    {
      title: 'Visão Geral',
      icon: 'House',
      url: '/',
    },
    {
      title: 'Calendário',
      icon: 'Calendar',
      url: '/calendar',
    },
    {
      title: workspace?.name || 'Estabelecimento',
      icon: 'ApartmentBuilding',
      url: '/menu',
      catchAll: true,
    },
  ]

  const extractSlugFromPathname = useCallback((path: string): string => {
    const match = path.match(/^\/workspace\/([^/]+)/)
    return match ? match[1] : ''
  }, [])

  const getCurrentSlug = useCallback(async () => {
    const pathnameSlug = extractSlugFromPathname(pathname)

    if (pathnameSlug) {
      return pathnameSlug
    }

    return Cookies.get(COOKIES_KEYS.WORKSPACE_SLUG) ?? ''
  }, [pathname, extractSlugFromPathname])

  const isEmptySlug = slug === '' || slug === null

  const handleRefresh = () => {
    window.location.reload()
  }

  const handleCalendarNavigation = () => {
    if (pathname.includes('/calendar')) {
      window.dispatchEvent(new CustomEvent('calendar-reset-view'))
    }
  }

  useEffect(() => {
    const fetchSlug = async () => {
      const slug = await getCurrentSlug()
      setSlug(slug)
    }

    fetchSlug()
  }, [getCurrentSlug])

  return (
    <nav
      className={cn(
        'fixed bottom-0 left-0 lg:hidden z-50',
        'flex flex-col items-center justify-center w-full min-h-[100px]',
        'pointer-events-none',
      )}
    >
      <div className="absolute inset-0 translate-y-0 bg-linear-to-t from-black/30 to-transparent pointer-events-none -z-10" />

      <div id="navbar-portal" className="z-1 pointer-events-auto" />

      <ul className="relative flex items-center justify-center gap-4 w-full h-full">
        <div id="navbar-left-portal" className="pointer-events-auto" />

        <motion.div
          id="navbar-center"
          layout
          transition={{ duration: ANIMATION.DURATION_FLOAT, ease: 'easeInOut' }}
          className="flex items-center justify-center gap-1 w-fit glass-dashboard-chrome border border-border/50 p-1 rounded-2xl overflow-hidden z-10 pointer-events-auto"
        >
          <AnimatePresence mode="popLayout" initial={false}>
            {isEmptySlug ? (
              <motion.button
                key="refresh"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: ANIMATION.DURATION_FLOAT }}
                onClick={handleRefresh}
                className="size-14 flex items-center justify-center p-4.5 rounded-xl transition-colors cursor-pointer bg-accent/50"
              >
                <Icon
                  name="Refresh2"
                  strokeWidth={1.25}
                  className="size-6 animate-spin fill-transparent"
                />
              </motion.button>
            ) : (
              NAVBAR_MENU.map((item) => {
                const basePath =
                  item.noBasePath || !slug ? '' : `/workspace/${slug}`

                let computedUrl = item.url

                if (computedUrl) {
                  if (computedUrl !== '/' && computedUrl.endsWith('/')) {
                    computedUrl = computedUrl.slice(0, -1)
                  }

                  if (computedUrl.startsWith('/')) {
                    computedUrl = `${basePath}${computedUrl}`
                  }
                }

                const isInsideWorkspace =
                  !!basePath && pathname.startsWith(basePath)

                const currentPath = isInsideWorkspace
                  ? pathname.slice(basePath.length) || '/'
                  : pathname

                const exclusiveUrls = NAVBAR_MENU.filter(
                  (m) => !m.catchAll,
                ).map((m) => m.url)

                const isLink = !!('url' in item && computedUrl)
                const isActive =
                  isLink &&
                  (item.catchAll
                    ? isInsideWorkspace && !exclusiveUrls.includes(currentPath)
                    : currentPath === item.url)

                const className = cn(
                  'size-14 flex items-center justify-center p-4.5 rounded-xl transition-colors text-xs',
                  isActive
                    ? cn(
                        'bg-primary/5 hover:bg-primary/25',
                        'dark:bg-primary/5 dark:hover:bg-primary/2',
                      )
                    : 'bg-transparent hover:bg-accent/50',
                )

                if (isLink && computedUrl) {
                  return (
                    <motion.div
                      key={item.title}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      transition={{ duration: ANIMATION.DURATION_FLOAT }}
                    >
                      <a
                        href={computedUrl}
                        className={className}
                        onClick={() => {
                          trigger('click')
                          if (item.title === 'Calendário') {
                            handleCalendarNavigation()
                          }
                        }}
                      >
                        <NavbarIcon
                          item={item}
                          isActive={isActive}
                          workspace={workspace}
                        />
                      </a>
                    </motion.div>
                  )
                } else {
                  return (
                    <motion.button
                      key={item.title}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      transition={{ duration: ANIMATION.DURATION_FLOAT }}
                      className={className}
                      onClick={() => {
                        trigger('click')
                        item.onClick?.()
                      }}
                    >
                      <NavbarIcon
                        item={item}
                        isActive={isActive}
                        workspace={workspace}
                      />
                    </motion.button>
                  )
                }
              })
            )}
          </AnimatePresence>
        </motion.div>

        <div id="navbar-right-portal" className="pointer-events-auto" />
      </ul>
    </nav>
  )
}
