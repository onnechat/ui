'use client'

import { ChevronUpDownIcon } from '@heroicons/react/16/solid'
import Cookies from 'js-cookie'

import { useMemo, useState } from 'react'

import { AnimatePresence, motion } from 'motion/react'

import { Billing } from '@/types/billing.type'
import { Trial } from '@/types/trial.type'

import { api } from '@/lib/api'
import { cn } from '@/lib/cn'

import { useCustomQuery } from '@/hooks/use-custom-query'
import { useRoles } from '@/hooks/use-roles'
import { useWorkspace } from '@/hooks/workspaces/use-workspace'

import { ANIMATION } from '@/constants/animations'
import { COOKIES_KEYS } from '@/constants/keys'

import { Icon, type IconType } from '@/components/icon'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { SidebarMenu, SidebarMenuButton } from '@/components/ui/sidebar'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'

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
  external?: boolean
  label: string
  icon: IconType
  url?: string
  className?: string
  onClick?: () => void
}

export const SidebarWorkspaceSelectPrompt = ({
  className,
}: {
  className?: string
}) => {

  return (
    <SidebarMenu className={className}>
      <SidebarMenuButton asChild size="lg" className="h-12 cursor-pointer">
        <a href="/workspace?select=1">
          <Icon name="ApartmentBuilding" className="size-5 shrink-0" />

          <span className="truncate text-left font-medium">{'title'}</span>

          <ChevronUpDownIcon className="ml-auto size-5 text-muted-foreground" />
        </a>
      </SidebarMenuButton>
    </SidebarMenu>
  )
}

