'use client'

import * as React from 'react'

import { useTranslations } from 'next-intl'

import { cn } from '@/lib/cn'

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './select'

interface TimePickerProps extends React.HTMLAttributes<HTMLDivElement> {
  date: Date | undefined
  setDate: (date: Date | undefined) => void
  disabled?: boolean
}

const TimePicker = React.forwardRef<HTMLDivElement, TimePickerProps>(
  ({ date, setDate, disabled, className, ...props }, ref) => {
    const t = useTranslations('accessibility')

    const hours = React.useMemo(() => {
      return Array.from({ length: 24 }, (_, i) => String(i).padStart(2, '0'))
    }, [])

    const minutes = React.useMemo(() => {
      return Array.from({ length: 60 }, (_, i) => String(i).padStart(2, '0'))
    }, [])

    const handleHourChange = (hour: string) => {
      const newDate = date ? new Date(date.getTime()) : new Date()
      newDate.setHours(parseInt(hour, 10))
      setDate(newDate)
    }

    const handleMinuteChange = (minute: string) => {
      const newDate = date ? new Date(date.getTime()) : new Date()
      newDate.setMinutes(parseInt(minute, 10))
      setDate(newDate)
    }

    const selectedHour = date ? String(date.getHours()).padStart(2, '0') : ''
    const selectedMinute = date
      ? String(date.getMinutes()).padStart(2, '0')
      : ''

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
          <SelectTrigger
            removeIcon
            aria-label={t('timePicker.hour')}
            className="h-auto w-fit border-none bg-transparent focus:ring-0 p-3"
          >
            <SelectValue placeholder={t('timePicker.hourPlaceholder')} />
          </SelectTrigger>
          <SelectContent>
            {hours.map((hour) => (
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
            className="h-auto w-fit border-none bg-transparent focus:ring-0 p-3"
            aria-label={t('timePicker.minute')}
          >
            <SelectValue placeholder={t('timePicker.minutePlaceholder')} />
          </SelectTrigger>
          <SelectContent>
            {minutes.map((minute) => (
              <SelectItem key={minute} value={minute}>
                {minute}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    )
  },
)

TimePicker.displayName = 'TimePicker'

export { TimePicker }
