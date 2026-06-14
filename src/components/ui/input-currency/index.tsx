'use client'

import * as React from 'react'

import * as SelectPrimitive from '@radix-ui/react-select'

import { cn } from '@/lib/cn'

import type { Currency } from '@/hooks/use-currency-input'
import { useCurrencyInput } from '@/hooks/use-currency-input'
import { useElementSize } from '@/hooks/use-element-size'

import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

export interface CurrencyInputProps extends Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  'onChange'
> {
  value?: number
  locale?: string
  allowZero?: boolean
  defaultCurrency?: string
  disableCurrencySelect?: boolean
  onChange?: (value: number) => void
  onCurrencyChange?: (currency: Currency) => void
  align?: SelectPrimitive.SelectContentProps['align']
}

const CurrencyInput = React.forwardRef<HTMLInputElement, CurrencyInputProps>(
  (props, ref) => {
    const {
      value,
      onChange,
      onCurrencyChange,
      locale,
      className,
      disabled,
      disableCurrencySelect = false,
      placeholder,
      defaultCurrency,
      allowZero = true,
      align = 'start',
      ...inputProps
    } = props

    const triggerRef = React.useRef<HTMLButtonElement>(null)
    const { width: triggerWidth } = useElementSize(triggerRef)

    const {
      displayValue,
      selectedCurrency,
      currencies,
      handleCurrencyChange,
      handleAmountChange,
      handleFocus,
      handleBlur,
    } = useCurrencyInput({
      value,
      onChange,
      onCurrencyChange,
      locale,
      defaultCurrency,
      allowZero,
    })

    return (
      <div className="flex w-full">
        <Select
          value={selectedCurrency.code}
          onValueChange={handleCurrencyChange}
          disabled={disabled || disableCurrencySelect}
        >
          <SelectTrigger
            ref={triggerRef}
            className={cn(
              'w-fit! rounded-r-none border-r-0 focus:z-10 bg-accent',
              disableCurrencySelect && '[&>svg]:hidden',
              className,
            )}
          >
            <SelectValue>
              <span className="text-sm font-mono">
                {selectedCurrency.symbol}
              </span>
            </SelectValue>
          </SelectTrigger>

          <SelectContent
            align={align}
            className="min-w-32"
            style={triggerWidth > 0 ? { width: triggerWidth } : {}}
          >
            {currencies.map((currency) => (
              <SelectItem key={currency.code} value={currency.code}>
                <span className="text-sm font-mono text-muted-foreground">
                  {currency.symbol}
                </span>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Input
          ref={ref}
          type="text"
          inputMode="decimal"
          onBlur={handleBlur}
          disabled={disabled}
          value={displayValue}
          onFocus={handleFocus}
          placeholder={placeholder}
          onChange={handleAmountChange}
          className={cn('rounded-l-none focus:z-10', className)}
          containerClassName="rounded-l-none"
          {...inputProps}
        />
      </div>
    )
  },
)

CurrencyInput.displayName = 'CurrencyInput'

export { CurrencyInput }
export type { Currency }
