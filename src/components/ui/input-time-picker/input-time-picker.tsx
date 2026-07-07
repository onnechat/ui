'use client';

import * as React from 'react';

import { cn } from '@/lib/cn';

import { Select } from '@/components/ui/select';

export interface InputTimePickerProps
  extends React.HTMLAttributes<HTMLDivElement> {
  /** The currently selected date. When `undefined`, both selects start empty. */
  date: Date | undefined;
  /**
   * Callback invoked with a new `Date` whenever the hour or minute changes.
   * Only the respective unit is mutated; seconds and milliseconds are preserved.
   */
  setDate: (date: Date | undefined) => void;
  /** When `true`, both hour and minute Selects are disabled. */
  disabled?: boolean;
  /** Placeholder shown in the hour Select when no value is picked. Defaults to `"HH"`. */
  hourPlaceholder?: string;
  /** Placeholder shown in the minute Select when no value is picked. Defaults to `"MM"`. */
  minutePlaceholder?: string;
  /** `aria-label` for the hour Select trigger. Defaults to `"Hours"`. */
  hourAriaLabel?: string;
  /** `aria-label` for the minute Select trigger. Defaults to `"Minutes"`. */
  minuteAriaLabel?: string;
}

/**
 * Controlled hour:minute picker composed of two {@link Select} dropdowns.
 *
 * Displays a single-row selector with hours (00–23) on the left,
 * a colon separator, and minutes (00–59) on the right.
 *
 * When {@link InputTimePickerProps.date} is `undefined`, both selects start empty with
 * English placeholders (`HH` / `MM`). Picking a value creates or mutates a `Date`
 * and passes it to {@link InputTimePickerProps.setDate}.
 *
 * @example
 * const [date, setDate] = useState<Date>();
 * <InputTimePicker date={date} setDate={setDate} />
 *
 * @example
 * <InputTimePicker
 *   date={date}
 *   setDate={setDate}
 *   hourPlaceholder="Hora"
 *   minutePlaceholder="Minuto"
 *   hourAriaLabel="Horas"
 *   minuteAriaLabel="Minutos"
 * />
 */
const InputTimePicker = React.forwardRef<HTMLDivElement, InputTimePickerProps>(
  (
    {
      date,
      setDate,
      disabled,
      className,
      hourPlaceholder = 'HH',
      minutePlaceholder = 'MM',
      hourAriaLabel = 'Hours',
      minuteAriaLabel = 'Minutes',
      ...props
    },
    ref,
  ) => {
    const hours = React.useMemo(() => {
      return Array.from({ length: 24 }, (_, i) => String(i).padStart(2, '0'));
    }, []);

    const minutes = React.useMemo(() => {
      return Array.from({ length: 60 }, (_, i) => String(i).padStart(2, '0'));
    }, []);

    const handleHourChange = (hour: string) => {
      const newDate = date ? new Date(date.getTime()) : new Date();
      newDate.setHours(parseInt(hour, 10));
      setDate(newDate);
    };

    const handleMinuteChange = (minute: string) => {
      const newDate = date ? new Date(date.getTime()) : new Date();
      newDate.setMinutes(parseInt(minute, 10));
      setDate(newDate);
    };

    const selectedHour = date ? String(date.getHours()).padStart(2, '0') : '';
    const selectedMinute = date
      ? String(date.getMinutes()).padStart(2, '0')
      : '';

    return (
      <div
        ref={ref}
        className={cn(
          'flex h-12 w-full items-center justify-between rounded-lg bg-input text-base ring-offset-background focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 md:text-sm min-w-24',
          'aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive',
          className,
        )}
        {...props}
      >
        <Select
          onValueChange={handleHourChange}
          value={selectedHour}
          disabled={disabled}
        >
          <Select.Trigger
            removeIcon
            aria-label={hourAriaLabel}
            className="h-auto w-fit border-none bg-transparent focus:ring-0 p-3"
          >
            <Select.Value placeholder={hourPlaceholder} />
          </Select.Trigger>
          <Select.Content>
            {hours.map((hour) => (
              <Select.Item key={hour} value={hour}>
                {hour}
              </Select.Item>
            ))}
          </Select.Content>
        </Select>

        <span className="w-full text-center text-muted-foreground">:</span>

        <Select
          onValueChange={handleMinuteChange}
          value={selectedMinute}
          disabled={disabled}
        >
          <Select.Trigger
            removeIcon
            className="h-auto w-fit border-none bg-transparent focus:ring-0 p-3"
            aria-label={minuteAriaLabel}
          >
            <Select.Value placeholder={minutePlaceholder} />
          </Select.Trigger>
          <Select.Content>
            {minutes.map((minute) => (
              <Select.Item key={minute} value={minute}>
                {minute}
              </Select.Item>
            ))}
          </Select.Content>
        </Select>
      </div>
    );
  },
);

InputTimePicker.displayName = 'InputTimePicker';

export { InputTimePicker };
