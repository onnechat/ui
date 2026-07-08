'use client'

import Cookies from 'js-cookie'

import * as React from 'react'

import { AnimatePresence, motion } from 'motion/react'

import { cn } from '@/lib/cn'

import { ANIMATION } from '@/constants/animations'

import { Icon, type IconType } from '@/components/icon'

import { Button } from '@/components/ui/button'
import { Loader } from '@/components/ui/loader'
import { Sidebar, SIDEBAR_WIDTH, useSidebar } from '@/components/ui/sidebar'
import { Tooltip } from '@/components/ui/tooltip'

/**
 * Application shell layout, composition-first. Encodes the structure of our
 * dashboards — inset resizable sidebar, glass sticky header, floating mobile
 * navbar, announcement-aware viewport — while leaving every region up to the
 * consumer:
 *
 * ```tsx
 * <AnnouncementBanner message="…" type="NEW" />
 *
 * <AppShell>
 *   <AppShell.Sidebar>
 *     <AppShell.SidebarHeader>…logo + actions…</AppShell.SidebarHeader>
 *     <AppShell.SidebarSection>…workspace switcher…</AppShell.SidebarSection>
 *     <AppShell.SidebarSection>
 *       <AppShell.CommandButton>Pesquisar…</AppShell.CommandButton>
 *     </AppShell.SidebarSection>
 *     <AppShell.SidebarContent>
 *       <AppShell.SidebarGroup title="Geral">
 *         <AppShell.SidebarItem icon="House6" title="Visão Geral" href="/" active />
 *       </AppShell.SidebarGroup>
 *     </AppShell.SidebarContent>
 *     <AppShell.SidebarFooter>…copyright + user…</AppShell.SidebarFooter>
 *   </AppShell.Sidebar>
 *
 *   <AppShell.Navbar>…mobile items…</AppShell.Navbar>
 *
 *   <AppShell.Inset>
 *     <AppShell.Header title={…} actions={…} user={…} logo={…} />
 *     <MyPage />
 *   </AppShell.Inset>
 * </AppShell>
 * ```
 */
function AppShellRoot({
  className,
  children,
  ...props
}: React.ComponentProps<typeof Sidebar.Provider>) {
  return (
    <Sidebar.Provider
      data-slot="app-shell"
      className={cn(
        'relative flex-1 min-h-[calc(100svh-var(--announcement-height,0px))] max-lg:bg-dashboard-background!',
        className,
      )}
      {...props}
    >
      {children}
    </Sidebar.Provider>
  )
}

/* -------------------------------------------------------------------------
 * Sidebar
 * ---------------------------------------------------------------------- */

const MIN_SIDEBAR_WIDTH = 16 * 16 // 16rem
const MAX_SIDEBAR_WIDTH = 20 * 16 // 20rem
const COLLAPSE_THRESHOLD = MIN_SIDEBAR_WIDTH / 2 // 8rem — collapse only past half minimum

const SIDEBAR_WIDTH_COOKIE = 'sidebar-width'
const SIDEBAR_WIDTH_COOKIE_TTL_DAYS = 365

/**
 * Inset sidebar with a drag-to-resize rail: click toggles, double click
 * resets to the default width, dragging resizes between 16–20rem and
 * collapses past the threshold. Width persists in the `sidebar-width` cookie
 * (read back by `Sidebar.Provider`).
 */
