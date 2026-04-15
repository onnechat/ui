'use client'

import { useEffect } from 'react'

import { toast } from 'sonner'

export function ServiceWorkerRegister() {

  useEffect(() => {
    if (!('serviceWorker' in navigator)) return

    navigator.serviceWorker.register('/sw.js').then((registration) => {
      const showUpdateToast = () => {
        toast('title', {
          description: 'description',
          action: {
            label: 'reload',
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
