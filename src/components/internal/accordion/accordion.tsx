'use client'

import * as React from 'react'

import { Accordion } from '@base-ui/react/accordion'

import { Icon } from '@/components/icon'

import { cn } from '@/lib/cn'

function AccordionRoot({
  ...props
}: React.ComponentProps<typeof Accordion.Root>) {
  return <Accordion.Root data-slot="accordion" {...props} />
}

function AccordionItem({
  className,
  ...props
}: React.ComponentProps<typeof Accordion.Item>) {
  return (
    <Accordion.Item
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
}: React.ComponentProps<typeof Accordion.Trigger>) {
  return (
    <Accordion.Header className="flex">
      <Accordion.Trigger
        data-slot="accordion-trigger"
        className={cn(
          'focus-visible:border-ring focus-visible:ring-ring/50 flex flex-1 items-center justify-start gap-4 rounded-md py-4 text-left text-sm font-medium transition-all outline-none focus-visible:ring-[3px] disabled:pointer-events-none cursor-pointer disabled:opacity-50 [&[data-state=open]>svg]:rotate-0',
          className,
        )}
        {...props}
      >
        {children}

        <Icon name="ChevronDown" className="text-muted-foreground pointer-events-none size-4 shrink-0 translate-y-0.5 transition-transform duration-200 -rotate-90 ml-auto" />
      </Accordion.Trigger>
    </Accordion.Header>
  )
}

function AccordionContent({
  className,
  children,
  ...props
}: React.ComponentProps<typeof Accordion.Panel>) {
  return (
    <Accordion.Panel
      data-slot="accordion-content"
      className="data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down overflow-hidden text-sm"
      {...props}
    >
      <div className={cn('pt-0 pb-4', className)}>{children}</div>
    </Accordion.Panel>
  )
}

export { AccordionRoot as Accordion, AccordionContent, AccordionItem, AccordionTrigger }
