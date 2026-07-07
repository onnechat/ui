'use client';

import * as React from 'react';

import { cn } from '@/lib/cn';

import { useElementSize } from '@/hooks/use-element-size';

import { Input } from '@/components/ui/input';
import * as SelectPrimitive from '@radix-ui/react-select';
import { Select } from '@/components/ui/select';

export type TimeUnit =
  | 'seconds'
  | 'minutes'
  | 'hours'
  | 'days'
  | 'weeks'
  | 'months'
  | 'years';

export interface TimeUnitLabel {
  /** Abbreviated label shown in the Select trigger. */
  short: string;
  /** Full label shown in the Select dropdown. */
  label: string;
}

export interface TimeUnitOption {
  /** Unit identifier used in the Select value. */
  value: TimeUnit;
  /** Number of minutes in one unit of this type. */
  toMinutes: number;
}

/**
 * All supported time units with their minute-conversion factors.
 *
 * Months are approximated as 30 days and years as 365 days.
 */
const TIME_UNITS: TimeUnitOption[] = [
  { value: 'seconds', toMinutes: 1 / 60 },
  { value: 'minutes', toMinutes: 1 },
  { value: 'hours', toMinutes: 60 },
  { value: 'days', toMinutes: 60 * 24 },
  { value: 'weeks', toMinutes: 60 * 24 * 7 },
  { value: 'months', toMinutes: 60 * 24 * 30 },
  { value: 'years', toMinutes: 60 * 24 * 365 },
];

/** English default labels for each time unit. */
const DEFAULT_UNIT_LABELS: Record<TimeUnit, TimeUnitLabel> = {
  seconds: { short: 's', label: 'Seconds' },
  minutes: { short: 'm', label: 'Minutes' },
  hours: { short: 'h', label: 'Hours' },
  days: { short: 'd', label: 'Days' },
  weeks: { short: 'w', label: 'Weeks' },
  months: { short: 'mo', label: 'Months' },
  years: { short: 'y', label: 'Years' },
};

export interface InputTimeUnitProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  /** Current value in **minutes**. Drives the input display via unit conversion. */
  value?: number;
  /** Unit selected by default when the user has not manually picked one. */
  defaultUnit?: TimeUnit;
  /** When `true`, the unit Select is disabled — only the numeric input is editable. */
  disableUnitSelect?: boolean;
  /** Restrict which units appear in the dropdown. An empty or omitted array shows all units. */
  allowedUnits?: TimeUnit[];
  /**
   * Called with the total value in **minutes**.
   * Receives `undefined` when the input is empty or invalid.
   */
  onChange?: (valueInMinutes: number | undefined) => void;
  /** Called whenever the user picks a different unit. */
  onUnitChange?: (unit: TimeUnit) => void;
  /** Alignment of the unit dropdown relative to the trigger. */
  align?: React.ComponentPropsWithoutRef<typeof SelectPrimitive.Content>['align'];
  /** Extra classes for the outermost wrapper div. */
  containerClassName?: string;
  /**
   * Override labels for specific time units. Merged with English defaults.
   * Only the units you provide will be overridden; the rest keep their defaults.
   *
   * @example
   * labels={{ hours: { short: 'hrs', label: 'Horas' } }}
   */
  labels?: Partial<Record<TimeUnit, Partial<TimeUnitLabel>>>;
}

/**
 * Numeric input paired with a time-unit Select.
 *
 * Accepts and emits values in **minutes**, converting the displayed number
 * based on the selected unit (seconds, minutes, hours, days, weeks, months, years).
 *
 * On the left, an {@link Input} for the numeric quantity (digits and decimal dots only).
 * On the right, a {@link Select} for the time unit, showing a short abbreviation
 * with English defaults (`s`, `m`, `h`, `d`, `w`, `mo`, `y`).
 *
 * When the user picks a different unit, the displayed value is re-computed
 * so the underlying minute value stays constant — only the representation changes.
 *
 * @example
 * // Basic usage: pick a duration
 * <InputTimeUnit
 *   value={5}
 *   onChange={(minutes) => console.log(minutes)}
 * />
 *
 * @example
 * // Restrict to hours and days only, with custom labels
 * <InputTimeUnit
 *   allowedUnits={['hours', 'days']}
 *   defaultUnit="hours"
 *   labels={{ hours: { short: 'hrs' }, days: { short: 'dias' } }}
 * />
 */
