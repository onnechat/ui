export interface Country {
  code: string
  name: string
  flag: string
  dialCode: string
}

export const usePhoneInput = (_props: Record<string, unknown>) => ({
  formattedPhoneNumber: '',
  selectedCountry: { code: 'BR', name: 'Brazil', flag: '🇧🇷', dialCode: '+55' },
  countries: [] as Country[],
  handleCountryChange: (_code: string) => {},
  handlePhoneNumberChange: (_e: React.ChangeEvent<HTMLInputElement>) => {},
  placeholder: '',
})

export function getCountryName(countryCode: string, _locale: string): string {
  const map: Record<string, string> = { BR: 'Brasil', US: 'United States' }
  return map[countryCode] || countryCode
}
