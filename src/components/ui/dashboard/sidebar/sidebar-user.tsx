'use client'

import { ChevronUpDownIcon } from '@heroicons/react/16/solid'
import Cookies from 'js-cookie'

import React, { useMemo, useState, useTransition } from 'react'

import { useTheme } from 'next-themes'

import { AnimatePresence, motion } from 'motion/react'

import { getFlagByLocale, getLocaleLabel, LOCALES } from '@/config/locales'
import { LISTABLE_THEMES } from '@/config/themes'

import { cn } from '@/lib/cn'

import { useLogout } from '@/hooks/auth'
import { useMe } from '@/hooks/user/use-me'
import { useMeRole } from '@/hooks/user/use-me-role'

import { ANIMATION } from '@/constants/animations'
import { COOKIES_KEYS } from '@/constants/keys'

import { useHelpDialog } from '@/components/ui/dashboard/dialogs/help/help.dialog'
import { useSidebarCommandPalette } from '@/components/ui/dashboard/sidebar/command-palette'
import { Icon, IconType } from '@/components/icon'
import { Loader } from '@/components/ui/loader'

import { Avatar, AvatarFallback } from '@/components/internal/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from '@/components/internal/dropdown-menu'
import {
  SidebarMenu,
  SidebarMenuButton,
  useSidebar,
} from '@/components/internal/sidebar'
import { Skeleton } from '@/components/internal/skeleton'

