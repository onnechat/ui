'use client';

import * as React from 'react';

import { cn } from '@/lib/cn';

import type { Currency } from '@/hooks/use-currency-input';
import { useCurrencyInput } from '@/hooks/use-currency-input';
import { useElementSize } from '@/hooks/use-element-size';

import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';

export interface CurrencyInputProps
  extends Omit<
    React.InputHTMLAttributes<HTMLInputElement>,
    'onChange' | 'size'
  > {
  value?: number;
  size?: 'sm' | 'default' | 'lg';
  locale?: string;
  allowZero?: boolean;
  defaultCurrency?: string;
  disableCurrencySelect?: boolean;
  centsMode?: boolean;
  onChange?: (value: number) => void;
  onCurrencyChange?: (currency: Currency) => void;
  align?: 'start' | 'center' | 'end';
  /** Accessible name for the embedded currency select trigger. */
  currencySelectAriaLabel?: string;
}

const CurrencyInput = React.forwardRef<HTMLInputElement, CurrencyInputProps>(
  (props, ref) => {
    const {
      value,
      size,
      onChange,
      onCurrencyChange,
      locale,
      className,
      disabled,
      disableCurrencySelect = false,
      centsMode = true,
      placeholder,
      defaultCurrency,
      allowZero = true,
      align = 'start',
      currencySelectAriaLabel = 'Currency',
      ...inputProps
    } = props;

    const triggerRef = React.useRef<HTMLButtonElement>(null);
    const { width: triggerWidth } = useElementSize(triggerRef);

    const {
      displayValue,
      selectedCurrency,
      currencies,
      inputRef,
      placeholder: defaultPlaceholder,
      handleCurrencyChange,
      handleAmountChange,
      handleFocus,
      handleBlur,
    } = useCurrencyInput({
      centsMode,
      value,
      onChange,
      onCurrencyChange,
      locale,
      defaultCurrency,
      allowZero,
    });

    return (
      <div className="flex w-full">
        <Select
          value={selectedCurrency.code}
          onValueChange={handleCurrencyChange}
          disabled={disabled || disableCurrencySelect}
        >
          <Select.Trigger
            ref={triggerRef}
            size={size}
            aria-label={currencySelectAriaLabel}
            className={cn(
              'w-fit! rounded-r-none border-r-0 focus:z-10 bg-accent',
              disableCurrencySelect && '[&>svg]:hidden',
              className,
            )}
          >
            <Select.Value>
              <span className="text-sm font-mono">
                {selectedCurrency.symbol}
              </span>
            </Select.Value>
          </Select.Trigger>

          <Select.Content
            align={align}
            className="min-w-32"
            style={triggerWidth > 0 ? { width: triggerWidth } : {}}
          >
            {currencies.map(currency => (
              <Select.Item key={currency.code} value={currency.code}>
                <span className="text-sm font-mono text-muted-foreground">
                  {currency.symbol}
                </span>
              </Select.Item>
            ))}
          </Select.Content>
        </Select>

        <Input
          ref={node => {
            inputRef.current = node;
            if (typeof ref === 'function') ref(node);
            else if (ref)
              (ref as React.MutableRefObject<HTMLInputElement | null>).current =
                node;
          }}
          type="text"
          size={size}
          inputMode="decimal"
          onBlur={handleBlur}
          disabled={disabled}
          value={displayValue}
          onFocus={handleFocus}
          placeholder={placeholder ?? defaultPlaceholder}
          onChange={handleAmountChange}
          className={cn('rounded-l-none focus:z-10', className)}
          {...inputProps}
        />
      </div>
    );
  },
);

CurrencyInput.displayName = 'CurrencyInput';

export { CurrencyInput };
export type { Currency };
