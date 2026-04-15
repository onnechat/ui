'use client'

import Cookies from 'js-cookie'

import { useCallback, useEffect, useRef, useState } from 'react'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useTranslations } from 'next-intl'

import { AnimatePresence, motion } from 'motion/react'

import { cn } from '@/lib/cn'

import { extractWorkspaceSlugFromPathname } from '@/utils/workspace-pathname'

import { useRoles } from '@/hooks/use-roles'

import { COOKIES_KEYS, COOKIES_TTL } from '@/constants/keys'

import { CopyrightVersion } from '@/components/copyright-version'
import {
  HelpDialog,
  useHelpDialog,
} from '@/components/dashboard/dialogs/help/help.dialog'
import { SetupWidget } from '@/components/dashboard/setup-widget'
import { Kbd } from '@/components/kbd'
import { Loader } from '@/components/loader'
import { Logo } from '@/components/logo'

import {
  Sidebar,
  SIDEBAR_WIDTH,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarRail,
  useSidebar,
} from '@/components/ui/sidebar'

import {
  SidebarCommandPalette,
  useSidebarCommandPalette,
} from './command-palette'
import { getSidebarMenu, type Menu, resolveWorkspaceMenuHref } from './data'
import { animation, SidebarItem } from './sidebar-item'
import { SidebarNotification } from './sidebar-notification'
import { SidebarUser } from './sidebar-user'
import {
  SidebarWorkspace,
  SidebarWorkspaceSelectPrompt,
} from './sidebar-workspace'

import { useWorkspaceSettingsNavigation } from '@/app/(logged)/(sidebar)/workspace/[slug]/settings/_components/navigation'

type AppSidebarProps = React.ComponentProps<typeof Sidebar> & {
  menus?: Menu[]
  bottomMenus?: Menu[]
  menusKey?: string
  showWorkspace?: boolean
  showSetupWidget?: boolean
}

const MIN_SIDEBAR_WIDTH = 16 * 16 // 16rem
const MAX_SIDEBAR_WIDTH = 20 * 16 // 20rem

const DEFAULT_SIDEBAR_WIDTH = SIDEBAR_WIDTH