const animation = ({
  direction = 'up',
  px = 10,
  duration = ANIMATION.DURATION,
  reverse = false,
}: {
  direction?: 'left' | 'right' | 'up' | 'down'
  px?: number
  duration?: number
  reverse?: boolean
} = {}) => {
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

type Option = {
  id?: string
  label: string
  image?: string
  icon?: IconType
  url?: string
  className?: string
  onClick?: () => void
  subItems?: SubItem[]
}

type SubItem = Omit<Option, 'subItems'> & {
  selected?: boolean
}

export const SidebarUser = ({
  className,
  itemClassName,
  triggerClassName,
}: {
  className?: string
  itemClassName?: string
  triggerClassName?: string
}) => {
  const pathname = "/";
  const router = useMemo(() => ({ push: (_url: string) => {}, replace: (_url: string) => {}, back: () => {}, forward: () => {}, refresh: () => {}, prefetch: (_url: string) => {} }), []);

  const locale = "pt-BR";

  const { isSystem } = useMeRole()
  const { me: user, isLoading } = useMe()

  const { logout, isPending } = useLogout()
  const { theme, setTheme } = useTheme()

  const { isMobile } = useSidebar()
  const { toggle: toggleHelpDialog } = useHelpDialog()

  const { openCommandPalette } = useSidebarCommandPalette()

  const [isPendingLocale, startTransition] = useTransition()

  const [open, setOpen] = useState(false)
  const [isLoggingOut, setIsLoggingOut] = React.useState(false)

  const handleLogout = React.useCallback(async () => {
    try {
      setIsLoggingOut(true)
      await logout()
      setOpen(false)
    } finally {
      setIsLoggingOut(false)
    }
  }, [logout])

  const handleLocaleChange = React.useCallback(
    (newLocale: string) => {
      startTransition(() => {
        Cookies.set(COOKIES_KEYS.LOCALE, newLocale, {
          path: '/',
          sameSite: 'lax',
        })

        router.refresh()
        setOpen(false)
      })
    },
    [router],
  )

  const options: Option[][] = useMemo(
    () => [
      ...(isMobile
        ? [
            [
              {
                label: 'Pesquisar',
                icon: 'Magnifier' as IconType,
                onClick: openCommandPalette,
              },
            ],
          ]
        : []),
      [
        {
          label: 'profile',
          icon: 'User',
          url: '/user',
        },
        {
          label: 'preferences',
          icon: 'Gear2',
          url: '/user/preferences',
        },
      ],
      ...(isMobile
        ? [
            [
              {
                label: 'items.helpAndDoubts',
                icon: 'Headset' as IconType,
                onClick: toggleHelpDialog,
              },
            ],
          ]
        : []),
      ...(isSystem
        ? [
            [
              pathname.match(/^\/workspace\/([^/]+)/)
                ? {
                    label: 'Admin',
                    icon: 'ShieldCheck' as IconType,
                    url: '/admin',
                  }
                : {
                    label: 'Workspace',
                    icon: 'House' as IconType,
                    url: Cookies.get(COOKIES_KEYS.WORKSPACE_SLUG)
                      ? `/workspace/${Cookies.get(COOKIES_KEYS.WORKSPACE_SLUG)}`
                      : '/workspace?select=1',
                  },
            ],
          ]
        : []),
      [
        {
          label: 'theme',
          icon: 'Monitor',
          subItems: LISTABLE_THEMES.map((th) => ({
            selected: th.id === theme,
            icon: th.icon,
            label: th.labelKey,
            onClick: () => setTheme(th.id),
            className: th.id === theme ? 'bg-accent' : undefined,
          })),
        },
        {
          label: 'language',
          icon: 'Globe',
          subItems: LOCALES.map((l) => ({
            selected: l === locale,
            label: getLocaleLabel(l),
            image: getFlagByLocale(l),
            icon: l === locale ? 'Check' : undefined,
            onClick: () => handleLocaleChange(l),
            className: l === locale ? 'bg-accent' : undefined,
          })),
        },
      ],
      [
        {
          id: 'logout',
          label: isLoggingOut ? 'loggingOut' : 'logout',
          icon: 'ExitDoor',
          className:
            'text-destructive hover:!text-destructive hover:!bg-destructive/5',
          onClick: handleLogout,
        },
      ],
    ],
    [
      isMobile,
      openCommandPalette,
      theme,
      locale,
      pathname,
      isSystem,
      setTheme,
      isLoggingOut,
      handleLogout,
      toggleHelpDialog,
      handleLocaleChange,
    ],
  )

  return (
    <AnimatePresence initial={false}>
      <SidebarMenu className={className}>
        {isLoading || !user || (!user && !isPending) ? (
          <motion.li {...animation({ direction: 'left' })} className="h-12">
            <Skeleton className="w-full h-full" />
          </motion.li>
        ) : (
          <motion.li
            {...animation({ direction: 'left' })}
            className="w-full ml-auto"
          >
            <DropdownMenu open={open} onOpenChange={setOpen}>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton
                  size="lg"
                  className={cn(
                    itemClassName,
                    triggerClassName,
                    'flex items-center gap-3 lg:gap-2 w-full relative z-10 p-0 lg:p-2 lg:h-12 cursor-pointer',
                  )}
                >
                  <Avatar className="relative flex shrink-0 overflow-hidden max-lg:min-w-10 max-lg:min-h-10 lg:min-w-8 lg:min-h-8 aspect-square border max-lg:rounded-2xl">
                    <AvatarFallback name={user.name} />
                  </Avatar>

                  <div className="hidden lg:grid flex-1 text-left leading-tight">
                    <span className="text-sm truncate font-medium">
                      {user.name}
                    </span>

                    <span className="truncate text-xs text-muted-foreground -mt-0.5">
                      {user.email}
                    </span>
                  </div>

                  <ChevronUpDownIcon className="ml-auto size-5 text-foreground hidden lg:block" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>

              <DropdownMenuContent
                align="end"
                side="bottom"
                sideOffset={4}
                className="min-w-64 w-(--anchor-width) overflow-visible"
              >
                {options.map((option, groupIndex) => {
                  const isLastGroup = groupIndex === options.length - 1

                  return (
                    <DropdownMenuGroup key={groupIndex}>
                      {option.map((item) => {
                        const isFirstItem =
                          groupIndex === 0 && option[0] === item

                        const isLastItem =
                          groupIndex === options.length - 1 &&
                          option[option.length - 1] === item

                        const hasSubItems =
                          !!item.subItems && item.subItems.length > 0

                        if (hasSubItems) {
                          return (
                            <DropdownMenuSub key={item.label}>
                              <DropdownMenuSubTrigger
                                className={cn(
                                  item.className,
                                  'flex items-center gap-3 lg:gap-2 w-full relative z-10 p-4 lg:px-2 lg:py-2',
                                )}
                                disabled={
                                  isPendingLocale ||
                                  (isLoggingOut && item.label === 'logout')
                                }
                              >
                                {item.icon && (
                                  <div className="flex items-center justify-center size-4 aspect-square">
                                    <Icon name={item.icon} />
                                  </div>
                                )}

                                <span className="text-sm">{item.label}</span>
                              </DropdownMenuSubTrigger>

                              <DropdownMenuSubContent className="space-y-1 min-w-[200px]">
                                {item.subItems!.map((subItem, subIndex) => {
                                  const isFirstSub = subIndex === 0

                                  const isLastSub =
                                    subIndex === item.subItems!.length - 1

                                  return (
                                    <DropdownMenuItem
                                      key={subItem.label}
                                      disabled={isPendingLocale}
                                      onClick={() => {
                                        subItem.onClick?.()
                                        // We don't always want to close on sub-item click if it's a selection that might need feedback?
                                        // But sidebar-workspace doesn't have sub-items, usually we close.
                                        setOpen(false)
                                      }}
                                      className={cn(
                                        subItem.className,
                                        'text-muted-foreground gap-3 p-4 lg:px-2 lg:py-2',
                                        isFirstSub && 'rounded-t-lg',
                                        isLastSub && 'rounded-b-lg',
                                      )}
                                    >
                                      {subItem.image ? (
                                        <img
                                          alt={subItem.label}
                                          src={subItem.image}
                                          className="size-4 shrink-0 rounded-sm object-cover"
                                        />
                                      ) : subItem.icon ? (
                                        <Icon
                                          name={subItem.icon}
                                          className="size-4 shrink-0"
                                        />
                                      ) : null}

                                      <span className="font-normal mr-auto">
                                        {subItem.label}
                                      </span>

                                      {subItem.selected && (
                                        <Icon
                                          name="Check"
                                          className="size-4 shrink-0"
                                        />
                                      )}
                                    </DropdownMenuItem>
                                  )
                                })}
                              </DropdownMenuSubContent>
                            </DropdownMenuSub>
                          )
                        }

                        const isLink = !!('url' in item && item.url)
                        const Component: React.ElementType = isLink
                          ? Link
                          : 'button'

                        const onClickFn = () => {
                          item.onClick?.()
                          setOpen(false)
                        }

                        return (
                          <DropdownMenuItem
                            asChild
                            resetClassName
                            key={item.label}
                            disabled={
                              isPendingLocale ||
                              (isLoggingOut && item.label === 'logout')
                            }
                          >
                            <Component
                              onClick={onClickFn}
                              disabled={
                                isPendingLocale ||
                                (isLoggingOut && item.label === 'logout')
                              }
                              {...(isLink && {
                                href: item.url,
                                scroll: false,
                              })}
                              className={cn(
                                'flex items-center gap-3 lg:gap-2 w-full relative z-10 p-4 lg:px-2 lg:py-2 text-muted-foreground',
                                isFirstItem && 'rounded-t-lg',
                                isLastItem && 'rounded-b-lg',
                                (isPendingLocale ||
                                  (isPending && item.label === 'logout')) &&
                                  'opacity-50 cursor-not-allowed',
                                item.className,
                              )}
                            >
                              {item.icon && (
                                <div className="flex items-center justify-center size-4 aspect-square">
                                  <Icon name={item.icon} />
                                </div>
                              )}

                              <span className="text-sm">{item.label}</span>

                              {item.id === 'logout' && isPending && (
                                <Loader variant="button" className="ml-auto" />
                              )}
                            </Component>
                          </DropdownMenuItem>
                        )
                      })}

                      {!isLastGroup && (
                        <DropdownMenuSeparator className="max-lg:hidden" />
                      )}
                    </DropdownMenuGroup>
                  )
                })}
              </DropdownMenuContent>
            </DropdownMenu>
          </motion.li>
        )}
      </SidebarMenu>
    </AnimatePresence>
  )
}
