'use client'

import * as React from 'react'

import { Accordion as AccordionPrimitive } from '@base-ui/react/accordion'

import { Icon } from '@/components/icon'

import { cn } from '@/lib/cn'

type AccordionProps = Omit<
  AccordionPrimitive.Root.Props,
  'value' | 'defaultValue' | 'onValueChange' | 'multiple'
> & {
  /** Radix-compatible API: 'single' keeps at most one item open. */
  type?: 'single' | 'multiple'
  /** Kept for Radix API compatibility; Base UI single accordions are always collapsible. */
  collapsible?: boolean
  value?: string | string[]
  defaultValue?: string | string[]
  /** Receives a `string` when `type="single"` and a `string[]` when `type="multiple"`. */
  onValueChange?: (value: string & string[]) => void
}

function Accordion({
  type = 'single',
  collapsible: _collapsible,
  value,
  defaultValue,
  onValueChange,
  ...props
}: AccordionProps) {
  const toArray = (v: string | string[] | undefined) =>
    v === undefined ? undefined : Array.isArray(v) ? v : [v]

  const handleValueChange = onValueChange
    ? (next: unknown[]) => {
        if (type === 'multiple') {
          const handle = onValueChange as (value: string[]) => void
          handle(next as string[])
        } else {
          const handle = onValueChange as (value: string) => void
          handle((next[next.length - 1] as string) ?? '')
        }
      }
    : undefined

  return (
    <AccordionPrimitive.Root
      data-slot="accordion"
      multiple={type === 'multiple'}
      value={toArray(value)}
      defaultValue={toArray(defaultValue)}
      onValueChange={handleValueChange}
      {...props}
    />
  )
}

function AccordionItem({ className, ...props }: AccordionPrimitive.Item.Props) {
  return (
    <AccordionPrimitive.Item
      data-slot="accordion-item"
      className={cn('border-b last:border-b-0', className)}
      {...props}
    />
  )
}

function AccordionTrigger({
  className,
  children,
  ...props
}: AccordionPrimitive.Trigger.Props) {
  return (
    <AccordionPrimitive.Header className="flex">
      <AccordionPrimitive.Trigger
        data-slot="accordion-trigger"
        className={cn(
          'focus-visible:border-ring focus-visible:ring-ring/50 flex flex-1 items-center justify-start gap-4 rounded-md p-4 text-left text-sm font-medium transition-colors outline-none focus-visible:ring-[3px] disabled:pointer-events-none cursor-pointer disabled:opacity-50 [&[data-panel-open]>svg]:rotate-180',
          className,
        )}
        {...props}
      >
        {children}

        <Icon
          name="ChevronDown"
          className="text-muted-foreground pointer-events-none size-4 shrink-0 transition-transform duration-[450ms] ease-spring motion-reduce:transition-none ml-auto"
        />
      </AccordionPrimitive.Trigger>
    </AccordionPrimitive.Header>
  )
}

function AccordionContent({
  className,
  children,
  ...props
}: AccordionPrimitive.Panel.Props) {
  return (
    <AccordionPrimitive.Panel
      data-slot="accordion-content"
      className={cn(
        'h-(--accordion-panel-height) overflow-hidden text-sm',
        'data-starting-style:h-0 data-ending-style:h-0',
        'data-starting-style:opacity-0 data-ending-style:opacity-0',
        /**
         * Opening (data-open present) the height follows the spring with
         * overshoot; closing falls back to the soft ease — exits should be
         * more subtle.
         */
        'transition-[height,opacity] duration-[350ms] ease-out-soft',
        'data-open:duration-[550ms] data-open:ease-spring',
        'motion-reduce:transition-none',
      )}
      {...props}
    >
      <div className={cn('p-4', className)}>{children}</div>
    </AccordionPrimitive.Panel>
  )
}

export { Accordion, AccordionContent, AccordionItem, AccordionTrigger }
