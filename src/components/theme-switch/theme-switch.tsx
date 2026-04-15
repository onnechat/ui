'use client'

import { useTranslations } from 'next-intl'
import { useTheme } from 'next-themes'

import { LISTABLE_THEMES } from '@/config/themes'

import { cn } from '@/lib/cn'

import { useIsClient } from '@/hooks/use-is-client'

import { Icon } from '@/components/icon'

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

export function ThemeSwitch({
  align,
  type = 'default',
  className,
  classNames,
}: {
  align?: 'start' | 'center' | 'end'
  type?: 'icon' | 'default'
  className?: string
  classNames?: {
    trigger?: string
    content?: string
    item?: string
  }
}) {
  const t = useTranslations('logged.profile')

  const { theme, setTheme } = useTheme()
  const mounted = useIsClient()

  if (!mounted) return null

  return (
    <Select value={theme} onValueChange={setTheme}>
      <SelectTrigger
        aria-label={t('preferences.theme')}
        className={cn(
          'flex items-center justify-start h-10 w-fit pr-3 text-base',
          type === 'default' && 'min-w-32',
          className,
          classNames?.trigger,
        )}
      >
        <div className="flex items-center gap-2">
          <Icon
            name={
              LISTABLE_THEMES.find((t) => t.id === theme)?.icon ?? 'Monitor'
            }
            className="size-4 shrink-0"
          />

          {type === 'default' && (
            <SelectValue>
              <span className="text-sm">
                {t(
                  LISTABLE_THEMES.find((t) => t.id === theme)?.labelKey ??
                    'preferences.themeKeys.system',
                )}
              </span>
            </SelectValue>
          )}
        </div>
      </SelectTrigger>

      <SelectContent
        align={align}
        className={cn(type === 'default' && 'min-w-42', classNames?.content)}
      >
        {LISTABLE_THEMES.map((themeConfig) => (
          <SelectItem key={themeConfig.id} value={themeConfig.id}>
            <div className={cn('flex items-center gap-2', classNames?.item)}>
              <Icon name={themeConfig.icon} className="size-4 shrink-0" />
              <span className="text-sm">{t(themeConfig.labelKey)}</span>
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
