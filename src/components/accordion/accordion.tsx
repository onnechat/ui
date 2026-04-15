'use client'

import * as React from 'react'

import type { AccordionSingleProps } from '@radix-ui/react-accordion'

import { cn } from '@/lib/cn'

import {
  Accordion as AccordionRoot,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'

export type AccordionListItem = {
  id?: string
  trigger: React.ReactNode
  children: React.ReactNode
}

export type AccordionProps = Omit<AccordionSingleProps, 'children' | 'type'> & {
  items: AccordionListItem[]
}

const cardShell =
  'flex h-fit w-full flex-col bg-card [--card-radius:1rem] [--card-padding:0.25rem] p-(--card-padding) rounded-(--card-radius) group'

const cardContentShell = cn(
  'relative flex flex-1 flex-col gap-0 overflow-visible',
  'bg-muted [--card-content-radius:calc(var(--card-radius)-var(--card-padding))] [--card-content-padding:1rem] rounded-(--card-content-radius)',
)

function Accordion({
  items,
  className,
  collapsible = true,
  ...rootProps
}: AccordionProps) {
  const count = items.length

  return (
    <div className={cn(cardShell, className)}>
      <AccordionRoot
        type="single"
        collapsible={collapsible}
        {...rootProps}
        className={cardContentShell}
      >
        {items.map((item, index) => {
          const isFirst = index === 0
          const isLast = index === count - 1

          const value = item.id ?? `item-${index}`

          return (
            <AccordionItem
              key={value}
              value={value}
              className="overflow-visible rounded-none border-0"
            >
              <AccordionTrigger
                className={cn(
                  'min-h-12 rounded-none border-0 bg-card/50 p-4 text-left text-sm md:text-base hover:bg-card/75 transition-none',
                  isFirst && 'rounded-t-lg border-t-0',
                  isLast && 'data-[state=closed]:rounded-b-lg border-b-0',
                )}
              >
                {item.trigger}
              </AccordionTrigger>

              <AccordionContent
                className={cn(
                  'bg-transparent whitespace-pre-line text-sm leading-relaxed text-muted-foreground md:text-base p-4 border-y-4',
                  !isLast ? 'border-card' : 'border-transparent',
                )}
              >
                {item.children}
              </AccordionContent>
            </AccordionItem>
          )
        })}
      </AccordionRoot>
    </div>
  )
}

Accordion.displayName = 'Accordion'

export { Accordion }
