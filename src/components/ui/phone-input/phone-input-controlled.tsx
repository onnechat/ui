'use client'

import * as React from 'react'

import {
  Control,
  Controller,
  FieldValues,
  Path,
  useFormContext,
} from 'react-hook-form'

import { PhoneInput, PhoneInputProps } from '@/components/ui/phone-input/index'

interface PhoneInputControlledProps<T extends FieldValues> extends Omit<
  PhoneInputProps,
  'value' | 'onChange'
> {
  name: Path<T>
  control: Control<T>
}

const PhoneInputControlled = <T extends FieldValues>({
  name,
  control,
  ...props
}: PhoneInputControlledProps<T>) => {
  const { clearErrors } = useFormContext<T>()
  const errorClearedRef = React.useRef(false)

  const clearErrorsRef = React.useRef(clearErrors)
  clearErrorsRef.current = clearErrors

  const handleChange = React.useCallback(
    (value: string, onChange: (value: string) => void) => {
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
        <PhoneInput
          {...props}
          value={field.value as string}
          onChange={(value) => handleChange(value, field.onChange)}
        />
      )}
    />
  )
}

export { PhoneInputControlled }
