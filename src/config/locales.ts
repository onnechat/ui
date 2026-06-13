export type AvailableLocale = 'pt-BR' | 'en-US'
export type AvailableLocales = AvailableLocale

export const LOCALES: AvailableLocale[] = ['pt-BR', 'en-US']

export const DEFAULT_LOCALE_CONFIG = {
  COUNTRY_CODE: 'BR',
} as const

export function flagPath(countryCode: string): string {
  return `/flags/${countryCode.toLowerCase()}.svg`
}

export function getFlagByLocale(locale: string): string {
  const map: Record<string, string> = { 'pt-BR': 'BR', 'en-US': 'US' }
  return flagPath(map[locale] || 'BR')
}

export function getLocaleLabel(locale: string): string {
  const map: Record<string, string> = { 'pt-BR': 'Português', 'en-US': 'English' }
  return map[locale] || locale
}
