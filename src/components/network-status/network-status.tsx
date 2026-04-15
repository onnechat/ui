'use client'

import { useEffect, useState } from 'react'

import { AnimatePresence, motion } from 'motion/react'

import { Icon } from '@/components/icon'

export function NetworkStatus() {

  const [isOnline, setIsOnline] = useState(true)
  const [showBack, setShowBack] = useState(false)

  useEffect(() => {
    setIsOnline(navigator.onLine)

    const handleOffline = () => {
      setIsOnline(false)
      setShowBack(false)
    }

    const handleOnline = () => {
      setIsOnline(true)
      setShowBack(true)

      setTimeout(() => {
        setShowBack(false)
      }, 3000)
    }

    window.addEventListener('offline', handleOffline)
    window.addEventListener('online', handleOnline)

    return () => {
      window.removeEventListener('offline', handleOffline)
      window.removeEventListener('online', handleOnline)
    }
  }, [])

  const visible = !isOnline || showBack

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="network-status"
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
          className="fixed top-0 left-0 right-0 z-50 flex justify-center pointer-events-none"
        >
          <div
            className={
              isOnline
                ? 'flex items-center gap-2 px-4 py-2 text-xs font-medium rounded-b-xl bg-success/15 text-success border border-success/20 border-t-0 shadow-sm'
                : 'flex items-center gap-2 px-4 py-2 text-xs font-medium rounded-b-xl bg-destructive/10 text-destructive border border-destructive/20 border-t-0 shadow-sm'
            }
          >
            <Icon
              name={isOnline ? 'Wifi' : 'WifiOff'}
              className="size-3.5 shrink-0"
            />
            <span>{isOnline ? 'back' : 'offline'}</span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