const InputTimeUnit = React.forwardRef<HTMLInputElement, InputTimeUnitProps>(
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
      labels,
      ...inputProps
    } = props;

    const triggerRef = React.useRef<HTMLButtonElement>(null);
    const { width: triggerWidth } = useElementSize(triggerRef);

    const [userPickedUnit, setUserPickedUnit] = React.useState(false);
    const [selectedUnit, setSelectedUnit] =
      React.useState<TimeUnit>(defaultUnit);

    const [inputValue, setInputValue] = React.useState<string>('');

    const availableUnits = React.useMemo(() => {
      if (!allowedUnits || allowedUnits.length === 0) {
        return TIME_UNITS;
      }

      return TIME_UNITS.filter((unit) => allowedUnits.includes(unit.value));
    }, [allowedUnits]);

    /** Resolved labels, merging user overrides with English defaults. */
    const resolvedLabels = React.useMemo(() => {
      const merged: Record<TimeUnit, TimeUnitLabel> = { ...DEFAULT_UNIT_LABELS };

      if (labels) {
        for (const unit of Object.keys(labels) as TimeUnit[]) {
          merged[unit] = {
            ...merged[unit],
            ...labels[unit],
          };
        }
      }

      return merged;
    }, [labels]);

    /** Resolves the selected unit to its {@link TimeUnitOption}, falling back to the first available. */
    const selectedUnitOption = React.useMemo(
      () =>
        availableUnits.find((u) => u.value === selectedUnit) ??
        availableUnits[0],
      [selectedUnit, availableUnits],
    );

    /**
     * Sanitizes the raw input (only digits, dots, and commas → dot),
     * then converts to minutes via the currently selected unit
     * and calls {@link InputTimeUnitProps.onChange}.
     */
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const rawValue = e.target.value
        .replace(/[^0-9.,]/g, '')
        .replace(',', '.');

      setInputValue(rawValue);

      if (rawValue === '' || rawValue === '.') {
        onChange?.(undefined);
        return;
      }

      const numericValue = parseFloat(rawValue);

      if (!isNaN(numericValue)) {
        const valueInMinutes = numericValue * selectedUnitOption.toMinutes;
        onChange?.(valueInMinutes);
      }
    };

    /**
     * Switches the selected unit, marks it as user-picked (to ignore future
     * `defaultUnit` changes), and re-computes the displayed value from the
     * current minute value so the actual amount stays the same.
     */
    const handleUnitChange = (newUnit: TimeUnit) => {
      setUserPickedUnit(true);
      setSelectedUnit(newUnit);

      onUnitChange?.(newUnit);

      if (value !== undefined && value !== null) {
        const newUnitOption = availableUnits.find((u) => u.value === newUnit);

        if (newUnitOption) {
          const displayValue = value / newUnitOption.toMinutes;

          setInputValue(
            Number.isInteger(displayValue)
              ? displayValue.toString()
              : displayValue.toFixed(2).replace(/\.?0+$/, ''),
          );
        }
      }
    };

    /**
     * Syncs the selected unit to `defaultUnit` as long as the user
     * hasn't manually picked one.
     */
    React.useLayoutEffect(() => {
      if (!userPickedUnit) {
        setSelectedUnit(defaultUnit);
      }
    }, [defaultUnit, userPickedUnit]);

    /**
     * Converts the controlled `value` (in minutes) back to a display string
     * using the current unit's {@link TimeUnitOption.toMinutes} factor.
     */
    React.useEffect(() => {
      if (value === undefined || value === null) {
        setInputValue('');
        return;
      }

      const displayValue = value / selectedUnitOption.toMinutes;

      setInputValue(
        Number.isInteger(displayValue)
          ? displayValue.toString()
          : displayValue.toFixed(2).replace(/\.?0+$/, ''),
      );
    }, [value, selectedUnitOption.toMinutes]);

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
          {...inputProps}
        />

        <Select
          value={selectedUnit}
          onValueChange={handleUnitChange}
          disabled={disabled || disableUnitSelect}
        >
          <Select.Trigger
            ref={triggerRef}
            className={cn(
              'w-fit! rounded-l-none border-l-0 focus:z-10 bg-accent',
              disableUnitSelect && '[&_svg]:hidden',
            )}
          >
            <Select.Value>
              <span className="text-sm font-mono">
                {resolvedLabels[selectedUnitOption.value].short}
              </span>
            </Select.Value>
          </Select.Trigger>

          <Select.Content
            align={align}
            className="min-w-42"
            style={triggerWidth > 0 ? { width: triggerWidth } : {}}
          >
            {availableUnits.map((unit) => (
              <Select.Item key={unit.value} value={unit.value}>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-mono">
                    {resolvedLabels[unit.value].short}
                  </span>
                  <span className="opacity-50">
                    {resolvedLabels[unit.value].label}
                  </span>
                </div>
              </Select.Item>
            ))}
          </Select.Content>
        </Select>
      </div>
    );
  },
);

InputTimeUnit.displayName = 'InputTimeUnit';

export { TIME_UNITS, InputTimeUnit };
