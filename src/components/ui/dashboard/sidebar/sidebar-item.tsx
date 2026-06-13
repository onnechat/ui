'use client'

import { Fragment, useState } from 'react'


import { AnimatePresence, motion } from 'motion/react'

import { cn } from '@/lib/cn'


import { ANIMATION } from '@/constants/animations'

import { Icon } from '@/components/icon/index'

const Link = ({ href, children, ...props }: { href?: string; children?: React.ReactNode; [key: string]: unknown }) => (
  <a href={href} {...props}>{children}</a>
)

import { SidebarMenuButton, useSidebar } from '@/components/internal/sidebar'

import type { MenuItem } from './data'

export function animation({
  direction = 'up',
  px = 10,
  duration = ANIMATION.DURATION,
  reverse = false,
}: {
  direction?: 'left' | 'right' | 'up' | 'down'
  px?: number
  duration?: number
  reverse?: boolean
} = {}) {
  let axis = 'x'

  if (direction === 'left' || direction === 'right') {
    axis = 'x'
  } else if (direction === 'up' || direction === 'down') {
    axis = 'y'
  }

  const initial = { opacity: 0, [axis]: px * (!reverse ? -1 : 1) }
  const animate = { opacity: 1, [axis]: 0 }
  const exit = { opacity: 0, [axis]: px * (!reverse ? -1 : 1) }
  const transition = { duration }

  return { initial, animate, exit, transition }
}

const removeLastSlash = (url: string) => {
  if (url.endsWith('/')) {
    return url.slice(0, -1)
  }

  return url
}

type SidebarItemProps = {
  item: MenuItem
  index: number
  level?: number
}

export const SidebarItem = ({ item, index, level = 0 }: SidebarItemProps) => {
  const { isMobile, toggleSidebar } = useSidebar()
  const pathname = "/";
  const isCalendarRoute = false; const navigateToCalendar = () => {}

  const [open, setOpen] = useState(false)

  const title = item.title
  const hasItems = item.items && item.items.length > 0

  const isLoading = item.loading || false

  const isSoon = item.soon || false
  const isDisabled = isLoading || item.disabled || isSoon || false

  const isActive =
    !isDisabled &&
    !isLoading &&
    item.url &&
    pathname === removeLastSlash(item.url)

  const Component: React.ElementType =
    hasItems || item.onClick ? Fragment : Link

  const handleClick = () => {
    if (item.onClick) {
      item.onClick()
      if (isMobile) toggleSidebar()
    } else if (!isDisabled) {
      if (item.url?.includes('/calendar') && isCalendarRoute) {
        navigateToCalendar(true)
        if (isMobile) toggleSidebar()

        return
      }

      if (hasItems) {
        setOpen(!open)
      }
    }
  }

  return (
    <motion.div
      {...animation({ direction: 'left' })}
      suppressHydrationWarning
      data-open={open}
      data-disabled={isDisabled}
      className="relative flex flex-col group/menu-item data-[disabled=true]:opacity-50 data-[disabled=true]:pointer-events-none"
    >
      <SidebarMenuButton
        key={`${title}-${index}`}
        asChild={!hasItems && !item.onClick}
        data-open={open}
        data-active={isActive}
        data-index={index}
        data-level={level}
        data-disabled={isDisabled}
        disabled={isDisabled}
        onClick={handleClick}
        className="relative z-10 group/menu-button hover:bg-sidebar-accent! data-[active=true]:bg-transparent data-[active=false]:hover:text-foreground/75 h-auto! p-2.5! text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2.5 data-[disabled=true]:pointer-events-none data-[disabled=true]:opacity-50 transition-[transform,opacity] duration-200 active:scale-[99.35%] cursor-pointer"
        style={{
          marginLeft: `${level * 16}px`,
          maxWidth: `calc(100% - ${level * 16}px)`,
        }}
      >
        <Component
          {...(hasItems || item.onClick
            ? {}
            : {
                /**
                 * Prevent the default scroll behavior when clicking on the link
                 * @link https://github.com/vercel/next.js/discussions/64534#discussioncomment-11984648
                 */
                scroll: false,
                href: item.url && !isDisabled ? item.url : '#',
                onClick: () => isMobile && toggleSidebar(),
                suppressHydrationWarning: true,
                className: 'flex items-center gap-3',
              })}
        >
          <div
            className={cn(
              'flex items-center justify-center size-4 aspect-square',
              isActive ? 'text-primary' : 'text-secondary',
            )}
          >
            {item.icon && typeof item.icon === 'function' ? (
              item.icon
            ) : (
              <Icon name={item.icon} />
            )}
          </div>

          <span data-active={isActive} className="text-sm">
            {title}
          </span>

          <AnimatePresence mode="popLayout">
            {isLoading ? (
              <motion.div
                {...animation({
                  direction: 'right',
                  reverse: true,
                })}
                className="flex items-center gap-2 ml-auto"
              >
                <Icon name="Loader2" className="ml-auto size-4 animate-spin" />
              </motion.div>
            ) : (
              [hasItems, isSoon].some(Boolean) && (
                <motion.div
                  {...animation({
                    direction: 'right',
                    reverse: true,
                  })}
                  className="flex items-center gap-2 ml-auto"
                >
                  {isSoon ? (
                    <span className="text-xs text-nowrap min-w-fit uppercase bg-accent text-accent-foreground rounded-lg px-2 py-0.5 scale-90 origin-right select-none">
                      Em breve
                    </span>
                  ) : hasItems ? (
                    <Icon
                      data-open={open}
                      name="ChevronDown"
                      className="size-4 transition-transform duration-300 data-[open=true]:rotate-180"
                    />
                  ) : null}
                </motion.div>
              )
            )}
          </AnimatePresence>
        </Component>
      </SidebarMenuButton>

      <AnimatePresence initial={false}>
        {hasItems && open && (
          <motion.ul
            animate={{
              height: 'auto',
              opacity: 1,
              padding: '0.25rem 0',
            }}
            initial={{ height: 0, opacity: 0, padding: 0 }}
            exit={{ height: 0, opacity: 0, padding: 0 }}
            transition={{
              duration: ANIMATION.DURATION_FLOAT,
              ease: 'easeInOut',
            }}
            data-open={open}
            className="w-full min-w-0 flex flex-col space-y-1 z-0 overflow-hidden"
          >
            {item.items?.map((childItem, childIndex: number) => (
              <SidebarItem
                key={`${childItem.title}-${childIndex}`}
                item={childItem}
                index={childIndex}
                level={level + 1}
              />
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
