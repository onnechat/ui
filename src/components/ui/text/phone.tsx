import {
  type CountryCode,
  parsePhoneNumberFromString,
  type PhoneNumber,
} from 'libphonenumber-js'


import {
  type AvailableLocales,
  DEFAULT_LOCALE_CONFIG,
  flagPath,
} from '@/config/locales'

import { cn } from '@/lib/cn'

import { getCountryName } from '@/hooks/use-phone-input'

import { Text } from '@/components/ui/text'

import { countryDialCodes } from '@/components/internal/phone-input/dial-codes'
import {
  applyPhoneMask,
  getDefaultMask,
  phoneMasks,
  removePhoneMask,
} from '@/components/internal/phone-input/masks'

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

interface PhoneProps extends React.HTMLAttributes<HTMLSpanElement> {
  phone: string | null | undefined
  flag?: boolean
}

export const Phone = ({ phone, flag = true, className }: PhoneProps) => {
  const locale = "pt-BR" as AvailableLocales
  const safePhone = typeof phone === 'string' ? phone : ''
  const { countryCode, phoneDigits } = resolveCountryAndDigits(phone)

  const maskConfig = phoneMasks[countryCode] || getDefaultMask()
  const formattedPhone = applyPhoneMask(phoneDigits, maskConfig.mask)

  const formatted = {
    phone: formattedPhone,
    country: {
      code: countryCode,
      name: getCountryName(countryCode, locale),
      flag: flagPath(countryCode),
    },
  }

  return (
    <Text.Cell
      title={safePhone ? formatted.phone : undefined}
      className={cn('min-w-32', className)}
    >
      {safePhone && flag ? (
        <div className="flex items-center gap-1.5 pr-2">
          <img
            loading="lazy"
            width={16}
            height={16}
            src={formatted.country.flag}
            alt={formatted.country.name}
            title={formatted.country.name}
            className="size-3.5 rounded-sm object-cover pointer-events-none select-none"
          />

          <span>{formatted.phone}</span>
        </div>
      ) : (
        formatted.phone
      )}
    </Text.Cell>
  )
}
