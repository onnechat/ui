'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

import { AnimatePresence, motion } from 'motion/react'

import { cn } from '@/lib/cn'

import { Logo } from '@/components/logo'
import { ThemeSwitch } from '@/components/theme-switch'

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarRail,
  useSidebar,
} from '@/components/ui/sidebar'

import { resolveWorkspaceMenuHref } from './data'
import { DEV_SIDEBAR_MENUS } from './dev-sidebar-data'
import { animation, SidebarItem } from './sidebar-item'

export function DevAppSidebar() {
  const pathname = usePathname()
  const { open: isSidebarOpen } = useSidebar()

  return (
    <Sidebar variant="inset">
      <SidebarHeader className="flex flex-row items-center justify-between border-none p-4 pb-2 -mt-0.5">
        <Link
          href="/"
          className="outline-none focus-visible:border-ring focus-visible:ring-ring focus-visible:ring-2 active:scale-[99.35%] active:grayscale transition-[scale,filter] rounded-md p-2"
        >
          <Logo />
        </Link>

        <div className="flex items-center gap-0.5">
          <ThemeSwitch
            type="icon"
            align="end"
            classNames={{
              trigger: 'bg-transparent hover:bg-input',
              content: 'bg-muted p-0',
            }}
          />
        </div>
      </SidebarHeader>

      <SidebarContent className="h-full overflow-x-hidden overflow-y-auto px-4 py-2">
        <SidebarMenu className="flex min-h-full flex-col justify-between gap-4 overflow-visible">
          <div className="flex flex-col gap-4">
            <AnimatePresence initial={false}>
              {DEV_SIDEBAR_MENUS.map(
                ({ title, items, paths, basePath }, index) => {
                  const render =
                    paths?.some((p) => pathname.startsWith(p)) ?? true
                  if (!render) return null

                  return (
                    <SidebarGroup
                      key={`${index}-${basePath ?? 'dev'}`}
                      className="p-0"
                    >
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
                          {items.map((item, itemIndex) => {
                            if (!item.url) return null

                            const computedUrl = resolveWorkspaceMenuHref(
                              item.url,
                              basePath,
                              false,
                              '',
                            )

                            return (
                              <SidebarItem
                                index={itemIndex}
                                key={`${computedUrl}-${itemIndex}`}
                                item={{ ...item, url: computedUrl }}
                              />
                            )
                          })}
                        </SidebarGroupContent>
                      )}
                    </SidebarGroup>
                  )
                },
              )}
            </AnimatePresence>
          </div>
        </SidebarMenu>
      </SidebarContent>

      <SidebarFooter className="p-4 pt-0">
        <p className="px-2 text-xs text-muted-foreground/80 leading-relaxed">
          Development routes only.
          <br />
          Not shipped to production users.
        </p>
      </SidebarFooter>

      <SidebarRail
        onFocus={(e) => e.currentTarget.blur()}
        className={cn(
          'max-h-32 flex items-center justify-center top-1/2 translate-x-1 -translate-y-1/2 px-4 -right-full after:rounded-full after:w-1 after:-translate-x-1/2 after:transition-transform hover:after:translate-x-0 hover:after:bg-accent outline-none focus-visible:ring-ring focus-visible:ring-2 focus-visible:border-ring transition-transform bg-transparent!',
          !isSidebarOpen && 'translate-x-1!',
        )}
      />
    </Sidebar>
  )
}
