import * as React from 'react'

import { cn } from '@/lib/cn'

import { Icon, IconType } from '@/components/icon'

import { Input } from '../input'

const TIME_INPUT_TYPES = {
  DATE: 'date',
  TIME: 'time',
  DATETIME_LOCAL: 'datetime-local',
} as const

type TimeInputType = (typeof TIME_INPUT_TYPES)[keyof typeof TIME_INPUT_TYPES]

/**
 * Native HTML date/time input with a custom icon instead of the browser's picker indicator.
 *
 * Hides `::-webkit-calendar-picker-indicator` via CSS, then overlays a themed icon
 * ({@link IconType}) that opens the native picker on click.
 *
 * In Firefox, which lacks `::-webkit-calendar-picker-indicator`, a colored overlay
 * sits on top of the native affordance to keep the visual consistent.
 *
 * @param type - One of `'date'`, `'time'`, or `'datetime-local'`.
 */
function TimeInput({
  type,
  className,
  ...props
}: React.ComponentProps<'input'> & {
  type: TimeInputType
}) {
  const isValidType = Object.values(TIME_INPUT_TYPES).includes(type)

  const isDate = type === TIME_INPUT_TYPES.DATE
  const isTime = type === TIME_INPUT_TYPES.TIME
  const isDateTimeLocal = type === TIME_INPUT_TYPES.DATETIME_LOCAL

  const inputRef = React.useRef<HTMLInputElement>(null)
  const [hasValue, setHasValue] = React.useState(
    !!(props.value ?? props.defaultValue),
  )

  const getPlaceholder = () => {
    if (isDate) return 'AAAA-MM-DD'
    if (isTime) return 'HH:MM'
    if (isDateTimeLocal) return 'AAAA-MM-DD HH:MM'
    return ''
  }

  const getIconName = () => {
    if (isDate) return 'Calendar'
    if (isTime) return 'Clock'
    if (isDateTimeLocal) return 'CalendarClock'
    return 'Calendar'
  }

  const iconName = getIconName() as IconType

  const handleIconClick = () => {
    inputRef.current?.showPicker?.() || inputRef.current?.focus()
  }

  return (
    <div className="relative min-w-0 w-full">
      <Input
        ref={inputRef}
        type={type}
        placeholder={getPlaceholder()}
        className={cn(
          'text-end pr-12 [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-inner-spin-button]:hidden [&::-webkit-outer-spin-button]:hidden [-moz-appearance:none] appearance-none',
          !hasValue && 'text-sm text-muted-foreground/50',
          className,
        )}
        onChange={(e) => {
          setHasValue(e.target.value !== '')
          props.onChange?.(e)
        }}
        {...props}
      />

      {/* Firefox has no ::-webkit-calendar-picker-indicator; it still paints the native affordance. */}
      {isValidType && (
        <div
          aria-hidden
          className="pointer-events-none absolute inset-y-0 right-0 z-1 w-12 rounded-r-xl bg-input"
        />
      )}

      {isValidType && (
        <Icon
          name={iconName}
          onClick={handleIconClick}
          className="absolute right-4 top-1/2 z-2 size-4 -translate-y-1/2 text-muted-foreground cursor-pointer hover:text-foreground transition-colors"
        />
      )}
    </div>
  )
}

export { TimeInput }
