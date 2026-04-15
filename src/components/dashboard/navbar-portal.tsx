'use client'

import { createPortal } from 'react-dom'

import { useIsClient } from '@/hooks/use-is-client'

export const NavbarPortal = ({
  side,
  children,
}: {
  side?: 'left' | 'right'
  children: React.ReactNode
}) => {
  const mounted = useIsClient()

  if (!mounted) return null

  const target = document.getElementById(
    side ? `navbar-${side}-portal` : 'navbar-portal',
  )

  return target && createPortal(children, target)
}
