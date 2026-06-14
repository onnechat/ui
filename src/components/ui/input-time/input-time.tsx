'use client';

import * as React from 'react';

import { cn } from '@/lib/cn';

import { Icon } from '@/components/icon';
import type { FillIconName, CustomIconName } from '@/components/icon';
import { Button } from '@/components/ui/button';

import { Input } from '../input';

export type InputTimeType = 'date' | 'time' | 'datetime-local';

const INPUT_TIME_PLACEHOLDERS: Record<InputTimeType, string> = {
  date: 'YYYY-MM-DD',
  time: 'HH:MM',
  'datetime-local': 'YYYY-MM-DD HH:MM',
};

const INPUT_TIME_ICONS: Record<InputTimeType, FillIconName | CustomIconName> = {
  date: 'Calendar',
  time: 'Clock',
  'datetime-local': 'CalendarClock',
};

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

  const handleButtonClick = () => {
    inputRef.current?.showPicker?.() || inputRef.current?.focus();
  };

  return (
    <div className="flex w-full">
      <Input
        ref={inputRef}
        type={type}
        placeholder={resolvedPlaceholder}
        className={cn(
          'rounded-r-none focus:z-10 appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-inner-spin-button]:hidden [&::-webkit-outer-spin-button]:hidden',
          !hasValue && 'text-sm text-muted-foreground/50',
          className,
        )}
        containerClassName="rounded-r-none"
        onChange={(e) => {
          setHasValue(e.target.value !== '');
          props.onChange?.(e);
        }}
        {...props}
      />

      <Button
        type="button"
        variant="outline"
        onClick={handleButtonClick}
        className="rounded-l-none border-l-0 shrink-0 bg-accent h-12! w-12!"
      >
        <Icon variant="fill" name={iconName} className="size-4" />
      </Button>
    </div>
  );
}

InputTime.displayName = 'InputTime';

export { InputTime };
