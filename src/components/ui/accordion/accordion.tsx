'use client'

import * as React from 'react'

import { cn } from '@/lib/cn'

import {
  Accordion as AccordionRootPrimitive,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/internal/accordion'

const cardShell =
  'flex h-fit w-full flex-col bg-card [--card-radius:1rem] [--card-padding:0.25rem] p-(--card-padding) rounded-(--card-radius) group'

const cardContentShell = cn(
  'relative flex flex-1 flex-col gap-0 overflow-hidden',
  'bg-muted [--card-content-radius:calc(var(--card-radius)-var(--card-padding))] [--card-content-padding:1rem] rounded-(--card-content-radius)',
)

function AccordionRoot({
  className,
  ...props
}: React.ComponentProps<typeof AccordionRootPrimitive>) {
  return (
    <div className={cn(cardShell, className)}>
      <AccordionRootPrimitive
        data-slot="accordion"
        className={cardContentShell}
        {...props}
      />
    </div>
  )
}

function AccordionItemExtended({
  className,
  ...props
}: React.ComponentProps<typeof AccordionItem>) {
  return (
    <AccordionItem
      className={cn(
        'rounded-none border-t-4 border-card first:border-t-0',
        'not-data-open:last:rounded-b-lg',
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
        'min-h-12 rounded-none border-0 bg-card/50 md:text-base hover:bg-card/75',
        'first:rounded-t-lg last:not-data-panel-open:rounded-b-lg',
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
      className={cn(
        'border-t-4 border-card',
        className,
      )}
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
