'use client'

import { useEffect, useState } from 'react'

import { AnimatePresence, motion } from 'motion/react'

import { cn } from '@/lib/cn'
import { env } from '@/lib/env'

import { useIsClient } from '@/hooks/use-is-client'

import { Icon } from '@/components/icon'

import { Button } from '@/components/ui/button'

const ANNOUNCEMENT_TYPES = {
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

type AnnouncementType =
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

export const AnnouncementBanner = () => {
  const mounted = useIsClient()
  const [hidden, setHidden] = useState(false)

  const ENV_ANNOUNCEMENT = {
    TYPE: env.dashboard?.announcement?.type || ANNOUNCEMENT_TYPES.NEW,
    MESSAGE: env.dashboard?.announcement?.message || '',
  }

  const announcement = {
    colors: ANNOUNCEMENT_COLORS[ENV_ANNOUNCEMENT.TYPE as AnnouncementType],
    message: ENV_ANNOUNCEMENT.MESSAGE,
    type: ENV_ANNOUNCEMENT.TYPE,
  }

  const hasAnnouncement = announcement.message.length > 0

  const handleHide = () => {
    setHidden(true)
  }

  const RoundedCornerTriangle = ({ className }: { className?: string }) => (
    <svg
      width="12"
      height="12"
      xmlns="http://www.w3.org/2000/svg"
      className={cn('fill-(--banner)', className)}
    >
      <path d="M 0 -1 L 0 12 A 12 12, 0, 0, 1, 12 0 L 12 -1 Z" />
    </svg>
  )

  useEffect(() => {
    const BANNER_HEIGHT = 40

    if (hidden || !hasAnnouncement) {
      document.documentElement.style.setProperty('--announcement-height', '0px')
      return
    }

    document.documentElement.style.setProperty(
      '--announcement-height',
      `${BANNER_HEIGHT}px`,
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
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3 }}
          className="flex items-center justify-center h-10 px-4 py-2.5 gap-2 fixed top-0 left-0 right-0 bg-(--banner) text-(--banner-foreground) z-50"
          style={
            {
              '--banner': announcement.colors.background,
              '--banner-foreground': announcement.colors.foreground,
            } as React.CSSProperties
          }
        >
          <div className="flex min-w-0 items-center gap-2">
            <div className="flex shrink-0">
              <div className="inline-flex items-center justify-center transition duration-200 ease-out h-4 gap-1.5 uppercase has-[&gt;.dot]:gap-2 rounded-[5px] px-1.25 text-[9px] leading-[11px] font-semibold tracking-[0.18px] bg-(--banner-foreground)/20 text-(--banner-foreground) pointer-events-none select-none">
                {announcement.type}
              </div>
            </div>

            <div className="text-sm truncate">{announcement.message}</div>
          </div>

          <div className="flex md:absolute md:top-1/2 md:right-5 md:-translate-y-1/2">
            <Button
              size="icon"
              variant="ghost"
              onClick={handleHide}
              className="hover:bg-(--banner-foreground)/20! hover:text-(--banner-foreground)! max-w-8 max-h-8"
            >
              <Icon name="X" />
            </Button>
          </div>

          <div className="hidden lg:block absolute bottom-0 translate-y-full h-3 w-full pointer-events-none">
            <RoundedCornerTriangle className="absolute left-0" />
            <RoundedCornerTriangle className="absolute right-0 -scale-x-100" />
          </div>
        </motion.div>
      </AnimatePresence>
    </>
  )
}
