'use client'

import { useTheme } from 'next-themes'

import { Toaster as Sonner, type ToasterProps } from 'sonner'

import { themeIdToSonnerTheme } from '@/config/themes'

import { cn } from '@/lib/cn'

type AppToasterProps = Omit<ToasterProps, 'theme'> & {
  /** App theme id (`cream`, `onix`, …) or Sonner’s own `light` / `dark` / `system` */
  theme?: ToasterProps['theme'] | string
}

const toasterCardStyle = {
  '--toast-border-width': '0px',
  '--toast-padding': '1.25rem',
  '--border-radius': '1rem',
  '--normal-bg': 'var(--card)',
  '--normal-text': 'var(--card-foreground)',
  '--normal-border': 'var(--border)',
  '--normal-bg-hover':
    'color-mix(in oklab, var(--card-foreground) 6%, var(--card))',
  '--normal-border-hover': 'var(--border)',
  '--success-bg': 'color-mix(in oklab, var(--success) 12%, var(--card))',
  '--success-border': 'color-mix(in oklab, var(--success) 42%, var(--border))',
  '--success-text': 'var(--success)',
  '--info-bg': 'color-mix(in oklab, var(--info) 12%, var(--card))',
  '--info-border': 'color-mix(in oklab, var(--info) 42%, var(--border))',
  '--info-text': 'var(--info)',
  '--warning-bg': 'color-mix(in oklab, var(--warning) 14%, var(--card))',
  '--warning-border': 'color-mix(in oklab, var(--warning) 42%, var(--border))',
  '--warning-text': 'var(--warning)',
  '--error-bg': 'color-mix(in oklab, var(--destructive) 12%, var(--card))',
  '--error-border':
    'color-mix(in oklab, var(--destructive) 45%, var(--border))',
  '--error-text': 'var(--destructive)',
} as React.CSSProperties

const Toaster = ({
  theme: themeProp,
  toastOptions,
  style,
  className,
  ...props
}: AppToasterProps) => {
  const { theme: themeFromHook } = useTheme()
  const sonnerTheme = themeIdToSonnerTheme(themeProp ?? themeFromHook)

  return (
    <Sonner
      theme={sonnerTheme}
      className={cn('toaster group', className)}
      style={{ ...toasterCardStyle, ...style }}
      toastOptions={{
        ...toastOptions,
        classNames: {
          ...toastOptions?.classNames,
          toast: cn('shadow-sm!', toastOptions?.classNames?.toast),
        },
      }}
      {...props}
    />
  )
}

export { Toaster }
