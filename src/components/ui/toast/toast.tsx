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
  '--normal-bg': 'hsl(var(--card))',
  '--normal-text': 'hsl(var(--card-foreground))',
  '--normal-border': 'hsl(var(--border))',
  '--normal-bg-hover':
    'color-mix(in oklab, hsl(var(--card-foreground)) 6%, hsl(var(--card)))',
  '--normal-border-hover': 'hsl(var(--border))',
  '--success-bg': 'color-mix(in oklab, hsl(var(--success)) 12%, hsl(var(--card)))',
  '--success-border': 'color-mix(in oklab, hsl(var(--success)) 42%, hsl(var(--border)))',
  '--success-text': 'hsl(var(--success))',
  '--info-bg': 'color-mix(in oklab, hsl(var(--info)) 12%, hsl(var(--card)))',
  '--info-border': 'color-mix(in oklab, hsl(var(--info)) 42%, hsl(var(--border)))',
  '--info-text': 'hsl(var(--info))',
  '--warning-bg': 'color-mix(in oklab, hsl(var(--warning)) 14%, hsl(var(--card)))',
  '--warning-border': 'color-mix(in oklab, hsl(var(--warning)) 42%, hsl(var(--border)))',
  '--warning-text': 'hsl(var(--warning))',
  '--error-bg': 'color-mix(in oklab, hsl(var(--destructive)) 12%, hsl(var(--card)))',
  '--error-border':
    'color-mix(in oklab, hsl(var(--destructive)) 45%, hsl(var(--border)))',
  '--error-text': 'hsl(var(--destructive))',
} as React.CSSProperties

const Toaster = ({
  theme: themeProp,
  toastOptions,
  style,
  className,
  ...props
}: AppToasterProps) => {
  const { theme: themeFromHook } = useTheme()
  const toastTheme = themeIdToToastTheme(themeProp ?? themeFromHook ?? 'system')

  return (
    <Sonner
      theme={toastTheme}
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
