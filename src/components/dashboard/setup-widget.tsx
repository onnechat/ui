'use client'

import { useCallback, useRef, useState } from 'react'

import { AnimatePresence, motion } from 'motion/react'

import { channels } from '@/config/channels'

import { cn } from '@/lib/cn'
import { env } from '@/lib/env'

import { useSetup } from '@/hooks/setup/use-setup'
import { useIsMobile } from '@/hooks/use-mobile'
import { useWorkspaceRole } from '@/hooks/user/use-workspace-role'
import { useWorkspace } from '@/hooks/workspaces/use-workspace'

import { ANIMATION } from '@/constants/animations'

import { Dialog } from '@/components/dialog'
import { Icon, type IconType } from '@/components/icon'
import { SocialIcon } from '@/components/icon/social'
import { Loader } from '@/components/loader'

import { Button } from '@/components/ui/button'

interface SetupStepConfig {
  key: string
  icon: IconType
  url?: {
    basePath: string
    path: string
  }
  isCompleted: (setup: SetupData['setup']) => boolean
}

const SETUP_STEPS: SetupStepConfig[] = [
  // {
  //   key: 'contacts',
  //   icon: 'BookUser',
  //   translationKey: 'contacts',
  //   url: {
  //     basePath: '/workspace',
  //     path: '/contacts',
  //   },
  // },
  {
    key: 'services',
    icon: 'Box',
    url: {
      basePath: '/workspace',
      path: '/services',
    },
    isCompleted: (setup: SetupData['setup']) => setup.services,
  },
  {
    key: 'professionals',
    icon: 'IdCardLanyard',
    url: {
      basePath: '/workspace',
      path: '/professionals',
    },
    isCompleted: (setup: SetupData['setup']) => setup.professionals.create,
  },
  {
    key: 'professionals-services',
    icon: 'Briefcase',
    url: {
      basePath: '/workspace',
      path: '/professionals/services',
    },
    isCompleted: (setup: SetupData['setup']) => setup.professionals.services,
  },
  {
    key: 'professionals-availability',
    icon: 'Clock',
    url: {
      basePath: '/workspace',
      path: '/professionals/availability',
    },
    isCompleted: (setup: SetupData['setup']) =>
      setup.professionals.availability,
  },
  {
    key: 'channels',
    icon: 'MessageCircle',
    url: {
      basePath: '/workspace/settings',
      path: '/channels',
    },
    isCompleted: (setup: SetupData['setup']) => setup.channels,
  },
]

import { SetupData } from '@/types/setup.type'

import { useHaptics } from '@/hooks/use-haptics'

function getNextIncompleteStep(
  setup: SetupData['setup'],
): SetupStepConfig | null {
  for (const step of SETUP_STEPS) {
    if (!step.isCompleted(setup)) {
      return step
    }
  }

  return null
}

type SetupWidgetContentProps = {
  setup: SetupData['setup']
  toggleExpanded: () => void
  isLoadingSetup: boolean
  isFetchingWorkspace: boolean
}

type SetupWidgetProps = {
  placement: 'shell' | 'sidebar'
  className?: string
}

type SetupTriggerButtonProps = {
  isExpanded: boolean
  onClick: () => void
  completedSteps: number
  totalSteps: number
  label: string
  fullWidth?: boolean
  className?: string
}

const SIDEBAR_VIEW_EASE = [0.32, 0.72, 0, 1] as const
const SIDEBAR_VIEW_DURATION = 0.22

function SetupStepProgressSvg({
  completedSteps,
  totalSteps,
  className,
}: {
  completedSteps: number
  totalSteps: number
  className?: string
}) {
  return (
    <div className={cn('relative size-4 shrink-0', className)}>
      <svg
        viewBox="0 0 24 24"
        className="size-full -rotate-90"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden
      >
        {SETUP_STEPS.map((step, index) => {
          const isStepDone = index < completedSteps

          const radius = 10
          const circumference = 2 * Math.PI * radius

          const segmentLength = circumference / totalSteps
          const dashLength = segmentLength - segmentLength * 0.3

          const offset = index * segmentLength

          return (
            <circle
              key={step.key}
              cx="12"
              cy="12"
              r={radius}
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              className={cn(
                'transition-opacity duration-300',
                isStepDone ? 'opacity-100' : 'opacity-20',
              )}
              strokeDasharray={`${dashLength} ${circumference - dashLength}`}
              strokeDashoffset={-offset}
            />
          )
        })}
      </svg>
    </div>
  )
}

