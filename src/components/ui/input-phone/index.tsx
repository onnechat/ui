'use client'

import * as React from 'react'

import { cn } from '@/lib/cn'

import { useElementSize } from '@/hooks/use-element-size'
import type { Country } from '@/hooks/use-phone-input'
import { usePhoneInput } from '@/hooks/use-phone-input'

import { Input } from '@/components/ui/input'
import { FlagIcon } from '@/components/icon/flag'
import { Select } from '@/components/ui/select'

export interface PhoneInputProps extends Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  'onChange'
> {
  value?: string
  onChange?: (value: string) => void
  onCountryChange?: (country: Country) => void
  disableCountrySelect?: boolean
  locale?: string
  align?: 'start' | 'center' | 'end'
}
const PhoneInput = React.forwardRef<HTMLInputElement, PhoneInputProps>(
  (props, ref) => {
    const {
      value,
      onChange,
      onCountryChange,
      locale,
      className,
      disabled,
      placeholder,
      disableCountrySelect = false,
      align = 'start',
      ...inputProps
    } = props

    const triggerRef = React.useRef<HTMLButtonElement>(null)
    const { width: triggerWidth } = useElementSize(triggerRef)

    const {
      formattedPhoneNumber,
      selectedCountry,
      countries,
      handleCountryChange,
      handlePhoneNumberChange,
      placeholder: dynamicPlaceholder,
    } = usePhoneInput({
      value,
      onChange,
      onCountryChange,
      locale,
    })

    return (
      <div className="flex w-full">
        <Select
          value={selectedCountry.code}
          onValueChange={handleCountryChange}
          disabled={disabled || disableCountrySelect}
        >
          <Select.Trigger
            ref={triggerRef}
            className={cn(
              'w-fit! rounded-r-none border-r-0 focus:z-10 bg-accent select-none',
              disableCountrySelect && '[&>svg]:hidden',
              className,
            )}
          >
            <Select.Value>
              <FlagIcon
                code={selectedCountry.code}
                className="size-5 rounded-sm mb-0.5 pointer-events-none select-none"
              />

              <span className="text-sm font-mono">
                {selectedCountry.dialCode}
              </span>
            </Select.Value>
          </Select.Trigger>

          <Select.Content
            align={align}
            className="min-w-max"
            style={triggerWidth > 0 ? { width: triggerWidth } : {}}
          >
            {countries.map((country) => (
              <Select.Item key={country.code} value={country.code}>
                <div className="flex items-center gap-2">
                  <FlagIcon
                    code={country.code}
                    className="size-5 rounded-sm pointer-events-none select-none"
                  />

                  <span className="text-sm font-mono text-muted-foreground">
                    {country.dialCode}
                  </span>

                  <span className="text-sm mb-0.5">{country.name}</span>
                </div>
              </Select.Item>
            ))}
          </Select.Content>
        </Select>

        <Input
          ref={ref}
          type="tel"
          value={formattedPhoneNumber}
          onChange={handlePhoneNumberChange}
          placeholder={placeholder || dynamicPlaceholder}
          className={cn('rounded-l-none focus:z-10', className)}
          disabled={disabled}
          {...inputProps}
        />
      </div>
    )
  },
)

PhoneInput.displayName = 'PhoneInput'

export { PhoneInput }
export type { Country }