function AppShellSidebar({
  children,
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  const {
    toggleSidebar,
    setSidebarWidth,
    setOpen,
    open: isSidebarOpen,
  } = useSidebar()

  const [isDragging, setIsDragging] = React.useState(false)
  const railClickTimer = React.useRef<ReturnType<typeof setTimeout> | null>(
    null,
  )

  const persistWidth = React.useCallback(
    (width: string) => {
      Cookies.set(SIDEBAR_WIDTH_COOKIE, width, {
        expires: SIDEBAR_WIDTH_COOKIE_TTL_DAYS,
        path: '/',
      })

      setSidebarWidth(width)
    },
    [setSidebarWidth],
  )

  const handleRailClick = React.useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      const wrapper = (e.currentTarget as HTMLElement).closest<HTMLElement>(
        '[data-slot="sidebar-wrapper"]',
      )

      if (railClickTimer.current) {
        clearTimeout(railClickTimer.current)
        railClickTimer.current = null

        if (!wrapper) return

        wrapper.style.setProperty('--sidebar-width', SIDEBAR_WIDTH)
        persistWidth(SIDEBAR_WIDTH)

        return
      }

      railClickTimer.current = setTimeout(() => {
        railClickTimer.current = null
        toggleSidebar()
      }, 150)
    },
    [toggleSidebar, persistWidth],
  )

  const handleResizeMouseDown = React.useCallback(
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

            persistWidth(newWidth)
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

      let pastCollapseThreshold = false

      const handleMouseMove = (moveEvent: MouseEvent) => {
        const delta = moveEvent.clientX - startX
        const rawWidth = startWidth + delta

        pastCollapseThreshold = rawWidth < COLLAPSE_THRESHOLD

        const newWidth = Math.max(
          MIN_SIDEBAR_WIDTH,
          Math.min(MAX_SIDEBAR_WIDTH, rawWidth),
        )
        wrapper.style.setProperty('--sidebar-width', `${newWidth}px`)
      }

      const handleMouseUp = () => {
        document.body.style.cursor = ''
        document.body.style.userSelect = ''

        setIsDragging(false)
        restoreTransitions()

        window.removeEventListener('mousemove', handleMouseMove)
        window.removeEventListener('mouseup', handleMouseUp)

        if (pastCollapseThreshold) {
          toggleSidebar()
          return
        }

        const newWidth = wrapper.style
          .getPropertyValue('--sidebar-width')
          .trim()

        persistWidth(newWidth)
      }

      window.addEventListener('mousemove', handleMouseMove)
      window.addEventListener('mouseup', handleMouseUp)
    },
    [toggleSidebar, persistWidth, isSidebarOpen, setOpen],
  )

  React.useEffect(() => {
    return () => {
      if (railClickTimer.current) {
        clearTimeout(railClickTimer.current)
      }
    }
  }, [])

  return (
    <Sidebar variant="inset" {...props}>
      {children}

      <Sidebar.Rail
        onClick={handleRailClick}
        onMouseDown={handleResizeMouseDown}
        onFocus={(e) => e.currentTarget.blur()}
        className={cn(
          'cursor-col-resize max-h-32 flex items-center justify-center top-1/2 translate-x-1 -translate-y-1/2 px-4 -right-full after:rounded-full after:w-1 after:-translate-x-1/2 after:transition-transform hover:after:translate-x-0 hover:after:bg-sidebar-border outline-none focus-visible:ring-ring focus-visible:ring-2 focus-visible:border-ring transition-transform bg-transparent!',
          !isSidebarOpen && 'translate-x-1!',
          isDragging && 'after:translate-x-0 after:bg-accent',
        )}
      />
    </Sidebar>
  )
}

function AppShellSidebarHeader({
  className,
  children,
  ...props
}: React.ComponentProps<typeof Sidebar.Header>) {
  return (
    <Sidebar.Header
      data-slot="app-shell-sidebar-header"
      className={cn(
        'flex flex-row items-center justify-between border-none p-4 pb-2 -mt-0.5',
        className,
      )}
      {...props}
    >
      {children}
    </Sidebar.Header>
  )
}

function AppShellSidebarSection({
  className,
  children,
  ...props
}: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="app-shell-sidebar-section"
      className={cn('shrink-0 px-4 py-2 empty:hidden', className)}
      {...props}
    >
      {children}
    </div>
  )
}

function AppShellSidebarContent({
  className,
  children,
  ...props
}: React.ComponentProps<typeof Sidebar.Content>) {
  return (
    <Sidebar.Content
      data-slot="app-shell-sidebar-content"
      className={cn(
        'flex-1 overflow-x-hidden overflow-y-auto scroll-fade-y px-4 py-2',
        className,
      )}
      {...props}
    >
      <Sidebar.Menu className="flex flex-col gap-4 overflow-visible">
        {children}
      </Sidebar.Menu>
    </Sidebar.Content>
  )
}

function AppShellSidebarGroup({
  className,
  title,
  children,
  ...props
}: React.ComponentProps<typeof Sidebar.Group> & {
  title?: string
}) {
  return (
    <Sidebar.Group
      data-slot="app-shell-sidebar-group"
      className={cn('p-0', className)}
      {...props}
    >
      {title && (
        <span className="text-xs text-muted-foreground/50 font-medium uppercase p-2">
          {title}
        </span>
      )}

      <Sidebar.GroupContent className="flex flex-col gap-1">
        {children}
      </Sidebar.GroupContent>
    </Sidebar.Group>
  )
}

/* -------------------------------------------------------------------------
 * Sidebar item
 * ---------------------------------------------------------------------- */

function itemAnimation({
  direction = 'up',
  px = 10,
  duration = ANIMATION.DURATION_FLOAT,
  delay = 0,
  reverse = false,
}: {
  direction?: 'left' | 'right' | 'up' | 'down'
  px?: number
  duration?: number
  delay?: number
  reverse?: boolean
} = {}) {
  const axis = direction === 'left' || direction === 'right' ? 'x' : 'y'

  const initial = { opacity: 0, [axis]: px * (!reverse ? -1 : 1) }
  const animate = { opacity: 1, [axis]: 0 }
  const exit = {
    opacity: 0,
    [axis]: px * (!reverse ? -1 : 1),
    ...(delay > 0 ? { transition: { duration } } : {}),
  }
  const transition = delay > 0 ? { duration, delay } : { duration }

  return { initial, animate, exit, transition }
}

const DROPDOWN_CHILD_STAGGER_DELAY = 0.035
const MAX_DROPDOWN_CHILD_STAGGER_DELAY = 0.14