export const AppSidebar = ({
  menus,
  bottomMenus,
  showWorkspace = true,
  showSetupWidget = false,
  ...props
}: AppSidebarProps) => {
  const router = useRouter()
  const pathname = usePathname()

  const {
    toggleSidebar,
    setSidebarWidth,
    setOpen,
    open: isSidebarOpen,
  } = useSidebar()

  const { toggle: toogleHelpDialog } = useHelpDialog()

  const t = useTranslations('logged.sidebar')

  const { isAdmin } = useRoles()
  const { items: settingsItems } = useWorkspaceSettingsNavigation()

  const pathnameSlug = extractWorkspaceSlugFromPathname(pathname)

  const { openCommandPalette } = useSidebarCommandPalette()

  const [isDragging, setIsDragging] = useState(false)
  const railClickTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const [slug, setSlug] = useState(pathnameSlug || '')
  const [isLoadingSlug, setIsLoadingSlug] = useState(
    showWorkspace && !pathnameSlug,
  )

  const handleRailClick = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      const wrapper = (e.currentTarget as HTMLElement).closest<HTMLElement>(
        '[data-slot="sidebar-wrapper"]',
      )

      if (railClickTimer.current) {
        clearTimeout(railClickTimer.current)
        railClickTimer.current = null

        if (!wrapper) return

        wrapper.style.setProperty('--sidebar-width', DEFAULT_SIDEBAR_WIDTH)
        setSidebarWidth(DEFAULT_SIDEBAR_WIDTH)

        Cookies.set(COOKIES_KEYS.SIDEBAR_WIDTH, DEFAULT_SIDEBAR_WIDTH, {
          expires: COOKIES_TTL.SIDEBAR_WIDTH / 86400,
          path: '/',
        })

        return
      }

      railClickTimer.current = setTimeout(() => {
        railClickTimer.current = null
        toggleSidebar()
      }, 150)
    },
    [toggleSidebar, setSidebarWidth],
  )

  const handleResizeMouseDown = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      const wrapper = (e.currentTarget as HTMLElement).closest<HTMLElement>(
        '[data-slot="sidebar-wrapper"]',
      )

      if (!wrapper) return

      const startX = e.clientX

      document.body.style.cursor = 'col-resize'
      document.body.style.userSelect = 'none'

      const container = wrapper.querySelector<HTMLElement>(
        '[data-slot="sidebar-container"]',
      )

      const gap = wrapper.querySelector<HTMLElement>(
        '[data-slot="sidebar-gap"]',
      )

      const disableTransitions = () => {
        if (container) container.style.transition = 'none'
        if (gap) gap.style.transition = 'none'
      }

      const restoreTransitions = () => {
        if (container) container.style.transition = ''
        if (gap) gap.style.transition = ''
      }

      if (!isSidebarOpen) {
        let dragStarted = false

        const handleMouseMove = (moveEvent: MouseEvent) => {
          const delta = moveEvent.clientX - startX

          if (!dragStarted) {
            if (Math.abs(delta) < 4) return

            dragStarted = true
            setIsDragging(true)

            wrapper.style.setProperty(
              '--sidebar-width',
              `${MIN_SIDEBAR_WIDTH}px`,
            )
            setOpen(true)
          }

          const newWidth = Math.max(
            MIN_SIDEBAR_WIDTH,
            Math.min(MAX_SIDEBAR_WIDTH, MIN_SIDEBAR_WIDTH + delta),
          )

          wrapper.style.setProperty('--sidebar-width', `${newWidth}px`)
        }

        const handleMouseUp = (upEvent: MouseEvent) => {
          document.body.style.cursor = ''
          document.body.style.userSelect = ''

          window.removeEventListener('mousemove', handleMouseMove)
          window.removeEventListener('mouseup', handleMouseUp)

          if (!dragStarted) return

          setIsDragging(false)

          if (upEvent.clientX - startX < -10) {
            wrapper.style.setProperty(
              '--sidebar-width',
              `${MIN_SIDEBAR_WIDTH}px`,
            )

            setOpen(false)
          } else {
            const newWidth = wrapper.style
              .getPropertyValue('--sidebar-width')
              .trim()

            Cookies.set(COOKIES_KEYS.SIDEBAR_WIDTH, newWidth, {
              expires: COOKIES_TTL.SIDEBAR_WIDTH / 86400,
              path: '/',
            })

            setSidebarWidth(newWidth)
          }
        }

        window.addEventListener('mousemove', handleMouseMove)
        window.addEventListener('mouseup', handleMouseUp)

        return
      }

      setIsDragging(true)
      disableTransitions()

      const rawWidth = wrapper.style.getPropertyValue('--sidebar-width')
      const startWidth = rawWidth
        ? rawWidth.endsWith('rem')
          ? parseFloat(rawWidth) * 16
          : parseFloat(rawWidth)
        : MIN_SIDEBAR_WIDTH

      let collapsed = false

      const handleMouseMove = (moveEvent: MouseEvent) => {
        const delta = moveEvent.clientX - startX

        if (startWidth + delta < MIN_SIDEBAR_WIDTH) {
          collapsed = true
          return
        }

        collapsed = false

        const newWidth = Math.min(MAX_SIDEBAR_WIDTH, startWidth + delta)
        wrapper.style.setProperty('--sidebar-width', `${newWidth}px`)
      }

      const handleMouseUp = () => {
        document.body.style.cursor = ''
        document.body.style.userSelect = ''

        setIsDragging(false)
        restoreTransitions()

        window.removeEventListener('mousemove', handleMouseMove)
        window.removeEventListener('mouseup', handleMouseUp)

        if (collapsed) {
          toggleSidebar()
        } else {
          const newWidth = wrapper.style
            .getPropertyValue('--sidebar-width')
            .trim()

          Cookies.set(COOKIES_KEYS.SIDEBAR_WIDTH, newWidth, {
            expires: COOKIES_TTL.SIDEBAR_WIDTH / 86400,
            path: '/',
          })

          setSidebarWidth(newWidth)
        }
      }

      window.addEventListener('mousemove', handleMouseMove)
      window.addEventListener('mouseup', handleMouseUp)
    },
    [toggleSidebar, setSidebarWidth, isSidebarOpen, setOpen],
  )

  const SIDEBAR_MENU = menus ?? getSidebarMenu(t)

  /**
   * Workspace-scoped routes (overview, calendar, …)
   * only make sense with a slug.
   **/
  const hasWorkspaceContext = !showWorkspace || !!slug

  const BOTTOM_MENU = bottomMenus ?? [
    {
      title: t('sections.others'),
      items: [
        {
          title: t('items.helpAndDoubts'),
          icon: 'Headset',
          url: '#',
          onClick: toogleHelpDialog,
        },
      ],
    },
  ]

  const RENDER_MENU = (menus: Menu[]) => {
    return (
      <div className="flex flex-col gap-4">
        <AnimatePresence initial={false}>
          {menus.map(({ title, items, paths, basePath }, index) => {
            const render = paths?.some((p) => pathname.startsWith(p)) || true
            if (!render) return null

            return (
              <SidebarGroup key={`${index}-${basePath}`} className="p-0">
                {title && (
                  <motion.span
                    {...animation({ direction: 'right' })}
                    className="text-xs text-muted-foreground/50 font-medium uppercase p-2"
                  >
                    {title}
                  </motion.span>
                )}

                {items && (
                  <SidebarGroupContent className="flex flex-col gap-1">
                    {items.map((item, index) => {
                      if (!item.url) return null

                      const computedUrl = resolveWorkspaceMenuHref(
                        item.url,
                        basePath,
                        showWorkspace,
                        slug,
                      )

                      return (
                        <SidebarItem
                          index={index}
                          key={`${computedUrl}-${index}`}
                          item={{ ...item, url: computedUrl }}
                        />
                      )
                    })}
                  </SidebarGroupContent>
                )}
              </SidebarGroup>
            )
          })}
        </AnimatePresence>
      </div>
    )
  }

  useEffect(() => {
    if (!showWorkspace) {
      setSlug(pathnameSlug ?? '')
      setIsLoadingSlug(false)

      return
    }

    if (pathnameSlug) {
      setSlug(pathnameSlug)
      setIsLoadingSlug(false)

      return
    }

    const cookieSlug = Cookies.get(COOKIES_KEYS.WORKSPACE_SLUG) ?? ''

    if (!cookieSlug && !pathnameSlug) {
      if (pathname.startsWith('/workspace')) {
        router.push('/workspace')
        return
      }

      setIsLoadingSlug(false)
      return
    }

    setSlug(cookieSlug)
    setIsLoadingSlug(false)
  }, [pathnameSlug, pathname, router, showWorkspace])

  return (
    <>
      <Sidebar variant="inset" {...props}>
        <SidebarHeader className="flex flex-row items-center justify-between border-none p-4 pb-2 -mt-0.5">
          <Link
            href="/"
            className="outline-none focus-visible:border-ring focus-visible:ring-ring focus-visible:ring-2 active:scale-[99.35%] active:grayscale transition-[scale,filter] rounded-md p-2"
          >
            <Logo />
          </Link>

          <SidebarNotification />
        </SidebarHeader>

        <div className="flex min-h-0 flex-1 flex-col">
          {isLoadingSlug ? (
            <Loader
              text={t('loading')}
              iconClassName="size-6"
              className="flex h-full flex-1 flex-col items-center justify-center gap-4 p-6 text-sm"
            />
          ) : (
            <>
              {showWorkspace && (
                <div className="px-4 py-2 max-lg:my-4">
                  {slug ? (
                    <SidebarWorkspace slug={slug} />
                  ) : (
                    <SidebarWorkspaceSelectPrompt />
                  )}
                </div>
              )}

              {hasWorkspaceContext && (
                <div className="px-4 py-2">
                  <button
                    type="button"
                    onClick={() => openCommandPalette()}
                    aria-label={t('commandPalette.openLabel')}
                    className={cn(
                      'flex h-11 w-full min-w-0 cursor-pointer items-center rounded-lg border-2 border-sidebar-accent bg-transparent p-2 text-left text-sm text-muted-foreground outline-none transition-all',
                      'hover:bg-sidebar-accent/30 focus-visible:border-transparent focus-visible:ring-[3px] focus-visible:ring-ring/50',
                    )}
                  >
                    <span className="pointer-events-none flex w-full items-center justify-between gap-2">
                      <span className="truncate opacity-50 ml-1">
                        {t('commandPalette.searchPlaceholder')}
                      </span>

                      <Kbd
                        keys={['MOD', 'K']}
                        className="rounded-md bg-sidebar-accent px-2 py-1 text-xs text-muted-foreground"
                      />
                    </span>
                  </button>
                </div>
              )}

              <SidebarContent className="h-full overflow-x-hidden overflow-y-auto px-4 py-2">
                <SidebarMenu className="flex min-h-full flex-col justify-between gap-4 overflow-visible">
                  {hasWorkspaceContext && (
                    <div key="main-menu">{RENDER_MENU(SIDEBAR_MENU)}</div>
                  )}

                  <div key="bottom-menu">{RENDER_MENU(BOTTOM_MENU)}</div>
                </SidebarMenu>
              </SidebarContent>

              {showSetupWidget && (
                <div className="shrink-0 px-4 pb-3">
                  <SetupWidget placement="sidebar" />
                </div>
              )}

              <SidebarFooter className="p-4 pt-0">
                <CopyrightVersion />
                <SidebarUser />
              </SidebarFooter>
            </>
          )}
        </div>

        <SidebarRail
          onClick={handleRailClick}
          onMouseDown={handleResizeMouseDown}
          onFocus={(e) => e.currentTarget.blur()}
          className={cn(
            'cursor-col-resize max-h-32 flex items-center justify-center top-1/2 translate-x-1 -translate-y-1/2 px-4 -right-full after:rounded-full after:w-1 after:-translate-x-1/2 after:transition-transform hover:after:translate-x-0 hover:after:bg-accent outline-none focus-visible:ring-ring focus-visible:ring-2 focus-visible:border-ring transition-transform bg-transparent!',
            !isSidebarOpen && 'translate-x-1!',
            isDragging && 'after:translate-x-0 after:bg-accent',
          )}
        />
      </Sidebar>

      <SidebarCommandPalette
        slug={slug}
        menus={hasWorkspaceContext ? SIDEBAR_MENU : []}
        bottomMenus={BOTTOM_MENU}
        showWorkspace={showWorkspace}
        settingsItems={
          hasWorkspaceContext && isAdmin ? settingsItems : undefined
        }
      />

      <HelpDialog />
    </>
  )
}

export type { CommandPaletteEntry } from './command-palette'
export {
  collectCommandEntries,
  SidebarCommandPalette,
  SidebarCommandPaletteProvider,
  useSidebarCommandPalette,
} from './command-palette'
