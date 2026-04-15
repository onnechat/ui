'use client'

import { createPortal } from 'react-dom'

import { useIsClient } from '@/hooks/use-is-client'

export const HeaderAction = ({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) => {
  const mounted = useIsClient()

  if (!mounted) return null

  const desktopTarget = document.getElementById('header-action-portal')
  const mobileTarget = document.getElementById('header-action-portal-mobile')

  if (className) {
    desktopTarget?.classList.add(...className.split(' ').filter(Boolean))
    mobileTarget?.classList.add(...className.split(' ').filter(Boolean))
  }

  return (
    <>
      {desktopTarget && createPortal(children, desktopTarget)}
      {mobileTarget && createPortal(children, mobileTarget)}
    </>
  )
}
