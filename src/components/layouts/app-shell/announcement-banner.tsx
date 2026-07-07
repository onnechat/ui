'use client'

import * as React from 'react'

import { AnimatePresence, motion } from 'motion/react'

import { cn } from '@/lib/cn'

import { useIsClient } from '@/hooks/use-is-client'

import { Icon } from '@/components/icon'

import { Button } from '@/components/ui/button'

export const ANNOUNCEMENT_TYPES = {
  CRITICAL: 'CRITICAL',
  ERROR: 'ERROR',
  INFO: 'INFO',
  MAINTENANCE: 'MAINTENANCE',
  NEW: 'NEW',
  SALE: 'SALE',
  SUCCESS: 'SUCCESS',
  UPDATE: 'UPDATE',
  WARNING: 'WARNING',
} as const

export type AnnouncementType =
  (typeof ANNOUNCEMENT_TYPES)[keyof typeof ANNOUNCEMENT_TYPES]

const ANNOUNCEMENT_COLORS: Record<
  AnnouncementType,
  { background: string; foreground: string }
> = {
  [ANNOUNCEMENT_TYPES.NEW]: {
    background: 'var(--color-info)',
    foreground: 'var(--color-info-foreground)',
  },
  [ANNOUNCEMENT_TYPES.SALE]: {
    background: 'var(--color-success)',
    foreground: 'var(--color-success-foreground)',
  },
  [ANNOUNCEMENT_TYPES.WARNING]: {
    background: 'var(--color-warning)',
    foreground: 'var(--color-warning-foreground)',
  },
  [ANNOUNCEMENT_TYPES.INFO]: {
    background: 'var(--color-info)',
    foreground: 'var(--color-info-foreground)',
  },
  [ANNOUNCEMENT_TYPES.SUCCESS]: {
    background: 'var(--color-success)',
    foreground: 'var(--color-success-foreground)',
  },
  [ANNOUNCEMENT_TYPES.ERROR]: {
    background: 'var(--color-destructive)',
    foreground: 'var(--color-destructive-foreground)',
  },
  [ANNOUNCEMENT_TYPES.CRITICAL]: {
    background: 'var(--color-destructive)',
    foreground: 'var(--color-destructive-foreground)',
  },
  [ANNOUNCEMENT_TYPES.MAINTENANCE]: {
    background: 'var(--color-warning)',
    foreground: 'var(--color-warning-foreground)',
  },
  [ANNOUNCEMENT_TYPES.UPDATE]: {
    background: 'var(--color-info)',
    foreground: 'var(--color-info-foreground)',
  },
}

function resolveAnnouncementType(type: string): AnnouncementType {
  if ((Object.values(ANNOUNCEMENT_TYPES) as string[]).includes(type)) {
    return type as AnnouncementType
  }

  return ANNOUNCEMENT_TYPES.NEW
}

const ANNOUNCEMENT_BANNER_HEIGHT = 40

function RoundedCornerTriangle({ className }: { className?: string }) {
  return (
    <svg
      width="12"
      height="12"
      xmlns="http://www.w3.org/2000/svg"
      className={cn('fill-(--banner)', className)}
    >
      <path d="M 0 -1 L 0 12 A 12 12, 0, 0, 1, 12 0 L 12 -1 Z" />
    </svg>
  )
}

export type AnnouncementBannerProps = {
  /** Banner message. The banner is not rendered when empty. */
  message?: string
  /** Semantic type; controls the color pair. Unknown values fall back to `NEW`. */
  type?: AnnouncementType | (string & NonNullable<unknown>)
  /** Chip label shown before the message on desktop. Defaults to the type itself — pass a translated label if needed. */
  typeLabel?: string
  /** Hides the close button when `false`. */
  dismissible?: boolean
  /** Called when the user dismisses the banner. */
  onDismiss?: () => void
  /** Optional `id` for the close button (e.g. an analytics id). */
  closeButtonId?: string
  className?: string
}

/**
 * Fixed top banner for product announcements. Sets the global
 * `--announcement-height` CSS variable (used by `AppShell` to offset the
 * viewport height) and auto-marquees messages that overflow the available
 * width.
 */
