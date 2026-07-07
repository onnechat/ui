'use client'

import { useTheme } from 'next-themes'

import { Toaster as Sonner, type ToasterProps } from 'sonner'

import { themeIdToToastTheme } from '@/config/themes'

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
  /* Same recipe as the Alert variants: text-{color} on a 5% tint, no border.
     Alerts use `bg-{color}/5` over the page; toasts float, so the 5% tint is
     pre-mixed with --background to stay opaque. */
  '--success-bg': 'color-mix(in oklab, var(--success) 5%, var(--background))',
  '--success-border': 'transparent',
  '--success-text': 'var(--success)',
  '--info-bg': 'color-mix(in oklab, var(--info) 5%, var(--background))',
  '--info-border': 'transparent',
  '--info-text': 'var(--info)',
  '--warning-bg': 'color-mix(in oklab, var(--warning) 5%, var(--background))',
  '--warning-border': 'transparent',
  '--warning-text': 'var(--warning)',
  '--error-bg': 'color-mix(in oklab, var(--destructive) 5%, var(--background))',
  '--error-border': 'transparent',
  '--error-text': 'var(--destructive)',
} as React.CSSProperties

const Toaster = ({
  theme: themeProp,
  toastOptions,
  style,
  className,
  /** Colored like the Alert variants by default; pass `false` for neutral card toasts. */
  richColors = true,
  ...props
}: AppToasterProps) => {
  const { theme: themeFromHook } = useTheme()
  const toastTheme = themeIdToToastTheme(themeProp ?? themeFromHook ?? 'system')

  return (
    <Sonner
      theme={toastTheme}
      richColors={richColors}
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
