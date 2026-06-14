'use client'

import * as React from 'react'

import {
  Control,
  Controller,
  FieldValues,
  Path,
  useFormContext,
} from 'react-hook-form'

import {
  CurrencyInput,
  CurrencyInputProps,
} from '@/components/internal/currency-input/index'

interface CurrencyInputControlledProps<T extends FieldValues> extends Omit<
  CurrencyInputProps,
  'value' | 'onChange'
> {
  name: Path<T>
  control: Control<T>
}

const CurrencyInputControlled = <T extends FieldValues>({
  name,
  control,
  ...props
}: CurrencyInputControlledProps<T>) => {
  const { clearErrors } = useFormContext<T>()
  const errorClearedRef = React.useRef(false)

  const clearErrorsRef = React.useRef(clearErrors)
  clearErrorsRef.current = clearErrors

  const handleChange = React.useCallback(
    (value: number, onChange: (value: number) => void) => {
      if (!errorClearedRef.current) {
        errorClearedRef.current = true
        clearErrorsRef.current(name)
      }
      onChange(value)
    },
    [name],
  )

  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <CurrencyInput
          {...props}
          value={field.value as number}
          onChange={(value) => handleChange(value, field.onChange)}
        />
      )}
    />
  )
}

export { CurrencyInputControlled }