export function AnnouncementBanner({
  message = '',
  type = ANNOUNCEMENT_TYPES.NEW,
  typeLabel,
  dismissible = true,
  onDismiss,
  closeButtonId,
  className,
}: AnnouncementBannerProps) {
  const mounted = useIsClient()

  const [hidden, setHidden] = React.useState(false)

  const announcementColors = ANNOUNCEMENT_COLORS[resolveAnnouncementType(type)]

  const hasAnnouncement = message.length > 0

  const announcementTypeLabel = typeLabel ?? type

  const messageContainerRef = React.useRef<HTMLDivElement>(null)
  const messageTextRef = React.useRef<HTMLSpanElement>(null)

  const [messageScroll, setMessageScroll] = React.useState({
    delta: 0,
    overflow: false,
  })

  const handleHide = () => {
    setHidden(true)
    onDismiss?.()
  }

  React.useLayoutEffect(() => {
    const container = messageContainerRef.current
    const text = messageTextRef.current

    if (!container || !text) return

    const update = () => {
      const available = container.clientWidth
      const full = text.scrollWidth

      const delta = Math.max(0, full - available)
      const overflow = delta > 1

      setMessageScroll((prev) =>
        prev.delta === delta && prev.overflow === overflow
          ? prev
          : { delta, overflow },
      )
    }

    update()

    const ro = new ResizeObserver(update)
    ro.observe(container)

    const parent = container.parentElement
    if (parent) {
      ro.observe(parent)
    }

    window.addEventListener('resize', update)

    return () => {
      ro.disconnect()
      window.removeEventListener('resize', update)
    }
  }, [message, hasAnnouncement])

  React.useEffect(() => {
    if (hidden || !hasAnnouncement) {
      document.documentElement.style.setProperty('--announcement-height', '0px')
      return
    }

    document.documentElement.style.setProperty(
      '--announcement-height',
      `${ANNOUNCEMENT_BANNER_HEIGHT}px`,
    )

    return () => {
      document.documentElement.style.setProperty('--announcement-height', '0px')
    }
  }, [hasAnnouncement, hidden])

  if (!mounted || hidden || !hasAnnouncement) return null

  return (
    <>
      <div className="h-10 shrink-0" />

      <AnimatePresence mode="popLayout">
        <motion.div
          data-slot="announcement-banner"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3 }}
          className={cn(
            'fixed top-0 left-0 right-0 z-50 flex min-h-0 w-full flex-col bg-(--banner) text-(--banner-foreground)',
            className,
          )}
          style={
            {
              '--banner': announcementColors.background,
              '--banner-foreground': announcementColors.foreground,
            } as React.CSSProperties
          }
        >
          <div className="flex h-10 min-w-0 items-center gap-2 px-2.5 sm:px-4">
            <div className="flex min-w-0 flex-1 items-center justify-center">
              <div
                className={cn(
                  'flex min-w-0 items-center gap-2',
                  messageScroll.overflow
                    ? 'w-full max-w-full justify-start'
                    : 'w-auto max-w-full',
                )}
              >
                <div className="hidden lg:flex shrink-0 items-center justify-center transition duration-200 ease-out h-4 gap-1.5 uppercase rounded-[5px] px-1.25 text-[9px] leading-[11px] font-semibold tracking-[0.18px] bg-(--banner-foreground)/20 text-(--banner-foreground) pointer-events-none select-none">
                  {announcementTypeLabel}
                </div>

                <div
                  ref={messageContainerRef}
                  className={cn(
                    'min-w-0 overflow-hidden',
                    messageScroll.overflow && 'min-w-0 flex-1',
                  )}
                >
                  <motion.span
                    ref={messageTextRef}
                    className="inline-block text-xs sm:text-sm whitespace-nowrap will-change-transform"
                    animate={
                      messageScroll.overflow
                        ? {
                            x: [
                              0,
                              0,
                              -messageScroll.delta,
                              -messageScroll.delta,
                              0,
                              0,
                            ],
                          }
                        : { x: 0 }
                    }
                    transition={
                      messageScroll.overflow
                        ? {
                            duration: Math.max(12, messageScroll.delta / 8),
                            repeat: Infinity,
                            ease: 'easeInOut',
                            times: [0, 0.12, 0.35, 0.5, 0.75, 1],
                          }
                        : { duration: 0 }
                    }
                  >
                    {message}
                  </motion.span>
                </div>
              </div>
            </div>

            {dismissible && (
              <div className="flex shrink-0">
                <Button
                  size="icon"
                  variant="ghost"
                  id={closeButtonId}
                  onClick={handleHide}
                  className="hover:bg-(--banner-foreground)/20! hover:text-(--banner-foreground)! max-h-8 max-w-8 shrink-0"
                >
                  <Icon name="Xmark" />
                </Button>
              </div>
            )}
          </div>

          <div className="pointer-events-none absolute inset-x-0 bottom-0 hidden h-3 translate-y-full lg:block">
            <RoundedCornerTriangle className="absolute left-0" />
            <RoundedCornerTriangle className="absolute right-0 -scale-x-100" />
          </div>
        </motion.div>
      </AnimatePresence>
    </>
  )
}
