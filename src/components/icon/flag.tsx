import type { IconProps } from 'nucleo-flags'
import * as nucleoFlags from 'nucleo-flags'


import { cn } from '@/lib/cn'

import { buildFlagRegistry } from './flag-registry'

const FLAGS = buildFlagRegistry(nucleoFlags as Record<string, unknown>)

export type FlagCountryCode = keyof typeof FLAGS

export function toFlagCountryCode(
  countryCode: string | null | undefined,
): FlagCountryCode | null {
  const normalized = countryCode?.toUpperCase()

  return normalized && normalized in FLAGS
    ? (normalized as FlagCountryCode)
    : null
}

export function getFlagIcon(countryCode: string | null | undefined) {
  const flag = toFlagCountryCode(countryCode)
  return flag ? FLAGS[flag] : null
}

export type FlagIconProps = Omit<IconProps, 'children'> & {
  code: string | null | undefined
}

export function FlagIcon({ code, className, ...props }: FlagIconProps) {
  const Icon = getFlagIcon(code)
  if (!Icon) return null

  return (
    <Icon
      aria-hidden={props.title ? undefined : true}
      focusable="false"
      className={cn('shrink-0 select-none', className)}
      {...props}
    />
  )
}