export type AppShellSidebarItemData = {
  title: string
  icon?: IconType | React.ReactNode
  href?: string
  onClick?: () => void
  /** Marks the item as the current route. The shell has no router — compute it in the app. */
  active?: boolean
  disabled?: boolean
  loading?: boolean
  /** "Coming soon" — disabled with a clock hint. */
  soon?: boolean
  /** External link — opens in a new tab with a hint icon. */
  external?: boolean
  items?: AppShellSidebarItemData[]
}

type AppShellSidebarItemProps = AppShellSidebarItemData & {
  index?: number
  isDropdownChild?: boolean
  level?: number
}

function AppShellSidebarItem({
  index = 0,
  isDropdownChild = false,
  level = 0,
  ...item
}: AppShellSidebarItemProps) {
  const { isMobile, toggleSidebar } = useSidebar()

  const [open, setOpen] = React.useState(false)

  const hasItems = !!item.items && item.items.length > 0
  const hasHref = !!item.href
  const hasLinkedChildren = hasItems && hasHref && !item.onClick

  const isLoading = item.loading || false
  const isSoon = item.soon || false
  const isExternal = item.external || false

  const isDisabled = isLoading || item.disabled || isSoon || false

  const useSplitDropdownLayout = hasLinkedChildren && !isLoading

  const isActive = !isDisabled && !isLoading && !!item.active

  const buttonClassName =
    'relative z-10 group/menu-button hover:bg-sidebar-accent! data-[active=true]:bg-transparent data-[active=false]:hover:text-foreground/75 h-auto! p-2.5! text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2.5 data-[disabled=true]:pointer-events-none data-[disabled=true]:opacity-50 transition-[transform,opacity] duration-200 active:scale-[99.35%] cursor-pointer'

  const itemStyle = {
    marginLeft: `${level * 16}px`,
    maxWidth: `calc(100% - ${level * 16}px)`,
  }

  const dropdownChildDelay = isDropdownChild
    ? Math.min(
        index * DROPDOWN_CHILD_STAGGER_DELAY,
        MAX_DROPDOWN_CHILD_STAGGER_DELAY,
      )
    : 0

  const handleNavigateClick = (event: React.MouseEvent<HTMLAnchorElement>) => {
    if (isDisabled) {
      event.preventDefault()
      return
    }

    if (isMobile) toggleSidebar()
  }

  const handleToggleItems = () => {
    if (!isDisabled && hasItems) {
      setOpen((open) => !open)
    }
  }

  const handleClick = () => {
    if (item.onClick) {
      item.onClick()
      if (isMobile) toggleSidebar()
    } else if (!isDisabled && hasItems) {
      handleToggleItems()
    }
  }

  const icon = (
    <div
      className={cn(
        'flex items-center justify-center size-4 aspect-square',
        isActive ? 'text-primary' : 'text-muted-foreground',
      )}
    >
      {typeof item.icon === 'string' ? (
        <Icon name={item.icon as IconType} />
      ) : (
        item.icon
      )}
    </div>
  )

  const trailing = isLoading ? (
    <Loader
      variant="button"
      iconClassName="size-4 min-w-4 min-h-4"
      className="ml-auto mr-0.5 shrink-0 text-muted-foreground"
    />
  ) : (
    <AnimatePresence mode="popLayout">
      {[hasItems, isSoon, isExternal].some(Boolean) && (
        <motion.div
          key="trailing"
          {...itemAnimation({ direction: 'right', reverse: true })}
          className={cn(
            'flex items-center gap-2',
            !hasLinkedChildren && 'ml-auto',
          )}
        >
          {isSoon ? (
            <Icon name="Clock" className="size-3 opacity-50" />
          ) : isExternal ? (
            <Icon
              name="ShareUpRight"
              className="size-3 opacity-50 group-hover/menu-button:opacity-100 group-hover/menu-button:text-link"
            />
          ) : hasItems ? (
            <Icon
              data-open={open}
              name="ChevronDown"
              className="size-3 transition-transform duration-300 data-[open=true]:rotate-180"
            />
          ) : null}
        </motion.div>
      )}
    </AnimatePresence>
  )

  const isPlainLink = !hasItems && !item.onClick

  return (
    <motion.div
      {...itemAnimation({ direction: 'left', delay: dropdownChildDelay })}
      suppressHydrationWarning
      data-open={open}
      data-disabled={isDisabled}
      className="relative flex flex-col group/menu-item data-[disabled=true]:opacity-50 data-[disabled=true]:pointer-events-none"
    >
      {useSplitDropdownLayout ? (
        <div
          className="relative z-10 flex w-full min-w-0 gap-1"
          style={itemStyle}
        >
          <Sidebar.MenuButton
            asChild
            data-open={open}
            data-active={isActive}
            data-index={index}
            data-level={level}
            data-disabled={isDisabled}
            disabled={isDisabled}
            className={cn(buttonClassName, 'min-w-0 flex-1')}
          >
            <a
              href={item.href && !isDisabled ? item.href : '#'}
              target={isExternal ? '_blank' : undefined}
              rel={isExternal ? 'noopener noreferrer' : undefined}
              onClick={handleNavigateClick}
              suppressHydrationWarning
              className="flex items-center gap-2"
            >
              {icon}

              <span data-active={isActive} className="truncate text-sm">
                {item.title}
              </span>
            </a>
          </Sidebar.MenuButton>

          <Sidebar.MenuButton
            type="button"
            data-open={open}
            data-active={isActive}
            data-index={index}
            data-level={level}
            data-disabled={isDisabled}
            disabled={isDisabled}
            aria-expanded={open}
            aria-label={`${item.title} submenu`}
            onClick={handleToggleItems}
            className={cn(buttonClassName, 'w-10 shrink-0 justify-center p-2.5!')}
          >
            {trailing}
          </Sidebar.MenuButton>
        </div>
      ) : (
        <Sidebar.MenuButton
          asChild={isPlainLink}
          data-open={open}
          data-active={isActive}
          data-index={index}
          data-level={level}
          data-disabled={isDisabled}
          disabled={isDisabled}
          onClick={hasItems || item.onClick ? handleClick : undefined}
          className={buttonClassName}
          style={itemStyle}
        >
          {isPlainLink ? (
            <a
              href={item.href && !isDisabled ? item.href : '#'}
              target={isExternal ? '_blank' : undefined}
              rel={isExternal ? 'noopener noreferrer' : undefined}
              onClick={handleNavigateClick}
              suppressHydrationWarning
              className="flex w-full min-w-0 items-center gap-2"
            >
              {icon}

              <span
                data-active={isActive}
                className="text-sm min-w-0 truncate"
              >
                {item.title}
              </span>

              {trailing}
            </a>
          ) : (
            <>
              {icon}

              <span data-active={isActive} className="text-sm">
                {item.title}
              </span>

              {trailing}
            </>
          )}
        </Sidebar.MenuButton>
      )}

      <AnimatePresence initial={false}>
        {hasItems && open && (
          <motion.ul
            animate={{ height: 'auto', opacity: 1, padding: '0.25rem 0' }}
            initial={{ height: 0, opacity: 0, padding: 0 }}
            exit={{ height: 0, opacity: 0, padding: 0 }}
            transition={{
              duration: ANIMATION.DURATION_FLOAT,
              ease: 'easeInOut',
            }}
            data-open={open}
            className="w-full min-w-0 flex flex-col space-y-1 z-0 overflow-hidden"
          >
            {item.items?.map((childItem, childIndex) => (
              <AppShellSidebarItem
                key={`${childItem.title}-${childIndex}`}
                {...childItem}
                index={childIndex}
                isDropdownChild
                level={level + 1}
              />
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

/* -------------------------------------------------------------------------
 * Command palette button
 * ---------------------------------------------------------------------- */

function AppShellCommandButton({
  className,
  children,
  ...props
}: React.ComponentProps<'button'>) {
  return (
    <button
      type="button"
      data-slot="app-shell-command-button"
      className={cn(
        'flex h-12 w-full min-w-0 cursor-pointer items-center rounded-xl border-2 border-sidebar-accent bg-transparent p-2.5 text-left text-sm text-muted-foreground outline-none transition-all hover:bg-sidebar-accent/30 focus-visible:border-transparent focus-visible:ring-[3px] focus-visible:ring-ring/50',
        className,
      )}
      {...props}
    >
      <span className="pointer-events-none flex w-full items-center gap-2 opacity-50 truncate">
        {children}
      </span>
    </button>
  )
}

function AppShellSidebarFooter({
  className,
  children,
  ...props
}: React.ComponentProps<typeof Sidebar.Footer>) {
  return (
    <Sidebar.Footer
      data-slot="app-shell-sidebar-footer"
      className={cn('p-4 pt-0', className)}
      {...props}
    >
      {children}
    </Sidebar.Footer>
  )
}

function AppShellCopyright({
  className,
  children,
  ...props
}: React.ComponentProps<'span'>) {
  return (
    <span
      suppressHydrationWarning
      data-slot="app-shell-copyright"
      className={cn('text-xs text-muted-foreground/50 p-2', className)}
      {...props}
    >
      {children}
    </span>
  )
}

/* -------------------------------------------------------------------------
 * Header
 * ---------------------------------------------------------------------- */

function AppShellHeader({
  className,
  logo,
  title,
  actions,
  user,
  sidebarToggleLabel = 'Toggle sidebar',
  mobileActionsClassName,
  ...props
}: Omit<React.ComponentProps<'div'>, 'title'> & {
  /** Mobile-only logo slot (top-left). */
  logo?: React.ReactNode
  /** Page title area (both breakpoints). */
  title?: React.ReactNode
  /** Right-side actions (both breakpoints). */
  actions?: React.ReactNode
  /** Mobile-only user slot (top-right, e.g. avatar). */
  user?: React.ReactNode
  sidebarToggleLabel?: string
  mobileActionsClassName?: string
}) {
  return (
    <div data-slot="app-shell-header" className={cn('contents', className)} {...props}>
      <div className="lg:hidden flex items-center justify-between gap-2 md:gap-4 p-4 min-h-16 h-full max-h-16 glass-dashboard-header max-lg:sticky top-(--announcement-height,0px) z-50 transition-all max-lg:border-b max-lg:border-border/70">
        <div className="flex min-w-0 flex-1 items-center gap-4">
          {logo && <div className="shrink-0 active:scale-99">{logo}</div>}

          <div className="flex min-h-7 min-w-0 flex-1 items-center overflow-hidden">
            <div className="flex min-w-0 flex-1 items-center">{title}</div>
          </div>
        </div>

        <div className={cn('flex gap-2 empty:hidden', mobileActionsClassName)}>
          {actions}
        </div>

        {user}
      </div>

      <div className="max-lg:hidden sticky top-(--announcement-height,0px) z-50 w-full flex min-w-0 items-center gap-2 md:gap-4 p-4 min-h-16 h-full max-h-16 border-b glass-dashboard-header border-border/70 transition-colors lg:rounded-t-2xl">
        <Tooltip>
          <Tooltip.Trigger asChild>
            <Sidebar.Trigger
              size="icon"
              variant="ghost"
              className="max-lg:hidden shrink-0"
              iconProps={{ className: '!size-4 text-foreground' }}
            />
          </Tooltip.Trigger>

          <Tooltip.Content side="bottom">{sidebarToggleLabel}</Tooltip.Content>
        </Tooltip>

        <div className="flex min-h-7 min-w-0 flex-1 items-center overflow-hidden">
          <div className="flex min-w-0 flex-1 items-center">{title}</div>
        </div>

        <div className="relative z-1 grid grid-flow-col shrink-0 ml-auto gap-2 md:gap-4">
          <div className="min-w-0 flex items-center gap-2 empty:hidden">
            {actions}
          </div>
        </div>
      </div>
    </div>
  )
}

/* -------------------------------------------------------------------------
 * Mobile navbar
 * ---------------------------------------------------------------------- */

function AppShellNavbar({
  className,
  children,
  ...props
}: React.ComponentProps<'nav'>) {
  return (
    <nav
      data-slot="app-shell-navbar"
      onContextMenu={(e) => e.preventDefault()}
      className={cn(
        'fixed bottom-0 left-0 lg:hidden z-50 flex flex-col items-center justify-center w-full min-h-[100px] pointer-events-none transition-opacity duration-200',
        className,
      )}
      {...props}
    >
      <div className="absolute inset-0 translate-y-px bg-linear-to-t from-black/80 to-transparent pointer-events-none -z-10 backdrop-blur-sm mask-t-from-0 mask-b-to-100" />

      <ul className="relative flex items-center justify-center gap-1.5 xs:gap-2 sm:gap-4 w-full h-full">
        <div className="flex items-center justify-center gap-1 w-fit glass-dashboard-chrome border border-border/50 p-1 rounded-2xl overflow-hidden z-10 pointer-events-auto">
          {children}
        </div>
      </ul>
    </nav>
  )
}

function AppShellNavbarItem({
  className,
  icon,
  active = false,
  href,
  children,
  ...props
}: Omit<React.ComponentProps<'a'>, 'children'> & {
  icon?: IconType | React.ReactNode
  active?: boolean
  children?: React.ReactNode
}) {
  const itemClassName = cn(
    'size-full flex items-center justify-center p-4 rounded-xl transition-colors text-xs cursor-pointer',
    'outline-none focus-visible:border-transparent focus-visible:ring-ring/50 focus-visible:ring-[3px]',
    active
      ? 'bg-primary/5 hover:bg-primary/25 dark:bg-primary/5 dark:hover:bg-primary/2'
      : 'bg-transparent hover:bg-accent/50',
    className,
  )

  const content =
    children ??
    (typeof icon === 'string' ? (
      <Icon
        name={icon as IconType}
        className={cn(
          'size-5 shrink-0',
          active ? 'text-primary' : 'text-muted-foreground',
        )}
      />
    ) : (
      icon
    ))

  if (href) {
    return (
      <a href={href} className={itemClassName} {...props}>
        {content}
      </a>
    )
  }

  const { onClick } = props as { onClick?: React.MouseEventHandler<HTMLElement> }

  return (
    <button type="button" className={itemClassName} onClick={onClick}>
      {content}
    </button>
  )
}

/* -------------------------------------------------------------------------
 * Right (context) sidebar
 * ---------------------------------------------------------------------- */

const RIGHT_SIDEBAR_WIDTH = '20rem'
const RIGHT_SIDEBAR_KEYBOARD_SHORTCUT = ']'

const RIGHT_SIDEBAR_WIDTH_COOKIE = 'context-sidebar-width'
const RIGHT_SIDEBAR_STATE_COOKIE = 'context-sidebar-state'

const MIN_RIGHT_SIDEBAR_WIDTH = 16 * 16 // 16rem
const MAX_RIGHT_SIDEBAR_WIDTH = 20 * 16 // 20rem
const RIGHT_SIDEBAR_COLLAPSE_THRESHOLD = MIN_RIGHT_SIDEBAR_WIDTH / 2

type AppShellRightSidebarContextValue = {
  state: 'expanded' | 'collapsed'
  open: boolean
  setOpen: (open: boolean) => void
  toggleSidebar: () => void
  sidebarWidth: string
  setSidebarWidth: (width: string) => void
}

const AppShellRightSidebarContext =
  React.createContext<AppShellRightSidebarContextValue | null>(null)

function useAppShellRightSidebar() {
  const context = React.useContext(AppShellRightSidebarContext)

  if (!context) {
    throw new Error(
      'useAppShellRightSidebar must be used within an AppShell.RightSidebarProvider.',
    )
  }

  return context
}

/**
 * State container for the right context sidebar. Wrap the `AppShell` with it
 * whenever a page renders `AppShell.RightSidebar`; open state and width
 * persist in cookies and `]` toggles it.
 */
function AppShellRightSidebarProvider({
  children,
  defaultOpen = true,
}: {
  children: React.ReactNode
  defaultOpen?: boolean
}) {
  const [open, _setOpen] = React.useState(defaultOpen)
  const [sidebarWidth, setSidebarWidth] = React.useState(RIGHT_SIDEBAR_WIDTH)

  const setOpen = React.useCallback((value: boolean) => {
    _setOpen(value)
    Cookies.set(RIGHT_SIDEBAR_STATE_COOKIE, String(value), { path: '/' })
  }, [])

  const toggleSidebar = React.useCallback(() => {
    _setOpen((open) => {
      Cookies.set(RIGHT_SIDEBAR_STATE_COOKIE, String(!open), { path: '/' })
      return !open
    })
  }, [])

  React.useLayoutEffect(() => {
    const savedOpen = Cookies.get(RIGHT_SIDEBAR_STATE_COOKIE)
    if (savedOpen !== undefined) _setOpen(savedOpen === 'true')

    const savedWidth = Cookies.get(RIGHT_SIDEBAR_WIDTH_COOKIE)
    if (savedWidth) setSidebarWidth(savedWidth)
  }, [])

  React.useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === RIGHT_SIDEBAR_KEYBOARD_SHORTCUT) {
        event.preventDefault()
        toggleSidebar()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [toggleSidebar])

  const state = open ? 'expanded' : 'collapsed'

  const contextValue = React.useMemo<AppShellRightSidebarContextValue>(
    () => ({
      state,
      open,
      setOpen,
      toggleSidebar,
      sidebarWidth,
      setSidebarWidth,
    }),
    [state, open, setOpen, toggleSidebar, sidebarWidth],
  )

  return (
    <AppShellRightSidebarContext.Provider value={contextValue}>
      <div
        data-slot="context-sidebar-wrapper"
        style={
          {
            '--context-sidebar-width': sidebarWidth,
          } as React.CSSProperties
        }
        className="contents max-lg:[--context-sidebar-width:0px]"
      >
        {children}
      </div>
    </AppShellRightSidebarContext.Provider>
  )
}

function AppShellRightSidebarTrigger({
  className,
  label = 'Toggle context sidebar',
  ...props
}: React.ComponentProps<typeof Button> & {
  label?: string
}) {
  const { toggleSidebar, state } = useAppShellRightSidebar()

  return (
    <Tooltip>
      <Tooltip.Trigger asChild>
        <Button
          size="icon"
          variant="ghost"
          type="button"
          data-slot="context-sidebar-trigger"
          className={cn('max-lg:hidden shrink-0', className)}
          onClick={toggleSidebar}
          {...props}
        >
          <Icon
            name={state === 'collapsed' ? 'SidebarToggled' : 'SidebarToggle'}
            className="!size-4 text-foreground scale-x-[-1]"
          />

          <span className="sr-only">{label}</span>
        </Button>
      </Tooltip.Trigger>

      <Tooltip.Content side="bottom">{label}</Tooltip.Content>
    </Tooltip>
  )
}

/**
 * Fixed right context panel with drag-to-resize on its left edge, matching
 * the left sidebar behavior (click toggles, double click resets, drag past
 * the threshold collapses). Requires `AppShell.RightSidebarProvider`.
 */
function AppShellRightSidebar({
  className,
  children,
  ...props
}: React.ComponentProps<'aside'>) {
  const {
    state,
    open: isSidebarOpen,
    toggleSidebar,
    setOpen,
    setSidebarWidth,
  } = useAppShellRightSidebar()

  const [isDragging, setIsDragging] = React.useState(false)
  const railClickTimer = React.useRef<ReturnType<typeof setTimeout> | null>(
    null,
  )

  const persistWidth = React.useCallback(
    (width: string) => {
      Cookies.set(RIGHT_SIDEBAR_WIDTH_COOKIE, width, { path: '/' })
      setSidebarWidth(width)
    },
    [setSidebarWidth],
  )

  const handleRailClick = React.useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      const wrapper = (e.currentTarget as HTMLElement).closest<HTMLElement>(
        '[data-slot="context-sidebar-wrapper"]',
      )

      if (railClickTimer.current) {
        clearTimeout(railClickTimer.current)
        railClickTimer.current = null

        if (!wrapper) return

        wrapper.style.setProperty(
          '--context-sidebar-width',
          RIGHT_SIDEBAR_WIDTH,
        )
        persistWidth(RIGHT_SIDEBAR_WIDTH)

        return
      }

      railClickTimer.current = setTimeout(() => {
        railClickTimer.current = null
        toggleSidebar()
      }, 150)
    },
    [toggleSidebar, persistWidth],
  )

  const handleResizeMouseDown = React.useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      const wrapper = (e.currentTarget as HTMLElement).closest<HTMLElement>(
        '[data-slot="context-sidebar-wrapper"]',
      )

      if (!wrapper) return

      const startX = e.clientX

      document.body.style.cursor = 'col-resize'
      document.body.style.userSelect = 'none'

      if (!isSidebarOpen) {
        let dragStarted = false

        const handleMouseMove = (moveEvent: MouseEvent) => {
          const delta = startX - moveEvent.clientX

          if (!dragStarted) {
            if (Math.abs(delta) < 4) return

            dragStarted = true
            setIsDragging(true)

            wrapper.style.setProperty(
              '--context-sidebar-width',
              `${MIN_RIGHT_SIDEBAR_WIDTH}px`,
            )
            setOpen(true)
          }

          const newWidth = Math.max(
            MIN_RIGHT_SIDEBAR_WIDTH,
            Math.min(MAX_RIGHT_SIDEBAR_WIDTH, MIN_RIGHT_SIDEBAR_WIDTH + delta),
          )

          wrapper.style.setProperty('--context-sidebar-width', `${newWidth}px`)
        }

        const handleMouseUp = (upEvent: MouseEvent) => {
          document.body.style.cursor = ''
          document.body.style.userSelect = ''

          window.removeEventListener('mousemove', handleMouseMove)
          window.removeEventListener('mouseup', handleMouseUp)

          if (!dragStarted) return

          setIsDragging(false)

          if (startX - upEvent.clientX < -10) {
            wrapper.style.setProperty(
              '--context-sidebar-width',
              `${MIN_RIGHT_SIDEBAR_WIDTH}px`,
            )

            setOpen(false)
          } else {
            const newWidth = wrapper.style
              .getPropertyValue('--context-sidebar-width')
              .trim()

            persistWidth(newWidth)
          }
        }

        window.addEventListener('mousemove', handleMouseMove)
        window.addEventListener('mouseup', handleMouseUp)

        return
      }

      setIsDragging(true)

      const rawWidth = wrapper.style.getPropertyValue('--context-sidebar-width')
      const startWidth = rawWidth
        ? rawWidth.endsWith('rem')
          ? parseFloat(rawWidth) * 16
          : parseFloat(rawWidth)
        : MIN_RIGHT_SIDEBAR_WIDTH

      let pastCollapseThreshold = false

      const handleMouseMove = (moveEvent: MouseEvent) => {
        const delta = startX - moveEvent.clientX
        const rawWidth = startWidth + delta

        pastCollapseThreshold = rawWidth < RIGHT_SIDEBAR_COLLAPSE_THRESHOLD

        const newWidth = Math.max(
          MIN_RIGHT_SIDEBAR_WIDTH,
          Math.min(MAX_RIGHT_SIDEBAR_WIDTH, rawWidth),
        )
        wrapper.style.setProperty('--context-sidebar-width', `${newWidth}px`)
      }

      const handleMouseUp = () => {
        document.body.style.cursor = ''
        document.body.style.userSelect = ''

        setIsDragging(false)

        window.removeEventListener('mousemove', handleMouseMove)
        window.removeEventListener('mouseup', handleMouseUp)

        if (pastCollapseThreshold) {
          toggleSidebar()
          return
        }

        const newWidth = wrapper.style
          .getPropertyValue('--context-sidebar-width')
          .trim()

        persistWidth(newWidth)
      }

      window.addEventListener('mousemove', handleMouseMove)
      window.addEventListener('mouseup', handleMouseUp)
    },
    [toggleSidebar, persistWidth, isSidebarOpen, setOpen],
  )

  React.useEffect(() => {
    return () => {
      if (railClickTimer.current) {
        clearTimeout(railClickTimer.current)
      }
    }
  }, [])

  return (
    <aside
      data-side="right"
      data-slot="sidebar"
      data-variant="inset"
      data-state={state}
      data-collapsible={state === 'collapsed' ? 'offcanvas' : ''}
      className="group peer hidden text-sidebar-foreground lg:block"
      {...props}
    >
      <div
        aria-hidden
        data-slot="context-sidebar-gap"
        className={cn(
          'relative shrink-0 bg-transparent transition-[width] duration-300',
          state === 'expanded' ? 'w-(--context-sidebar-width)' : 'w-0',
        )}
      />

      {/* Off-canvas collapses by animating the clipped width (never past the
          viewport edge) instead of a negative `right` offset — an off-screen
          fixed panel becomes real horizontal overflow whenever an ancestor
          has a transform (e.g. Storybook zoom). */}
      <div
        data-slot="context-sidebar-container"
        className={cn(
          'fixed z-10 hidden overflow-clip bg-sidebar transition-[width] duration-300 lg:flex',
          'right-0 w-(--context-sidebar-width) group-data-[collapsible=offcanvas]:w-0',
        )}
        style={{
          top: 'var(--announcement-height, 0px)',
          height: 'calc(100dvh - var(--announcement-height, 0px))',
        }}
      >
        <div
          data-sidebar="sidebar"
          data-slot="sidebar-inner"
          className="relative flex h-full w-(--context-sidebar-width) shrink-0 min-w-0 flex-col"
        >
          <Sidebar.Content
            className={cn('flex flex-col overflow-y-auto p-4', className)}
          >
            {children}
          </Sidebar.Content>
        </div>
      </div>

      <button
        type="button"
        tabIndex={-1}
        onClick={handleRailClick}
        onMouseDown={handleResizeMouseDown}
        onFocus={(e) => e.currentTarget.blur()}
        data-sidebar="rail"
        data-slot="context-sidebar-rail"
        aria-label="Resize sidebar"
        className={cn(
          'fixed inset-y-0 z-20 hidden w-4 sm:flex',
          'right-(--context-sidebar-width) group-data-[collapsible=offcanvas]:right-0',
          'cursor-col-resize max-h-32 items-center justify-center top-1/2 translate-x-1/2 -translate-y-1/2 px-4',
          'group-data-[collapsible=offcanvas]:translate-x-0',
          'after:absolute after:inset-y-0 after:right-1/2 after:w-1 after:translate-x-1/2 after:rounded-full after:transition-transform',
          'hover:after:translate-x-0 hover:after:bg-sidebar-border',
          'outline-none focus-visible:ring-ring focus-visible:ring-2 focus-visible:border-ring transition-[right,transform] duration-300 bg-transparent!',
          isDragging && 'after:translate-x-0 after:bg-sidebar-border',
        )}
      />
    </aside>
  )
}

/* -------------------------------------------------------------------------
 * Inset / loading
 * ---------------------------------------------------------------------- */

function AppShellInset({
  className,
  style,
  children,
  loading = false,
  spacing = 24,
  ...props
}: React.ComponentProps<'div'> & {
  /**
   * Shows a blocking loading overlay while keeping the shell (sidebar,
   * navbar) interactive. Content stays mounted but hidden.
   */
  loading?: boolean
  /** Spacing scale unit for `--calculated-spacing` (bottom paddings, widget offsets). */
  spacing?: number
}) {
  const rightSidebar = React.useContext(AppShellRightSidebarContext)

  return (
    <Sidebar.Inset
      data-slot="app-shell-inset"
      style={
        {
          '--sidebar-spacing': spacing,
          ...style,
        } as React.CSSProperties
      }
      className={cn(
        loading && 'relative min-h-0 overflow-hidden',
        'max-lg:bg-dashboard-background! bg-dashboard-background',
        '[--calculated-spacing:--spacing(var(--sidebar-spacing))]',
        // `isolate` keeps composited children (e.g. the glass header's
        // backdrop-filter) inside the rounded overflow clip on all engines.
        'w-full min-w-0 lg:overflow-clip isolate',
        'max-lg:pb-(--calculated-spacing)',
        rightSidebar?.state === 'expanded' &&
          'lg:peer-data-[variant=inset]:mr-0',
        className,
      )}
      {...props}
    >
      {loading && <AppShellLoading />}

      <div
        aria-hidden={loading || undefined}
        className={cn(loading ? 'hidden' : 'contents')}
      >
        {children}
      </div>
    </Sidebar.Inset>
  )
}

function AppShellLoading({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="app-shell-loading"
      aria-busy="true"
      aria-live="polite"
      className={cn(
        'absolute inset-0 z-50 flex flex-col items-center justify-center gap-4 bg-dashboard-background',
        className,
      )}
      {...props}
    >
      <Loader />
    </div>
  )
}

const AppShell = Object.assign(AppShellRoot, {
  Sidebar: AppShellSidebar,
  SidebarHeader: AppShellSidebarHeader,
  SidebarSection: AppShellSidebarSection,
  SidebarContent: AppShellSidebarContent,
  SidebarGroup: AppShellSidebarGroup,
  SidebarItem: AppShellSidebarItem,
  SidebarFooter: AppShellSidebarFooter,
  CommandButton: AppShellCommandButton,
  Copyright: AppShellCopyright,
  Header: AppShellHeader,
  Navbar: AppShellNavbar,
  NavbarItem: AppShellNavbarItem,
  Inset: AppShellInset,
  Loading: AppShellLoading,
  RightSidebar: AppShellRightSidebar,
  RightSidebarProvider: AppShellRightSidebarProvider,
  RightSidebarTrigger: AppShellRightSidebarTrigger,
})

export { AppShell, useAppShellRightSidebar }
