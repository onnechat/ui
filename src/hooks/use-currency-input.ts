import { type ChangeEvent, useEffect, useMemo, useRef, useState } from 'react'

export type Currency = {
  code: string
  symbol: string
}

const CURRENCY_LOCALE: Record<string, string> = {
  USD: 'en-US',
  EUR: 'de-DE',
  GBP: 'en-GB',
  BRL: 'pt-BR',
  JPY: 'ja-JP',
  CNY: 'zh-CN',
  KRW: 'ko-KR',
  INR: 'en-IN',
  RUB: 'ru-RU',
  CHF: 'de-CH',
  CAD: 'en-CA',
  AUD: 'en-AU',
  MXN: 'es-MX',
  ARS: 'es-AR',
  CLP: 'es-CL',
  COP: 'es-CO',
  PEN: 'es-PE',
  UYU: 'es-UY',
}

const currencies: Currency[] = [
  { code: 'USD', symbol: '$' },
  { code: 'EUR', symbol: '€' },
  { code: 'GBP', symbol: '£' },
  { code: 'BRL', symbol: 'R$' },
  { code: 'JPY', symbol: '¥' },
  { code: 'CNY', symbol: '¥' },
  { code: 'KRW', symbol: '₩' },
  { code: 'INR', symbol: '₹' },
  { code: 'RUB', symbol: '₽' },
  { code: 'CHF', symbol: 'CHF' },
  { code: 'CAD', symbol: 'CA$' },
  { code: 'AUD', symbol: 'A$' },
  { code: 'MXN', symbol: 'MX$' },
  { code: 'ARS', symbol: 'AR$' },
  { code: 'CLP', symbol: 'CL$' },
  { code: 'COP', symbol: 'CO$' },
  { code: 'PEN', symbol: 'S/' },
  { code: 'UYU', symbol: '$U' },
]

const DIGITS_ONLY = /[^\d]/g

const formatAmount = (digits: string, currencyCode: string, centsMode: boolean): string => {
  if (!digits) return ''

  const locale = CURRENCY_LOCALE[currencyCode] ?? 'en-US'
  const decimalSep =
    locale.startsWith('pt') || locale.startsWith('de') || locale.startsWith('fr') ||
    locale.startsWith('es') || locale.startsWith('it')
      ? ','
      : '.'

  if (!centsMode) {
    const intNum = parseInt(digits, 10)
    if (isNaN(intNum)) return digits
    return `${intNum}${decimalSep}00`
  }

  const padded = digits.padStart(3, '0')
  const integerPart = padded.slice(0, -2)
  const decimalPart = padded.slice(-2)
  const intNum = parseInt(integerPart, 10)

  const formattedInt = new Intl.NumberFormat(locale, {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(intNum)

  return `${formattedInt}${decimalSep}${decimalPart}`
}

export const useCurrencyInput = (props: Record<string, unknown>) => {
  const centsMode = (props.centsMode as boolean) ?? true
  const [rawDigits, setRawDigits] = useState('')
  const [currencyCode, setCurrencyCode] = useState('BRL')
  const inputRef = useRef<HTMLInputElement | null>(null)

  const selectedCurrency =
    currencies.find((c) => c.code === currencyCode) ?? currencies[0]

  const displayValue = useMemo(
    () => formatAmount(rawDigits, currencyCode, centsMode),
    [rawDigits, currencyCode, centsMode],
  )

  useEffect(() => {
    if (!centsMode && inputRef.current) {
      const pos = rawDigits.length
      inputRef.current.setSelectionRange(pos, pos)
    }
  }, [displayValue, centsMode])

  const handleCurrencyChange = (code: string) => {
    setCurrencyCode(code)
  }

  const handleAmountChange = (e: ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value

    if (!centsMode) {
      const cleaned = inputValue.replace(/[.,]\d*$/, '').replace(DIGITS_ONLY, '')
      setRawDigits(cleaned)
      return
    }

    setRawDigits(inputValue.replace(DIGITS_ONLY, ''))
  }

  return {
    displayValue,
    selectedCurrency,
    currencies,
    inputRef,
    handleCurrencyChange,
    handleAmountChange,
    handleFocus: () => {},
    handleBlur: () => {},
  }
}
