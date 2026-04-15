'use client'

import * as React from 'react'

import * as SelectPrimitive from '@radix-ui/react-select'

import { cn } from '@/lib/cn'

import { useElementSize } from '@/hooks/use-element-size'

import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

export type TimeUnit =
  | 'seconds'
  | 'minutes'
  | 'hours'
  | 'days'
  | 'weeks'
  | 'months'
  | 'years'

export interface TimeUnitOption {
  value: TimeUnit
  toMinutes: number
}

const TIME_UNITS: TimeUnitOption[] = [
  { value: 'seconds', toMinutes: 1 / 60 },
  { value: 'minutes', toMinutes: 1 },
  { value: 'hours', toMinutes: 60 },
  { value: 'days', toMinutes: 60 * 24 },
  { value: 'weeks', toMinutes: 60 * 24 * 7 },
  { value: 'months', toMinutes: 60 * 24 * 30 },
  { value: 'years', toMinutes: 60 * 24 * 365 },
]

export interface TimeUnitInputProps extends Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  'onChange'
> {
  value?: number
  defaultUnit?: TimeUnit
  disableUnitSelect?: boolean
  allowedUnits?: TimeUnit[]
  onChange?: (valueInMinutes: number | undefined) => void
  onUnitChange?: (unit: TimeUnit) => void
  align?: SelectPrimitive.SelectContentProps['align']
  containerClassName?: string
}

const TimeUnitInput = React.forwardRef<HTMLInputElement, TimeUnitInputProps>(
  (props, ref) => {
    const {
      value,
      onChange,
      onUnitChange,
      className,
      containerClassName,
      disabled,
      disableUnitSelect = false,
      allowedUnits,
      placeholder,
      defaultUnit = 'minutes',
      align = 'start',
      ...inputProps
    } = props

    const triggerRef = React.useRef<HTMLButtonElement>(null)
    const { width: triggerWidth } = useElementSize(triggerRef)

    const [userPickedUnit, setUserPickedUnit] = React.useState(false)
    const [selectedUnit, setSelectedUnit] =
      React.useState<TimeUnit>(defaultUnit)

    const [inputValue, setInputValue] = React.useState<string>('')

    const availableUnits = React.useMemo(() => {
      if (!allowedUnits || allowedUnits.length === 0) {
        return TIME_UNITS
      }

      return TIME_UNITS.filter((unit) => allowedUnits.includes(unit.value))
    }, [allowedUnits])

    const selectedUnitOption = React.useMemo(
      () =>
        availableUnits.find((u) => u.value === selectedUnit) ??
        availableUnits[0],
      [selectedUnit, availableUnits],
    )

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const rawValue = e.target.value.replace(/[^0-9.,]/g, '').replace(',', '.')
      setInputValue(rawValue)

      if (rawValue === '' || rawValue === '.') {
        onChange?.(undefined)
        return
      }

      const numericValue = parseFloat(rawValue)

      if (!isNaN(numericValue)) {
        const valueInMinutes = numericValue * selectedUnitOption.toMinutes
        onChange?.(valueInMinutes)
      }
    }

    const handleUnitChange = (newUnit: TimeUnit) => {
      setUserPickedUnit(true)
      setSelectedUnit(newUnit)

      onUnitChange?.(newUnit)

      if (value !== undefined && value !== null) {
        const newUnitOption = availableUnits.find((u) => u.value === newUnit)

        if (newUnitOption) {
          const displayValue = value / newUnitOption.toMinutes

          setInputValue(
            Number.isInteger(displayValue)
              ? displayValue.toString()
              : displayValue.toFixed(2).replace(/\.?0+$/, ''),
          )
        }
      }
    }

    React.useLayoutEffect(() => {
      if (!userPickedUnit) {
        setSelectedUnit(defaultUnit)
      }
    }, [defaultUnit, userPickedUnit])

    React.useEffect(() => {
      if (value === undefined || value === null) {
        setInputValue('')
        return
      }

      const displayValue = value / selectedUnitOption.toMinutes

      setInputValue(
        Number.isInteger(displayValue)
          ? displayValue.toString()
          : displayValue.toFixed(2).replace(/\.?0+$/, ''),
      )
    }, [value, selectedUnitOption.toMinutes])

    return (
      <div className={cn('flex w-full', containerClassName)}>
        <Input
          ref={ref}
          type="text"
          inputMode="decimal"
          disabled={disabled}
          value={inputValue}
          placeholder={placeholder}
          onChange={handleInputChange}
          className={cn('rounded-r-none focus:z-10', className)}
          containerClassName="rounded-r-none"
          {...inputProps}
        />

        <Select
          value={selectedUnit}
          onValueChange={handleUnitChange}
          disabled={disabled || disableUnitSelect}
        >
          <SelectTrigger
            ref={triggerRef}
            className={cn(
              'w-fit! rounded-l-none border-l-0 focus:z-10 bg-accent',
              disableUnitSelect && '[&_svg]:hidden',
            )}
          >
            <SelectValue>
              <span className="text-sm font-mono">
                {`${selectedUnitOption.value}.short`}
              </span>
            </SelectValue>
          </SelectTrigger>

          <SelectContent
            align={align}
            className="min-w-42"
            style={triggerWidth > 0 ? { width: triggerWidth } : {}}
          >
            {availableUnits.map((unit) => (
              <SelectItem key={unit.value} value={unit.value}>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-mono">
                    {`${unit.value}.short`}
                  </span>
                  <span className="opacity-50">{`${unit.value}.label`}</span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    )
  },
)

TimeUnitInput.displayName = 'TimeUnitInput'

export { TIME_UNITS, TimeUnitInput }
