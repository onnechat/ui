'use client';

import * as React from 'react';

import { cn } from '@/lib/cn';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../select';

interface TimePickerProps extends React.HTMLAttributes<HTMLDivElement> {
  /** The currently selected date. When `undefined`, the picker starts with empty selects. */
  date: Date | undefined;
  /** Callback invoked with a new `Date` whenever the hour or minute changes. Only the respective unit is mutated; seconds/millis are preserved. */
  setDate: (date: Date | undefined) => void;
  /** When `true`, both hour and minute selects are disabled. */
  disabled?: boolean;
}

/**
 * Controlled hour:minute picker composed of two {@link Select} dropdowns.
 *
 * Displays a single-row selector with hours (00–23) on the left,
 * a colon separator, and minutes (00–59) on the right.
 *
 * If {@link TimePickerProps.date} is `undefined`, both selects start empty.
 * When the user picks a value, a new `Date` is created — or the existing one is
 * mutated — and passed to {@link TimePickerProps.setDate}.
 */
const TimePicker = React.forwardRef<HTMLDivElement, TimePickerProps>(
  ({ date, setDate, disabled, className, ...props }, ref) => {
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
          'flex h-12 w-full items-center justify-between rounded-lg bg-input text-base ring-offset-background focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 md:text-sm min-w-24 px-0.5',
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
          <SelectTrigger
            removeIcon
            className="h-auto w-fit border-none bg-transparent focus:ring-0 p-3 rounded-lg"
          >
            <SelectValue placeholder='Hour' />
          </SelectTrigger>

          <SelectContent>
            {hours.map(hour => (
              <SelectItem key={hour} value={hour}>
                {hour}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <span className="w-full text-center text-muted-foreground">:</span>

        <Select
          onValueChange={handleMinuteChange}
          value={selectedMinute}
          disabled={disabled}
        >
          <SelectTrigger
            removeIcon
            className="h-auto w-fit border-none bg-transparent focus:ring-0 p-3 rounded-lg"
          >
            <SelectValue placeholder='Minute' />
          </SelectTrigger>

          <SelectContent>
            {minutes.map(minute => (
              <SelectItem key={minute} value={minute}>
                {minute}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    );
  },
);

TimePicker.displayName = 'TimePicker';

export { TimePicker };
