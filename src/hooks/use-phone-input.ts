import { useState } from 'react'
import {
  getCountries,
  getCountryCallingCode,
  parsePhoneNumberFromString,
} from 'libphonenumber-js'

import { applyPhoneMask, getDefaultMask, getDisplayMask, phoneMasks } from '@/components/ui/input-phone/masks'

export interface Country {
  code: string
  name: string
  flag: string
  dialCode: string
}

function getCountryName(code: string, locale: string): string {
  try {
    const names = new Intl.DisplayNames([locale], { type: 'region' })
    return names.of(code) ?? code
  } catch {
    return code
  }
}

const SUPPORTED_FLAGS = new Set([
  'AF', 'AL', 'DZ', 'AD', 'AO', 'AG', 'AR', 'AM', 'AU', 'AT', 'AZ',
  'BS', 'BH', 'BD', 'BB', 'BY', 'BE', 'BZ', 'BJ', 'BT', 'BO', 'BA',
  'BW', 'BR', 'BN', 'BG', 'BF', 'BI', 'KH', 'CM', 'CA', 'CV', 'CF',
  'TD', 'CL', 'CN', 'CO', 'KM', 'CG', 'CD', 'CR', 'CI', 'HR', 'CU',
  'CY', 'CZ', 'DK', 'DJ', 'DM', 'DO', 'TL', 'EC', 'EG', 'SV', 'GQ',
  'ER', 'EE', 'SZ', 'ET', 'FJ', 'FI', 'FR', 'GA', 'GM', 'GE', 'DE',
  'GH', 'GR', 'GD', 'GT', 'GN', 'GW', 'GY', 'HT', 'HN', 'HK', 'HU',
  'IS', 'IN', 'ID', 'IR', 'IQ', 'IE', 'IL', 'IT', 'JM', 'JP', 'JO',
  'KZ', 'KE', 'KI', 'KP', 'KR', 'KW', 'KG', 'LA', 'LV', 'LB', 'LS',
  'LR', 'LY', 'LI', 'LT', 'LU', 'MO', 'MG', 'MW', 'MY', 'MV', 'ML',
  'MT', 'MH', 'MR', 'MU', 'MX', 'FM', 'MD', 'MC', 'MN', 'ME', 'MA',
  'MZ', 'MM', 'NA', 'NR', 'NP', 'NL', 'NZ', 'NI', 'NE', 'NG', 'NO',
  'OM', 'PK', 'PW', 'PS', 'PA', 'PG', 'PY', 'PE', 'PH', 'PL', 'PT',
  'QA', 'RO', 'RU', 'RW', 'KN', 'LC', 'VC', 'WS', 'SM', 'ST', 'SA',
  'SN', 'RS', 'SC', 'SL', 'SG', 'SK', 'SI', 'SB', 'SO', 'ZA', 'SS',
  'ES', 'LK', 'SD', 'SR', 'SE', 'CH', 'SY', 'TW', 'TJ', 'TZ', 'TH',
  'TG', 'TO', 'TT', 'TN', 'TR', 'TM', 'TV', 'UG', 'UA', 'AE', 'GB',
  'US', 'UY', 'UZ', 'VU', 'VA', 'VE', 'VN', 'YE', 'ZM', 'ZW',
])

const countries: Country[] = getCountries()
  .filter((code) => SUPPORTED_FLAGS.has(code))
  .map((code) => ({
    code,
    name: getCountryName(code, 'en'),
    flag: code,
    dialCode: `+${getCountryCallingCode(code)}`,
  }))

export const usePhoneInput = (props: Record<string, unknown>) => {
  const initialValue = (props.value as string) ?? ''

  const parsed = parsePhoneNumberFromString(initialValue)
  const initialCountryCode = parsed?.country ?? 'BR'
  const initialNationalNumber = parsed?.nationalNumber ?? ''

  const [phone, setPhone] = useState(initialNationalNumber)
  const [countryCode, setCountryCode] = useState<string>(initialCountryCode)

  const selectedCountry =
    countries.find((c) => c.code === countryCode) ?? countries[0]

  const maskConfig = phoneMasks[countryCode] ?? getDefaultMask()

  const formattedPhoneNumber = applyPhoneMask(phone, getDisplayMask(countryCode, phone.length))

  const handleCountryChange = (code: string) => {
    setCountryCode(code)
    setPhone('')
  }

  const handlePhoneNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\D/g, '')
    setPhone(raw.slice(0, maskConfig.maxLength))
  }

  return {
    formattedPhoneNumber,
    selectedCountry,
    countries,
    handleCountryChange,
    handlePhoneNumberChange,
    placeholder: maskConfig.placeholder,
  }
}

export { getCountryName }