function SetupTriggerButton({
  isExpanded,
  onClick,
  completedSteps,
  totalSteps,
  label,
  fullWidth = false,
  className,
}: SetupTriggerButtonProps) {
  const button = (
    <Button
      variant="primary"
      onClick={onClick}
      className={cn(
        'justify-between shadow-none shrink-0',
        fullWidth
          ? 'h-10 min-h-10 w-full rounded-lg! px-4 py-0'
          : 'w-fit rounded-full',
        className,
      )}
    >
      <SetupStepProgressSvg
        completedSteps={completedSteps}
        totalSteps={totalSteps}
      />

      <span
        className={cn(
          'font-medium',
          fullWidth && 'min-w-0 flex-1 truncate text-left',
        )}
      >
        {label}
      </span>

      <Icon
        name="ChevronDown"
        className={cn(
          'size-4 transition-transform',
          isExpanded && 'rotate-180',
          fullWidth && 'ml-auto',
        )}
      />
    </Button>
  )

  if (fullWidth) {
    return <div className="w-full min-w-0">{button}</div>
  }

  return (
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{
        type: 'spring',
        bounce: 0.5,
        duration: 0.8,
        delay: 0.3,
      }}
    >
      {button}
    </motion.div>
  )
}

type SetupStepRowProps = {
  step: SetupStepConfig
  setup: SetupData['setup']
  toggleExpanded: () => void
  compact?: boolean
}

function SetupStepRow({
  step,
  setup,
  toggleExpanded,
  compact,
}: SetupStepRowProps) {
  const router = { push: () => {}, replace: () => {}, back: () => {}, forward: () => {}, refresh: () => {}, prefetch: () => {} } as any;
  const { slug } = useParams()

  const isCompleted = step.isCompleted(setup)
  const handleClick = () => {
    if (isCompleted) return
    toggleExpanded()

    if (step.url) {
      const basePath = (() => {
        if (step.url.basePath === '/workspace') {
          return `/workspace/${slug}`
        }

        if (step.url.basePath === '/workspace/settings') {
          return `/workspace/${slug}/settings`
        }

        return step.url.basePath
      })()

      setTimeout(() => {
        router.push(`${basePath}${step.url!.path}`)
      }, ANIMATION.DURATION)
    }
  }

  return (
    <Button
      variant="ghost"
      onClick={handleClick}
      className={cn(
        'flex h-auto w-full min-h-12 cursor-pointer gap-3 rounded-lg border-border bg-card/70 py-4 text-left outline-border transition-colors group hover:bg-card',
        compact
          ? 'flex-col-reverse min-h-0 p-3! bg-transparent items-start justify-start rounded-md!'
          : 'items-center justify-center',
      )}
    >
      {!compact && (
        <div
          className={cn(
            'flex size-5 shrink-0 items-center justify-center rounded-full transition-colors',
            !isCompleted &&
              'border-2 border-muted-foreground/30 text-muted-foreground',
            isCompleted && 'border-0 bg-success text-success-foreground',
          )}
        >
          {isCompleted && (
            <Icon name="Check" className="size-3 fill-transparent!" />
          )}
        </div>
      )}

      <p
        className={cn(
          'mr-2 w-full text-wrap text-sm',
          isCompleted && 'text-muted-foreground line-through opacity-75',
        )}
      >
        {`steps.${step.key}`, {
          name: env.brand.name,
          channel: channels.whatsapp.label,
        }}
      </p>

      {step.key === 'channels' ? (
        <SocialIcon.WhatsApp className="size-4 fill-current/25" />
      ) : (
        <Icon name={step.icon} className="size-4" />
      )}
    </Button>
  )
}

