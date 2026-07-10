import { type ChangeEvent, useEffect, useMemo, useRef, useState } from 'react';

export type Currency = {
  code: string;
  symbol: string;
};

export interface UseCurrencyInputOptions {
  /** Controlled numeric value. In `centsMode` the number represents cents. */
  value?: number;
  /** Called on every change with the numeric value typed by the user. */
  onChange?: (value: number) => void;
  /** Called when the user picks another currency. */
  onCurrencyChange?: (currency: Currency) => void;
  /** Locale used to format the amount. Defaults to the currency's locale. */
  locale?: string;
  /** ISO code of the initially selected currency. Defaults to `'BRL'`. */
  defaultCurrency?: string;
  centsMode?: boolean;
  allowZero?: boolean;
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
};

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
];

const DIGITS_ONLY = /[^\d]/g;

const getDecimalSeparator = (locale: string): string => {
  try {
    return (
      new Intl.NumberFormat(locale)
        .formatToParts(1.1)
        .find(part => part.type === 'decimal')?.value ?? '.'
    );
  } catch {
    return '.';
  }
};

const formatInteger = (value: number, locale: string): string => {
  try {
    return new Intl.NumberFormat(locale, {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  } catch {
    return String(value);
  }
};

const formatAmount = (
  digits: string,
  locale: string,
  centsMode: boolean,
): string => {
  if (!digits) return '';

  const decimalSep = getDecimalSeparator(locale);

  if (!centsMode) {
    const intNum = parseInt(digits, 10);
    if (isNaN(intNum)) return digits;
    return `${intNum}${decimalSep}00`;
  }

  const padded = digits.padStart(3, '0');
  const integerPart = padded.slice(0, -2);
  const decimalPart = padded.slice(-2);
  const intNum = parseInt(integerPart, 10);

  return `${formatInteger(intNum, locale)}${decimalSep}${decimalPart}`;
};

const valueToDigits = (value: number | undefined): string => {
  if (value == null || !Number.isFinite(value)) return '';
  const truncated = Math.max(0, Math.trunc(value));
  return truncated === 0 ? '' : String(truncated);
};

const digitsToValue = (digits: string): number => {
  if (!digits) return 0;
  const parsed = parseInt(digits, 10);
  return isNaN(parsed) ? 0 : parsed;
};

export const useCurrencyInput = (options: UseCurrencyInputOptions) => {
  const {
    value,
    onChange,
    onCurrencyChange,
    locale,
    defaultCurrency,
    centsMode = true,
    allowZero = true,
  } = options;

  const [rawDigits, setRawDigits] = useState(() => valueToDigits(value));
  const [currencyCode, setCurrencyCode] = useState(() =>
    defaultCurrency && currencies.some(c => c.code === defaultCurrency)
      ? defaultCurrency
      : 'BRL',
  );
  const inputRef = useRef<HTMLInputElement | null>(null);

  const selectedCurrency =
    currencies.find(c => c.code === currencyCode) ?? currencies[0];

  const effectiveLocale = locale ?? CURRENCY_LOCALE[currencyCode] ?? 'en-US';

  const displayValue = useMemo(
    () => formatAmount(rawDigits, effectiveLocale, centsMode),
    [rawDigits, effectiveLocale, centsMode],
  );

  const decimalSep = useMemo(
    () => getDecimalSeparator(effectiveLocale),
    [effectiveLocale],
  );

  // Sync interno quando a prop controlada `value` muda. A comparação é
  // numérica (campo vazio conta como 0) para o echo do onChange pelo pai
  // não sobrescrever a digitação em andamento.
  const rawDigitsRef = useRef(rawDigits);
  rawDigitsRef.current = rawDigits;

  useEffect(() => {
    if (value === undefined) return;
    if (
      digitsToValue(rawDigitsRef.current) ===
      digitsToValue(valueToDigits(value))
    )
      return;
    setRawDigits(valueToDigits(value));
  }, [value]);

  const handleCurrencyChange = (code: string) => {
    setCurrencyCode(code);
    const nextCurrency = currencies.find(c => c.code === code);
    if (nextCurrency) onCurrencyChange?.(nextCurrency);
  };

  const handleAmountChange = (e: ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;

    const cleaned = centsMode
      ? inputValue.replace(DIGITS_ONLY, '')
      : inputValue.replace(/[.,]\d*$/, '').replace(DIGITS_ONLY, '');

    setRawDigits(cleaned);
    onChange?.(digitsToValue(cleaned));
  };

  const handleBlur = () => {
    if (!allowZero && digitsToValue(rawDigits) === 0 && rawDigits !== '') {
      setRawDigits('');
    }
  };

  useEffect(() => {
    if (!centsMode && inputRef.current) {
      const pos = rawDigits.length;
      inputRef.current.setSelectionRange(pos, pos);
    }
  }, [displayValue, centsMode, rawDigits.length]);

  return {
    displayValue,
    selectedCurrency,
    currencies,
    inputRef,
    placeholder: `0${decimalSep}00`,
    handleCurrencyChange,
    handleAmountChange,
    handleFocus: () => {},
    handleBlur,
  };
};
