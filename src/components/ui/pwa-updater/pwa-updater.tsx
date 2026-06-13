'use client'

import { useEffect } from 'react'

/**
 * PwaUpdater component that listens for Service Worker updates.
 * When a new Service Worker takes control (after skipWaiting activates it),
 * the page is automatically reloaded to ensure the user sees the latest version.
 */
export function PwaUpdater() {
  useEffect(() => {
    if (
      typeof window !== 'undefined' &&
      'serviceWorker' in navigator &&
      window.location.hostname !== 'localhost'
    ) {
      // Handle the case where a new Service Worker has taken control.
      const handleControllerChange = () => {
        window.location.reload()
      }

      // Proactively check for updates when the page becomes visible
      const handleVisibilityChange = () => {
        if (!document.hidden) {
          navigator.serviceWorker.getRegistration().then((reg) => {
            if (reg) reg.update()
          })
        }
      }

      navigator.serviceWorker.addEventListener(
        'controllerchange',
        handleControllerChange,
      )

      document.addEventListener('visibilitychange', handleVisibilityChange)

      return () => {
        navigator.serviceWorker.removeEventListener(
          'controllerchange',
          handleControllerChange,
        )

        document.removeEventListener('visibilitychange', handleVisibilityChange)
      }
    }
  }, [])

  return null
}