export function SetupWidget({ placement, className }: SetupWidgetProps) {
  const params = {} as any;

  const { isAdmin } = useWorkspaceRole()
  const { trigger } = useHaptics()

  const slug = params.slug as string

  const { workspace, isFetching: isFetchingWorkspace } = useWorkspace(slug)
  const { data: setupData, isLoading: isLoadingSetup } = useSetup(workspace?.id)

  const isMobile = useIsMobile()

  const isAnimating = useRef(false)

  const [isExpanded, setIsExpanded] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const isSetupFinished = setupData?.isComplete ?? false

  const setup = setupData?.setup ?? {
    services: false,
    channels: false,
    professionals: {
      create: false,
      services: false,
      availability: false,
    },
  }

  const totalSteps = SETUP_STEPS.length

  const completedSteps = SETUP_STEPS.filter((step) =>
    step.isCompleted(setup),
  ).length

  const handleToggle = useCallback(() => {
    if (isAnimating.current) return

    trigger('click')

    isAnimating.current = true
    setIsExpanded((expanded) => !expanded)

    setTimeout(() => {
      isAnimating.current = false
    }, ANIMATION.DURATION)
  }, [trigger])

  if (placement === 'shell' && !isMobile) {
    return null
  }

  if (placement === 'sidebar' && isMobile) {
    return null
  }

  if (!isAdmin || isSetupFinished) {
    return null
  }

  if (placement === 'sidebar') {
    const nextStep = getNextIncompleteStep(setup)
    const closeSidebar = () => setSidebarOpen(false)

    return (
      <div className={cn('w-full min-w-0', className)}>
        <div
          className={cn(
            'overflow-hidden rounded-lg min-h-10',
            sidebarOpen
              ? 'bg-card'
              : 'hover:bg-sidebar-accent! hover:text-sidebar-accent-foreground!',
          )}
        >
          <AnimatePresence mode="wait" initial={false}>
            {sidebarOpen ? (
              <motion.div
                key="sidebar-setup-open"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 8 }}
                transition={{
                  duration: SIDEBAR_VIEW_DURATION,
                  ease: SIDEBAR_VIEW_EASE,
                }}
                className="p-1 pt-0 text-left"
              >
                <div className="flex items-center justify-between gap-2 p-2">
                  <div className="flex min-w-0 flex-1 items-start gap-2">
                    <SetupStepProgressSvg
                      totalSteps={totalSteps}
                      completedSteps={completedSteps}
                      className="mt-0.5 text-foreground"
                    />

                    <h3 className="text-sm font-medium leading-snug">
                      {'trigger'}
                    </h3>
                  </div>

                  <Button
                    type="button"
                    variant="ghost"
                    size="icon-sm"
                    className="-mr-1 -mt-0.5 shrink-0 rounded-sm"
                    onClick={closeSidebar}
                    aria-label={'dismiss'}
                  >
                    <Icon name="X" className="size-4" />
                  </Button>
                </div>

                <div className="rounded-lg bg-background p-2">
                  {isFetchingWorkspace || isLoadingSetup ? (
                    <Loader variant="center" className="min-h-24 py-6" />
                  ) : nextStep ? (
                    <SetupStepRow
                      compact
                      step={nextStep}
                      setup={setup}
                      toggleExpanded={closeSidebar}
                    />
                  ) : null}
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="sidebar-setup-closed"
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{
                  duration: SIDEBAR_VIEW_DURATION,
                  ease: SIDEBAR_VIEW_EASE,
                }}
                className="w-full min-w-0"
              >
                <SetupTriggerButton
                  fullWidth
                  isExpanded={false}
                  label={'trigger'}
                  totalSteps={totalSteps}
                  completedSteps={completedSteps}
                  onClick={() => setSidebarOpen(true)}
                  className={cn(
                    'transition-none',
                    // 'bg-transparent! text-muted-foreground! hover:bg-sidebar-accent! hover:text-sidebar-accent-foreground!',
                  )}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    )
  }

  return (
    <>
      <Dialog
        isOpen={isExpanded}
        onOpenChange={handleToggle}
        title={'title'}
        description={'description', { name: env.brand.name }}
      >
        <SetupWidgetContent
          setup={setup}
          toggleExpanded={handleToggle}
          isLoadingSetup={isLoadingSetup}
          isFetchingWorkspace={isFetchingWorkspace}
        />
      </Dialog>

      <div
        suppressHydrationWarning
        className={cn(
          'fixed z-50 flex flex-col items-center gap-2 transition-all max-lg:bottom-24 max-lg:left-1/2 max-lg:-translate-x-1/2',
          className,
        )}
      >
        <SetupTriggerButton
          isExpanded={isExpanded}
          onClick={handleToggle}
          completedSteps={completedSteps}
          totalSteps={totalSteps}
          label={'trigger'}
        />
      </div>
    </>
  )
}

function SetupWidgetContent({
  setup,
  toggleExpanded,
  isLoadingSetup,
  isFetchingWorkspace,
}: SetupWidgetContentProps) {
  if (isFetchingWorkspace || isLoadingSetup) {
    return <Loader variant="center" />
  }

  return (
    <div className="flex flex-col gap-2">
      {SETUP_STEPS.map((step) => (
        <SetupStepRow
          key={step.key}
          step={step}
          setup={setup}
          toggleExpanded={toggleExpanded}
        />
      ))}
    </div>
  )
}
