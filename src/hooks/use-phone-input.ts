import { useEffect, useMemo, useRef, useState } from 'react';
import {
  getCountries,
  getCountryCallingCode,
  parsePhoneNumberFromString,
} from 'libphonenumber-js';

import {
  applyPhoneMask,
  getDefaultMask,
  getDisplayMask,
  phoneMasks,
} from '@/components/ui/input-phone/masks';

export interface Country {
  code: string;
  name: string;
  flag: string;
  dialCode: string;
}

export interface UsePhoneInputOptions {
  /** Controlled value in international format (e.g. `+5511999999999`). */
  value?: string;
  /** Called on every change with the phone in international format. */
  onChange?: (value: string) => void;
  /** Called when the user picks another country. */
  onCountryChange?: (country: Country) => void;
  /** Locale used to display country names. Defaults to `'en'`. */
  locale?: string;
}

function getCountryName(code: string, locale: string): string {
  try {
    const names = new Intl.DisplayNames([locale], { type: 'region' });
    return names.of(code) ?? code;
  } catch {
    return code;
  }
}

const SUPPORTED_FLAGS = new Set([
  'AF',
  'AL',
  'DZ',
  'AD',
  'AO',
  'AG',
  'AR',
  'AM',
  'AU',
  'AT',
  'AZ',
  'BS',
  'BH',
  'BD',
  'BB',
  'BY',
  'BE',
  'BZ',
  'BJ',
  'BT',
  'BO',
  'BA',
  'BW',
  'BR',
  'BN',
  'BG',
  'BF',
  'BI',
  'KH',
  'CM',
  'CA',
  'CV',
  'CF',
  'TD',
  'CL',
  'CN',
  'CO',
  'KM',
  'CG',
  'CD',
  'CR',
  'CI',
  'HR',
  'CU',
  'CY',
  'CZ',
  'DK',
  'DJ',
  'DM',
  'DO',
  'TL',
  'EC',
  'EG',
  'SV',
  'GQ',
  'ER',
  'EE',
  'SZ',
  'ET',
  'FJ',
  'FI',
  'FR',
  'GA',
  'GM',
  'GE',
  'DE',
  'GH',
  'GR',
  'GD',
  'GT',
  'GN',
  'GW',
  'GY',
  'HT',
  'HN',
  'HK',
  'HU',
  'IS',
  'IN',
  'ID',
  'IR',
  'IQ',
  'IE',
  'IL',
  'IT',
  'JM',
  'JP',
  'JO',
  'KZ',
  'KE',
  'KI',
  'KP',
  'KR',
  'KW',
  'KG',
  'LA',
  'LV',
  'LB',
  'LS',
  'LR',
  'LY',
  'LI',
  'LT',
  'LU',
  'MO',
  'MG',
  'MW',
  'MY',
  'MV',
  'ML',
  'MT',
  'MH',
  'MR',
  'MU',
  'MX',
  'FM',
  'MD',
  'MC',
  'MN',
  'ME',
  'MA',
  'MZ',
  'MM',
  'NA',
  'NR',
  'NP',
  'NL',
  'NZ',
  'NI',
  'NE',
  'NG',
  'NO',
  'OM',
  'PK',
  'PW',
  'PS',
  'PA',
  'PG',
  'PY',
  'PE',
  'PH',
  'PL',
  'PT',
  'QA',
  'RO',
  'RU',
  'RW',
  'KN',
  'LC',
  'VC',
  'WS',
  'SM',
  'ST',
  'SA',
  'SN',
  'RS',
  'SC',
  'SL',
  'SG',
  'SK',
  'SI',
  'SB',
  'SO',
  'ZA',
  'SS',
  'ES',
  'LK',
  'SD',
  'SR',
  'SE',
  'CH',
  'SY',
  'TW',
  'TJ',
  'TZ',
  'TH',
  'TG',
  'TO',
  'TT',
  'TN',
  'TR',
  'TM',
  'TV',
  'UG',
  'UA',
  'AE',
  'GB',
  'US',
  'UY',
  'UZ',
  'VU',
  'VA',
  'VE',
  'VN',
  'YE',
  'ZM',
  'ZW',
]);

const baseCountries: Country[] = getCountries()
  .filter(code => SUPPORTED_FLAGS.has(code))
  .map(code => ({
    code,
    name: getCountryName(code, 'en'),
    flag: code,
    dialCode: `+${getCountryCallingCode(code)}`,
  }));

const parseValue = (input: string): { country?: string; national: string } => {
  if (!input) return { national: '' };

  const parsed = parsePhoneNumberFromString(input);
  if (parsed?.country) {
    return { country: parsed.country, national: parsed.nationalNumber ?? '' };
  }

  return { national: input.replace(/\D/g, '') };
};

export const usePhoneInput = (options: UsePhoneInputOptions) => {
  const { value, onChange, onCountryChange, locale } = options;

  const [phone, setPhone] = useState(() => parseValue(value ?? '').national);
  const [countryCode, setCountryCode] = useState<string>(
    () => parseValue(value ?? '').country ?? 'BR',
  );

  const countries = useMemo(() => {
    if (!locale || locale === 'en') return baseCountries;
    return baseCountries.map(country => ({
      ...country,
      name: getCountryName(country.code, locale),
    }));
  }, [locale]);

  const selectedCountry =
    countries.find(c => c.code === countryCode) ?? countries[0];

  const maskConfig = phoneMasks[countryCode] ?? getDefaultMask();

  const formattedPhoneNumber = applyPhoneMask(
    phone,
    getDisplayMask(countryCode, phone.length),
  );

  const toOutputValue = (digits: string, dialCode: string) =>
    digits ? `${dialCode}${digits}` : '';

  // Sync interno quando a prop controlada `value` muda. Compara com o valor
  // emitido atual para o echo do onChange pelo pai não sobrescrever a
  // digitação em andamento.
  const outputRef = useRef('');
  outputRef.current = toOutputValue(phone, selectedCountry.dialCode);

  useEffect(() => {
    if (value === undefined || value === outputRef.current) return;

    const next = parseValue(value);
    setPhone(next.national);
    if (next.country) setCountryCode(next.country);
  }, [value]);

  const handleCountryChange = (code: string) => {
    setCountryCode(code);

    const nextCountry = countries.find(c => c.code === code);
    if (nextCountry) onCountryChange?.(nextCountry);

    if (phone) {
      setPhone('');
      onChange?.('');
    }
  };

  const handlePhoneNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value
      .replace(/\D/g, '')
      .slice(0, maskConfig.maxLength);
    setPhone(raw);
    onChange?.(toOutputValue(raw, selectedCountry.dialCode));
  };

  return {
    formattedPhoneNumber,
    selectedCountry,
    countries,
    handleCountryChange,
    handlePhoneNumberChange,
    placeholder: maskConfig.placeholder,
  };
};

export { getCountryName };
