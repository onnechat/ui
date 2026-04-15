'use client'

import Cookies from 'js-cookie'

import { useEffect, useState } from 'react'

import { AnimatePresence, motion } from 'motion/react'

import { Cookie } from 'lucide-react'

import { env } from '@/lib/env'

import { ANIMATION } from '@/constants/animations'
import { COOKIES_KEYS } from '@/constants/keys'

import { Card } from '@/components/card'

import { Button } from '@/components/ui/button'

export const CookieBanner = () => {

  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const consent = Cookies.get(COOKIES_KEYS.COOKIE_CONSENT)

    const consentDate = consent ? new Date(consent) : null
    const now = new Date()

    if (consentDate && consentDate < now) {
      setIsVisible(false)
    } else {
      const timer = setTimeout(() => setIsVisible(true), 1000)
      return () => clearTimeout(timer)
    }
  }, [])

  const handleAccept = () => {
    const acceptedAt = new Date().toISOString()
    Cookies.set(COOKIES_KEYS.COOKIE_CONSENT, acceptedAt, { expires: 365 })

    setIsVisible(false)
  }

  if (!env.node.production) return null

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ duration: ANIMATION.DURATION_FLOAT, ease: 'easeInOut' }}
          className="fixed -bottom-px left-4 right-4 z-50 mx-auto bg-linear-to-b from-transparent to-background max-lg:pb-4 lg:p-4"
        >
          <Card className="w-full max-w-5xl mx-auto">
            <Card.Content className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex flex-1 flex-col gap-2">
                <div className="flex items-center gap-2">
                  <Cookie className="size-5 text-primary" />
                  <h3 className="font-semibold">{'title'}</h3>
                </div>

                <p className="text-sm text-muted-foreground">
                  {t.rich('description', {
                    link: (chunks) => (
                      <a
                        href="/legal/cookies"
                        className="text-primary hover:underline"
                      >
                        {chunks}
                      </a>
                    ),
                  })}
                </p>
              </div>

              <Button
                onClick={handleAccept}
                className="rounded-2xl max-sm:px-5 sm:px-4 py-2.5 h-fit text-sm w-full sm:w-fit"
              >
                {'ok'}
              </Button>
            </Card.Content>
          </Card>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
