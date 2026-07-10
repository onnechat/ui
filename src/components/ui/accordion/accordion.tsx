'use client'

import * as React from 'react'

import { cn } from '@/lib/cn'

import {
  Accordion as AccordionRootPrimitive,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/internal/accordion'

function AccordionRoot({
  className,
  ...props
}: React.ComponentProps<typeof AccordionRootPrimitive>) {
  return (
    <AccordionRootPrimitive
      data-slot="accordion"
      className={cn(
        'flex h-fit w-full flex-col [--accordion-radius:1rem]',
        className,
      )}
      {...props}
    />
  )
}

function AccordionItemExtended({
  className,
  ...props
}: React.ComponentProps<typeof AccordionItem>) {
  return (
    <AccordionItem
      className={cn(
        'overflow-hidden rounded-none border-0 bg-muted',
        /**
         * Adjacent closed items merge into one continuous group: only the
         * group's edges (its ends, or neighbors of an open item) round off.
         */
        'first:rounded-t-(--accordion-radius) last:rounded-b-(--accordion-radius)',
        '[[data-open]+&]:rounded-t-(--accordion-radius)',
        '[&:has(+[data-open])]:rounded-b-(--accordion-radius)',
        /** An open item stands out from the group as its own card. */
        'data-open:rounded-(--accordion-radius)',
        'data-open:not-first:mt-4 data-open:not-last:mb-4',
        'transition-[margin,border-radius] duration-[350ms] ease-out-soft',
        'data-open:duration-[550ms] data-open:ease-spring',
        'motion-reduce:transition-none',
        className,
      )}
      {...props}
    />
  )
}

function AccordionTriggerExtended({
  className,
  ...props
}: React.ComponentProps<typeof AccordionTrigger>) {
  return (
    <AccordionTrigger
      className={cn(
        'min-h-12 rounded-none border-0 md:text-base hover:bg-card/50',
        className,
      )}
      {...props}
    />
  )
}

function AccordionContentExtended({
  className,
  ...props
}: React.ComponentProps<typeof AccordionContent>) {
  return (
    <AccordionContent
      className={cn('text-muted-foreground md:text-base', className)}
      {...props}
    />
  )
}

AccordionRoot.displayName = 'Accordion'
AccordionItemExtended.displayName = 'Accordion.Item'
AccordionTriggerExtended.displayName = 'Accordion.Trigger'
AccordionContentExtended.displayName = 'Accordion.Content'

const Accordion = Object.assign(AccordionRoot, {
  Item: AccordionItemExtended,
  Trigger: AccordionTriggerExtended,
  Content: AccordionContentExtended,
})

export { Accordion }
