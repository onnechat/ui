import {
  type CountryCode,
  parsePhoneNumberFromString,
  type PhoneNumber,
} from 'libphonenumber-js'


import {
  type AvailableLocales,
  DEFAULT_LOCALE_CONFIG,
} from '@/config/locales'

import { cn } from '@/lib/cn'

import { getCountryName } from '@/hooks/use-phone-input'

import { FlagIcon } from '@/components/icon/flag'
import { Cell } from '@/components/ui/text/cell'

import { countryDialCodes } from '@/components/ui/input-phone/dial-codes'
import {
  applyPhoneMask,
  getDisplayMask,
  removePhoneMask,
} from '@/components/ui/input-phone/masks'

const getPhoneDigitsForCountry = (
  parsed: PhoneNumber,
  cleanPhone: string,
  countryCode: string,
): string => {
  const dial = countryDialCodes[countryCode]

  if (dial !== undefined) {
    const dialDigits = removePhoneMask(dial)

    if (dialDigits && cleanPhone.startsWith(dialDigits)) {
      return cleanPhone.substring(dialDigits.length)
    }
  }

  return removePhoneMask(parsed.nationalNumber)
}

const resolveCountryAndDigits = (
  phone: string | null | undefined,
): { countryCode: string; phoneDigits: string } => {
  const safePhone = typeof phone === 'string' ? phone : ''

  const cleanPhone = removePhoneMask(safePhone)
  const defaultRegion = DEFAULT_LOCALE_CONFIG.COUNTRY_CODE as CountryCode

  const fromParsed = (
    parsed: ReturnType<typeof parsePhoneNumberFromString>,
  ): { countryCode: string; phoneDigits: string } | null => {
    if (!parsed?.country) return null
    return {
      countryCode: parsed.country,
      phoneDigits: getPhoneDigitsForCountry(parsed, cleanPhone, parsed.country),
    }
  }

  const attempts: Array<ReturnType<typeof parsePhoneNumberFromString>> = [
    parsePhoneNumberFromString(safePhone),
    cleanPhone ? parsePhoneNumberFromString(`+${cleanPhone}`) : undefined,
    parsePhoneNumberFromString(safePhone, defaultRegion),
  ]

  for (const parsed of attempts) {
    const resolved = fromParsed(parsed)
    if (resolved) return resolved
  }

  const sortedCodes = Object.entries(countryDialCodes).sort(
    ([, dialA], [, dialB]) =>
      removePhoneMask(dialB).length - removePhoneMask(dialA).length,
  )

  for (const [countryCode, dialCode] of sortedCodes) {
    const dialDigits = removePhoneMask(dialCode)

    if (
      dialDigits &&
      cleanPhone.startsWith(dialDigits) &&
      cleanPhone.length > dialDigits.length
    ) {
      return {
        countryCode,
        phoneDigits: cleanPhone.substring(dialDigits.length),
      }
    }
  }

  return {
    countryCode: DEFAULT_LOCALE_CONFIG.COUNTRY_CODE,
    phoneDigits: cleanPhone,
  }
}

export interface PhoneProps extends React.HTMLAttributes<HTMLSpanElement> {
  phone: string | null | undefined
  flag?: boolean
}

export const Phone = ({ phone, flag = true, className }: PhoneProps) => {
  const { countryCode, phoneDigits } = resolveCountryAndDigits(phone)

  const locale = "pt-BR" as AvailableLocales
  const safePhone = typeof phone === 'string' ? phone : ''

  const formattedPhone = applyPhoneMask(
    phoneDigits,
    getDisplayMask(countryCode, phoneDigits.length),
  )

  const formatted = {
    phone: formattedPhone,
    country: {
      code: countryCode,
      name: getCountryName(countryCode, locale),
    },
  }

  return (
    <Cell
      title={safePhone ? formatted.phone : undefined}
      className={cn('min-w-32', className)}
    >
      {safePhone && flag ? (
        <div className="flex items-center gap-1.5 pr-2">
          <FlagIcon code={countryCode} className="size-3.5 rounded-sm" />
          <span>{formatted.phone}</span>
        </div>
      ) : (
        formatted.phone
      )}
    </Cell>
  )
}