export const SidebarWorkspace = ({
  slug,
  className,
}: {
  slug: string
  className?: string
}) => {
  const router = useMemo(() => ({ push: (_url: string) => {}, replace: (_url: string) => {}, back: () => {}, forward: () => {}, refresh: () => {}, prefetch: (_url: string) => {} }), []);

  const { has, isLoading: isLoadingRoles } = useRoles()
  const { workspace, isLoading: isLoadingWorkspace } = useWorkspace(slug)

  const [open, setOpen] = useState(false)

  const { data: trialData } = useCustomQuery<Trial>({
    queryKey: ['trial'],
    queryFn: async () => {
      const response = await fetch('/api/trial')

      if (!response.ok) {
        throw new Error('Failed to fetch trial data')
      }

      return response.json()
    },
  })

  const days = Number(trialData?.trialDays ?? 30)

  const { data: billing, isLoading: isLoadingBilling } =
    useCustomQuery<Billing>({
      queryKey: ['billing', workspace?.id],
      queryFn: () =>
        api.get(`/establishments/${workspace?.id}/billing/subscription`),
      enabled: !!workspace?.id,
    })

  const { data: isPagePublic } = useCustomQuery<boolean>({
    queryKey: ['page-visibility', workspace?.id],
    queryFn: () =>
      api.get(`/establishments/${workspace?.id}/settings/page/visibility`),
    enabled: !!workspace?.id,
  })

  const isTrialling = !!(billing?.status === 'TRIALING') && billing?.trialEnd
  const isActive = !!(billing?.status === 'ACTIVE')

  const hasSubscription = !!(isActive || isTrialling)

  const handle = `@${workspace?.slug}`
  const basePath = `/workspace/${workspace?.slug}`

  const options: Option[][] = useMemo(
    () =>
      [
        [
          {
            label: 'switchWorkspace',
            icon: 'ArrowRightLeft',
            onClick: () => {
              Cookies.remove(COOKIES_KEYS.WORKSPACE_SLUG)
              router.push('/workspace?select=1')
            },
          },
        ] as Option[],
        [
          ...(isPagePublic
            ? ([
                {
                  label: 'publicPage',
                  icon: 'Eye',
                  url: `/${handle}`,
                  external: true,
                },
              ] as Option[])
            : []),
          ...(has(['admin', 'system'])
            ? ([
                {
                  label: 'settings',
                  icon: 'Settings',
                  url: `${basePath}/settings`,
                },
              ] as Option[])
            : []),
        ] as Option[],
      ].filter((group) => group.length > 0),
    [isPagePublic, handle, has, basePath, router],
  )

  const trialEndInDays = useMemo(() => {
    const today = new Date()
    const trialEndDate = new Date(billing?.trialEnd ?? '')

    const diffTime = Math.abs(trialEndDate.getTime() - today.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

    return Number(diffDays || 0)
  }, [billing?.trialEnd])

  const trialEndWarning = useMemo(() => {
    /**
     * The warning is triggered when the trial ends
     * in less than 30% of the total days
     */
    return trialEndInDays <= days * 0.3
  }, [trialEndInDays, days])

  const trialEndCritical = useMemo(() => {
    /**
     * The critical is triggered when the trial ends
     * in less than 10% of the total days
     */
    return trialEndInDays <= days * 0.1
  }, [trialEndInDays, days])

  const isLoading =
    isLoadingRoles || isLoadingWorkspace || !workspace || isLoadingBilling

  return (
    <AnimatePresence initial={false}>
      <SidebarMenu className={className}>
        {isLoading ? (
          <motion.li
            {...animation({ direction: 'left' })}
            className="w-full h-12"
          >
            <Skeleton className="w-full h-full" />
          </motion.li>
        ) : (
          <>
            <motion.li
              {...animation({ direction: 'left' })}
              className="w-full ml-auto"
            >
              <DropdownMenu open={open} onOpenChange={setOpen}>
                <DropdownMenuTrigger asChild>
                  <SidebarMenuButton
                    size="lg"
                    className="data-popup-open:bg-sidebar-accent data-popup-open:text-sidebar-accent-foreground [&>svg]:size-5 cursor-pointer h-12"
                  >
                    <Avatar className="relative flex shrink-0 overflow-hidden size-8 rounded-lg border">
                      {workspace.logoUrl && (
                        <AvatarImage
                          key={workspace.logoUrl}
                          loading="lazy"
                          width={32}
                          height={32}
                          src={workspace.logoUrl}
                          alt={`${workspace.name}`}
                          className="size-full object-cover"
                        />
                      )}

                      <AvatarFallback name={workspace.name} />
                    </Avatar>

                    <div className="grid flex-1 text-left leading-tight">
                      <div className="flex items-center gap-1">
                        <span className="text-sm truncate font-medium">
                          {workspace.name}
                        </span>

                        <AnimatePresence initial={false}>
                          {!isLoadingBilling && hasSubscription && (
                            <motion.div
                              {...animation({ direction: 'left' })}
                              className="size-5"
                            >
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Icon
                                    name="BadgeCheck"
                                    className={cn(
                                      'size-full text-sidebar hover:-rotate-12 transition-transform duration-200',
                                      isTrialling &&
                                        'fill-subscription-trialling',
                                      isActive && 'fill-subscription-active',
                                    )}
                                  />
                                </TooltipTrigger>

                                <TooltipContent
                                  className={cn(
                                    'font-medium',
                                    isTrialling &&
                                      'bg-subscription-trialling text-subscription-trialling-foreground',
                                    isActive &&
                                      'bg-subscription-active text-subscription-active-foreground',
                                  )}
                                >
                                  {isTrialling
                                    ? 'subscriptionStatus.trialling'
                                    : 'subscriptionStatus.active'}
                                </TooltipContent>
                              </Tooltip>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>

                      <span className="truncate text-xs text-muted-foreground -mt-0.5">
                        {`@${workspace.slug}`}
                      </span>
                    </div>

                    <ChevronUpDownIcon className="ml-auto size-5 text-foreground" />
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
                      <DropdownMenuGroup key={option[0].label}>
                        {option.map((item) => {
                          const isFirstItem =
                            groupIndex === 0 && option[0] === item

                          const isLastItem =
                            groupIndex === options.length - 1 &&
                            option[option.length - 1] === item

                          const isLink = !!('url' in item && item.url)
                          const Component: React.ElementType = isLink
                            ? Link
                            : 'button'

                          const url = item.url

                          return (
                            <DropdownMenuItem
                              asChild
                              resetClassName
                              key={item.label}
                            >
                              <Component
                                {...(isLink
                                  ? {
                                      href: url,
                                      scroll: false,
                                      target: item.external
                                        ? '_blank'
                                        : undefined,
                                      rel: item.external
                                        ? 'noopener noreferrer'
                                        : undefined,
                                      onClick: () => {
                                        item.onClick?.()
                                        setOpen(false)
                                      },
                                    }
                                  : {
                                      onClick: () => {
                                        item.onClick?.()
                                        setOpen(false)
                                      },
                                    })}
                                className={cn(
                                  'flex items-center gap-3 lg:gap-2 w-full relative z-10 group/menu-button hover:bg-accent! data-[active=true]:bg-transparent p-2! text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2.5 data-[disabled=true]:pointer-events-none data-[disabled=true]:opacity-50 transition-[transform,opacity] duration-200 active:scale-[99.35%] rounded-sm outline-none cursor-pointer ring-0!',
                                  isFirstItem && 'rounded-t-lg',
                                  isLastItem && 'rounded-b-lg',
                                  item.className,
                                )}
                              >
                                <div className="flex items-center justify-center size-4 aspect-square">
                                  {item.icon &&
                                  typeof item.icon === 'function' ? (
                                    item.icon
                                  ) : (
                                    <Icon name={item.icon} />
                                  )}
                                </div>

                                <span className="text-sm">{item.label}</span>

                                {item.external && (
                                  <Icon
                                    name="ExternalLink"
                                    className="ml-auto size-4"
                                  />
                                )}
                              </Component>
                            </DropdownMenuItem>
                          )
                        })}

                        {!isLastGroup && <DropdownMenuSeparator />}
                      </DropdownMenuGroup>
                    )
                  })}
                </DropdownMenuContent>
              </DropdownMenu>
            </motion.li>

            {isTrialling && (
              <motion.li
                {...animation({ direction: 'left' })}
                className="w-full mt-1 -mb-1"
              >
                <SidebarMenuButton
                  size="lg"
                  onClick={() => router.push(`${basePath}/settings/billing`)}
                  className="data-popup-open:bg-sidebar-accent data-popup-open:text-sidebar-accent-foreground [&>svg]:size-5 cursor-pointer min-h-12 h-fit bg-transparent hover:bg-transparent! px-0"
                >
                  <div
                    style={
                      {
                        '--current-color': trialEndWarning
                          ? `var(--color-destructive)`
                          : `var(--color-subscription-trialling)`,
                      } as React.CSSProperties
                    }
                    className={cn(
                      'relative flex flex-col gap-2 p-3 rounded-lg w-full overflow-hidden',
                      'bg-(--current-color)/5 text-(--current-color)',
                    )}
                  >
                    <div className="flex items-center gap-2">
                      <Icon
                        className="size-4"
                        name={trialEndWarning ? 'AlertTriangle' : 'BadgeCheck'}
                      />

                      <span className="text-sm">
                        {'trialEndsOn'}
                      </span>
                    </div>

                    <div className="w-full h-1 rounded-full overflow-hidden flex gap-px">
                      {Array.from({ length: days }, (_, index) => {
                        const daysPassed = days - trialEndInDays
                        const isPassed = index < daysPassed

                        const passedClassName = isPassed
                          ? 'bg-(--current-color)'
                          : 'bg-(--current-color)/25 dark:bg-(--current-color)/5'

                        return (
                          <div
                            key={index}
                            className={cn(
                              'flex-1 h-full rounded-xl',
                              passedClassName,
                              trialEndCritical && 'animate-pulse duration-50',
                            )}
                            style={{
                              animationDelay: `${index * 100}ms`,
                            }}
                          />
                        )
                      })}
                    </div>
                  </div>
                </SidebarMenuButton>
              </motion.li>
            )}
          </>
        )}
      </SidebarMenu>
    </AnimatePresence>
  )
}
