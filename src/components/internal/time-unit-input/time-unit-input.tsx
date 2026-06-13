'use client'

import * as React from 'react'

import * as SelectPrimitive from '@radix-ui/react-select'

import { cn } from '@/lib/cn'

import { useElementSize } from '@/hooks/use-element-size'

import { Input } from '@/components/internal/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/internal/select'

export type TimeUnit =
  | 'seconds'
  | 'minutes'
  | 'hours'
  | 'days'
  | 'weeks'
  | 'months'
  | 'years'

export interface TimeUnitOption {
  /** Unit identifier used in the Select value. */
  value: TimeUnit
  /** Number of minutes in one unit of this type. */
  toMinutes: number
}

/** All supported time units with their minute-conversion factors. Months are 30 days, years are 365 days. */
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
  /** Current value in **minutes**. Drives the input display via conversion. */
  value?: number
  /** Unit selected by default when no user interaction has occurred. */
  defaultUnit?: TimeUnit
  /** When `true`, the unit Select is disabled — only the numeric input is editable. */
  disableUnitSelect?: boolean
  /** Restrict which units appear in the dropdown. Empty array = all units. */
  allowedUnits?: TimeUnit[]
  /** Called with the total value in **minutes** (or `undefined` when the input is empty/invalid). */
  onChange?: (valueInMinutes: number | undefined) => void
  /** Called whenever the user picks a different unit. */
  onUnitChange?: (unit: TimeUnit) => void
  /** Alignment of the unit dropdown relative to the trigger. */
  align?: SelectPrimitive.SelectContentProps['align']
  /** Extra classes for the outermost wrapper. */
  containerClassName?: string
}

/**
 * Numeric input paired with a time-unit Select.
 *
 * Accepts and emits values in **minutes**, converting the displayed number
 * based on the selected unit (seconds, minutes, hours, days, weeks, months, years).
 *
 * On the left, an {@link Input} for the numeric quantity (validated to numbers only).
 * On the right, a {@link Select} for the time unit, showing a short abbreviation.
 *
 * When the user picks a different unit, the displayed value is re-computed
 * so the underlying minute value stays constant — only the representation changes.
 *
 * @example
 * // Basic usage: pick a duration in minutes
 * <TimeUnitInput
 *   value={5}
 *   onChange={(minutes) => console.log(minutes)}
 * />
 *
 * @example
 * // Restrict to hours and days only
 * <TimeUnitInput
 *   allowedUnits={['hours', 'days']}
 *   defaultUnit="hours"
 * />
 */
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

    /** Resolves the selected unit to its {@link TimeUnitOption}, falling back to the first available. */
    const selectedUnitOption = React.useMemo(
      () =>
        availableUnits.find((u) => u.value === selectedUnit) ??
        availableUnits[0],
      [selectedUnit, availableUnits],
    )

    /**
     * Sanitizes the raw input (only digits, dots, commas → dot),
     * then converts to minutes via the currently selected unit
     * and calls {@link TimeUnitInputProps.onChange}.
     */
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

    /**
     * Switches the selected unit, marks it as user-picked (to ignore future
     * `defaultUnit` changes), and re-computes the displayed value from the
     * current minute value so the actual amount stays the same.
     */
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

    /** Syncs the selected unit to `defaultUnit` as long as the user hasn't manually picked one. */
    React.useLayoutEffect(() => {
      if (!userPickedUnit) {
        setSelectedUnit(defaultUnit)
      }
    }, [defaultUnit, userPickedUnit])

    /** Converts the controlled `value` (in minutes) back to a display string using the current unit. */
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
