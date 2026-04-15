'use client'

import Cookies from 'js-cookie'

import React, { useTransition } from 'react'

import { useRouter } from 'next/navigation'
import { useLocale, useTranslations } from 'next-intl'

import {
  type AvailableLocales,
  getFlagByLocale,
  getLocaleLabel,
  getLocaleLabelInLocale,
  LOCALES,
} from '@/config/locales'

import { cn } from '@/lib/cn'

import { COOKIES_KEYS } from '@/constants/keys'

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

export function LanguageSwitch({
  align,
  type = 'default',
  className,
  classNames,
}: {
  type?: 'default' | 'flag'
  align?: 'start' | 'center' | 'end'
  className?: string
  classNames?: {
    trigger?: string
    content?: string
    item?: string
  }
}) {
  const t = useTranslations('language')

  const locale = useLocale() as AvailableLocales
  const router = useRouter()

  const [isPending, startTransition] = useTransition()

  const handleLocaleChange = React.useCallback(
    (newLocale: string) => {
      startTransition(() => {
        Cookies.set(COOKIES_KEYS.LOCALE, newLocale, {
          path: '/',
          sameSite: 'lax',
        })

        router.refresh()
      })
    },
    [router],
  )

  return (
    <Select
      value={locale}
      disabled={isPending}
      onValueChange={handleLocaleChange}
    >
      <SelectTrigger
        aria-label={t('switch')}
        className={cn(
          'flex items-center justify-start h-10 w-fit pr-3 text-base',
          type === 'default' && 'min-w-32',
          className,
          classNames?.trigger,
        )}
      >
        <img
          src={getFlagByLocale(locale)}
          alt={getLocaleLabel(locale)}
          className="size-4 shrink-0 rounded-sm object-cover pointer-events-none select-none"
        />

        {type === 'default' && (
          <SelectValue>
            <data className="text-sm">{getLocaleLabel(locale)}</data>
          </SelectValue>
        )}
      </SelectTrigger>

      <SelectContent
        align={align}
        className={cn(type === 'default' && 'min-w-42', classNames?.content)}
      >
        {LOCALES.map((l) => {
          const label = getLocaleLabel(l)
          const translatedLabel = getLocaleLabelInLocale(l, locale)

          return (
            <SelectItem
              key={l}
              value={l}
              className="group/language-switch-item"
            >
              <data className={cn('flex items-center gap-4', classNames?.item)}>
                <img
                  alt={label}
                  src={getFlagByLocale(l)}
                  className="size-6 lg:size-4 shrink-0 rounded-sm object-cover"
                />

                <span className="flex flex-col items-start justify-start">
                  <span className="text-sm group-hover/language-switch-item:text-foreground transition-colors">
                    {label}
                  </span>

                  {translatedLabel !== label && (
                    <span className="text-xs text-muted-foreground/50 group-hover/language-switch-item:text-muted-foreground/75 transition-colors">
                      {translatedLabel}
                    </span>
                  )}
                </span>
              </data>
            </SelectItem>
          )
        })}
      </SelectContent>
    </Select>
  )
}
