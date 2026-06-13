'use client';

import * as React from 'react';

import { cn } from '@/lib/cn';

import { Icon, IconType } from '@/components/icon';

import { Input } from '../input';

export type InputTimeType = 'date' | 'time' | 'datetime-local';

const INPUT_TIME_PLACEHOLDERS: Record<InputTimeType, string> = {
  date: 'YYYY-MM-DD',
  time: 'HH:MM',
  'datetime-local': 'YYYY-MM-DD HH:MM',
};

const INPUT_TIME_ICONS: Record<InputTimeType, IconType> = {
  date: 'Calendar',
  time: 'Clock',
  'datetime-local': 'CalendarClock',
};

/**
 * Native HTML date/time input with a custom icon replacing the browser's picker indicator.
 *
 * Hides `::-webkit-calendar-picker-indicator` via CSS, then overlays a themed icon
 * ({@link IconType}) that opens the native picker on click. An opaque overlay
 * covers the native affordance in Firefox, which lacks the webkit pseudo-element.
 *
 * Provides English placeholder defaults (`YYYY-MM-DD`, `HH:MM`, etc.) based on
 * the `type`. Pass a custom `placeholder` prop to override.
 *
 * @example
 * <InputTime type="date" onChange={(e) => console.log(e.target.value)} />
 *
 * @example
 * <InputTime type="time" placeholder="Selecione o horário" />
 *
 * @example
 * <InputTime type="datetime-local" value="2026-01-15T14:30" />
 */
function InputTime({
  type,
  className,
  placeholder,
  ...props
}: React.ComponentProps<'input'> & {
  type: InputTimeType;
}) {
  const inputRef = React.useRef<HTMLInputElement>(null);
  const [hasValue, setHasValue] = React.useState(
    !!(props.value ?? props.defaultValue),
  );

  const iconName = INPUT_TIME_ICONS[type] ?? INPUT_TIME_ICONS.date;
  const resolvedPlaceholder =
    placeholder ?? INPUT_TIME_PLACEHOLDERS[type] ?? '';

  const handleIconClick = () => {
    inputRef.current?.showPicker?.() || inputRef.current?.focus();
  };

  return (
    <div className="relative min-w-0 w-full">
      <Input
        ref={inputRef}
        type={type}
        placeholder={resolvedPlaceholder}
        className={cn(
          'text-end pr-12 [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-inner-spin-button]:hidden [&::-webkit-outer-spin-button]:hidden [-moz-appearance:none] appearance-none',
          !hasValue && 'text-sm text-muted-foreground/50',
          className,
        )}
        onChange={(e) => {
          setHasValue(e.target.value !== '');
          props.onChange?.(e);
        }}
        {...props}
      />

      {/* Firefox has no ::-webkit-calendar-picker-indicator; it still paints the native affordance. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-y-0 right-0 z-1 w-12 rounded-r-xl bg-input"
      />

      <Icon
        name={iconName}
        onClick={handleIconClick}
        className="absolute right-4 top-1/2 z-2 size-4 -translate-y-1/2 text-muted-foreground cursor-pointer hover:text-foreground transition-colors"
      />
    </div>
  );
}

InputTime.displayName = 'InputTime';

export { InputTime };
