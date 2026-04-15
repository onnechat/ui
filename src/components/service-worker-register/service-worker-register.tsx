'use client'

import { useEffect } from 'react'

import { useTranslations } from 'next-intl'

import { toast } from 'sonner'

export function ServiceWorkerRegister() {
  const t = useTranslations('pwaUpdate')

  useEffect(() => {
    if (!('serviceWorker' in navigator)) return

    navigator.serviceWorker.register('/sw.js').then((registration) => {
      const showUpdateToast = () => {
        toast(t('title'), {
          description: t('description'),
          action: {
            label: t('reload'),
            onClick: () => {
              registration.waiting?.postMessage({ type: 'SKIP_WAITING' })
              window.location.reload()
            },
          },
          duration: Infinity,
        })
      }

      // Already has a waiting SW (user opened tab with old version)
      if (registration.waiting) {
        showUpdateToast()
      }

      // New SW found during the session
      registration.addEventListener('updatefound', () => {
        const newWorker = registration.installing
        if (!newWorker) return

        newWorker.addEventListener('statechange', () => {
          if (
            newWorker.state === 'installed' &&
            navigator.serviceWorker.controller
          ) {
            showUpdateToast()
          }
        })
      })
    })
  }, [t])

  return null
}
