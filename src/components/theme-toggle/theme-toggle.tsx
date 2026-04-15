'use client'

import { useId } from 'react'

import { useTheme } from 'next-themes'

import { THEMES, TOGGLEABLE_THEMES } from '@/config/themes'

import { cn } from '@/lib/cn'

import { useIsClient } from '@/hooks/use-is-client'

import { Icon } from '@/components/icon'

import { Button } from '@/components/ui/button'

export function ThemeToggle({ className }: { className?: string }) {
  const id = useId()

  const { theme, setTheme } = useTheme()
  const mounted = useIsClient()

  const currentTheme = mounted
    ? (THEMES.find((t) => t.id === theme) ?? THEMES[0])
    : THEMES[0]

  const cycleTheme = () => {
    const currentIndex = TOGGLEABLE_THEMES.findIndex((t) => t.id === theme)
    const nextIndex = (currentIndex + 1) % TOGGLEABLE_THEMES.length

    setTheme(TOGGLEABLE_THEMES[nextIndex].id)
  }

  return (
    <Button
      asChild
      size="icon"
      type="button"
      variant="secondary"
      suppressHydrationWarning
      className={cn('rounded-xl', className)}
    >
      <label
        htmlFor={id}
        className="rounded peer-focus-visible:border-ring peer-focus-visible:ring-ring/50 relative inline-flex cursor-pointer items-center justify-center transition-none outline-none peer-focus-visible:ring-[3px] border border-input"
      >
        <input
          id={id}
          onChange={cycleTheme}
          type="checkbox"
          name="theme-toggle"
          aria-label={'theme.toggle'}
          className="peer sr-only"
        />

        <Icon name={currentTheme.icon} aria-hidden="true" />
      </label>
    </Button>
  )
}
