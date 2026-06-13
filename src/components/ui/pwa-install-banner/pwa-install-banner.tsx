'use client'

import { useCallback, useEffect, useRef, useState } from 'react'

import { AnimatePresence, motion } from 'motion/react'

import { ANIMATION } from '@/constants/animations'
import { STORAGE_KEYS } from '@/constants/keys'

import { Card } from '@/components/ui/card'
import { Icon } from '@/components/icon'

import { Button } from '@/components/internal/button'

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

export const PwaInstallBanner = () => {

  const deferredPrompt = useRef<BeforeInstallPromptEvent | null>(null)
  const isDismissedRef = useRef(false)

  const [isVisible, setIsVisible] = useState(false)

  const handleInstall = useCallback(async () => {
    if (!deferredPrompt.current) return

    await deferredPrompt.current.prompt()
    const { outcome } = await deferredPrompt.current.userChoice

    if (outcome === 'accepted') {
      setIsVisible(false)
    }

    deferredPrompt.current = null
  }, [])

  const handleDismiss = useCallback(() => {
    localStorage.setItem(
      STORAGE_KEYS.PWA_INSTALL_DISMISSED,
      new Date().toISOString(),
    )

    isDismissedRef.current = true
    setIsVisible(false)
  }, [])

  useEffect(() => {
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches
    if (isStandalone) return

    const dismissed = localStorage.getItem(STORAGE_KEYS.PWA_INSTALL_DISMISSED)

    if (dismissed) {
      const dismissedAt = new Date(dismissed)
      const now = new Date()

      const daysSince =
        (now.getTime() - dismissedAt.getTime()) / (1000 * 60 * 60 * 24)

      if (daysSince < 30) return
    }

    const handler = (e: Event) => {
      e.preventDefault()
      deferredPrompt.current = e as BeforeInstallPromptEvent

      if (isDismissedRef.current) return

      setIsVisible(true)
    }

    window.addEventListener('beforeinstallprompt', handler)

    return () => window.removeEventListener('beforeinstallprompt', handler)
  }, [])

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ duration: ANIMATION.DURATION_FLOAT, ease: 'easeInOut' }}
          className="fixed lg:absolute bottom-0 left-0 right-0 z-50 bg-linear-to-b from-transparent to-background p-4"
        >
          <Card className="w-full max-w-5xl mx-auto">
            <Card.Content className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex flex-1 flex-col gap-2">
                <div className="flex items-center gap-2">
                  <Icon name="Download" className="size-5 text-primary" />
                  <h3>{'title'}</h3>
                </div>

                <p className="text-sm text-muted-foreground">
                  {'description'}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2 max-sm:w-full">
                <Button
                  onClick={handleDismiss}
                  className="rounded-2xl max-sm:px-5 sm:px-4 py-2.5 h-fit text-sm flex-1 sm:w-fit"
                >
                  {'dismiss'}
                </Button>

                <Button
                  variant="primary"
                  onClick={handleInstall}
                  className="rounded-2xl max-sm:px-5 sm:px-4 py-2.5 h-fit text-sm flex-1 sm:w-fit"
                >
                  {'install'}
                </Button>
              </div>
            </Card.Content>
          </Card>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
