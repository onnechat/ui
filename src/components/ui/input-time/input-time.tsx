'use client';

import * as React from 'react';

import { cn } from '@/lib/cn';

import { Icon } from '@/components/icon';
import type { FillIconName, CustomIconName } from '@/components/icon';
import { useElementSize } from '@/hooks/use-element-size';
import { Select } from '@/components/ui/select';

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

const INPUT_TIME_LABELS: Record<InputTimeType, string> = {
  date: 'Date',
  time: 'Time',
  'datetime-local': 'Date & Time',
};

export interface InputTimeProps
  extends Omit<
    React.InputHTMLAttributes<HTMLInputElement>,
    'type' | 'onChange' | 'size'
  > {
  type?: InputTimeType;
  defaultType?: InputTimeType;
  onTypeChange?: (type: InputTimeType) => void;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  align?: 'start' | 'center' | 'end';
  /** Field height. Mirrors the Button/Input scale: `sm` h-8, `default` h-10, `lg` h-12. */
  size?: 'sm' | 'default' | 'lg';
  /** Accessible name (`aria-label`) for the embedded type Select trigger. */
  typeSelectAriaLabel?: string;
}

function InputTime({
  type: typeProp,
  defaultType = 'date',
  onTypeChange,
  className,
  placeholder,
  align = 'start',
  size,
  typeSelectAriaLabel = 'Input type',
  ...props
}: InputTimeProps) {
  const inputRef = React.useRef<HTMLInputElement>(null);
  const triggerRef = React.useRef<HTMLButtonElement>(null);
  const { width: triggerWidth } = useElementSize(triggerRef);

  const [hasValue, setHasValue] = React.useState(
    !!(props.value ?? props.defaultValue),
  );

  const [internalType, setInternalType] = React.useState(defaultType);
  const type = typeProp ?? internalType;

  const iconName = INPUT_TIME_ICONS[type] ?? INPUT_TIME_ICONS.date;
  const resolvedPlaceholder =
    placeholder ?? INPUT_TIME_PLACEHOLDERS[type] ?? '';

  const handleTypeChange = (newType: string) => {
    setInternalType(newType as InputTimeType);
    onTypeChange?.(newType as InputTimeType);
  };

  const handleInputClick = () => {
    inputRef.current?.showPicker?.();
  };

  return (
    <div className="flex w-full" data-size={size ?? 'default'}>
      <Input
        ref={inputRef}
        type={type}
        size={size}
        placeholder={resolvedPlaceholder}
        onClick={handleInputClick}
        className={cn(
          'rounded-r-none focus:z-10 [-moz-appearance:textfield] [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-inner-spin-button]:hidden [&::-webkit-outer-spin-button]:hidden pr-3',
          !hasValue && 'text-sm text-muted-foreground/50',
          className,
        )}
        onChange={e => {
          setHasValue(e.target.value !== '');
          props.onChange?.(e);
        }}
        {...props}
      />

      <div className="relative shrink-0">
        <Select
          value={type}
          onValueChange={handleTypeChange}
          disabled={typeProp !== undefined}
        >
          <Select.Trigger
            ref={triggerRef}
            size={size}
            aria-label={typeSelectAriaLabel}
            className={cn(
              'w-fit! rounded-l-none border-l-0 focus:z-10 bg-accent',
              typeProp !== undefined && '[&>svg]:hidden',
            )}
          >
            <Select.Value>
              <Icon variant="fill" name={iconName} className="size-4" />
            </Select.Value>
          </Select.Trigger>

          <Select.Content
            align={align}
            className="min-w-max"
            style={triggerWidth > 0 ? { width: triggerWidth } : {}}
          >
            {(Object.keys(INPUT_TIME_ICONS) as InputTimeType[]).map(t => (
              <Select.Item key={t} value={t}>
                <div className="flex items-center gap-2">
                  <Icon
                    variant="fill"
                    name={INPUT_TIME_ICONS[t]}
                    className="size-4"
                  />
                  <span className="text-sm">{INPUT_TIME_LABELS[t]}</span>
                </div>
              </Select.Item>
            ))}
          </Select.Content>
        </Select>

        {typeProp !== undefined && (
          <div
            className="absolute inset-0 cursor-pointer"
            onClick={handleInputClick}
          />
        )}
      </div>
    </div>
  );
}

InputTime.displayName = 'InputTime';

export { InputTime };
