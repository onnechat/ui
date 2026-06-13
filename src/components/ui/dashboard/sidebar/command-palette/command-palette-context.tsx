'use client'

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'

type SidebarCommandPaletteContextValue = {
  /** Opens the command palette. */
  openCommandPalette: () => void
  /** Closes the command palette. */
  closeCommandPalette: () => void
  /** Toggles the command palette (same as Ctrl/⌘ + K). */
  toggleCommandPalette: () => void
  /** Controlled open state for the dialog. */
  isOpen: boolean
  setOpen: (open: boolean) => void
}

const SidebarCommandPaletteContext =
  createContext<SidebarCommandPaletteContextValue | null>(null)

export function SidebarCommandPaletteProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const [isOpen, setOpen] = useState(false)

  const openCommandPalette = useCallback(() => setOpen(true), [])
  const closeCommandPalette = useCallback(() => setOpen(false), [])
  const toggleCommandPalette = useCallback(
    () => setOpen((previous) => !previous),
    [],
  )

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        toggleCommandPalette()
      }
    }

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [toggleCommandPalette])

  const value = useMemo(
    () => ({
      openCommandPalette,
      closeCommandPalette,
      toggleCommandPalette,
      isOpen,
      setOpen,
    }),
    [openCommandPalette, closeCommandPalette, toggleCommandPalette, isOpen],
  )

  return (
    <SidebarCommandPaletteContext.Provider value={value}>
      {children}
    </SidebarCommandPaletteContext.Provider>
  )
}

export function useSidebarCommandPalette() {
  const context = useContext(SidebarCommandPaletteContext)

  if (!context) {
    throw new Error(
      'useSidebarCommandPalette must be used within SidebarCommandPaletteProvider',
    )
  }

  return context
}
