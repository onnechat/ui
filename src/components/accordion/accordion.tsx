'use client';

import * as React from 'react';

import { cn } from '@/lib/cn';

import {
  Accordion as AccordionRoot,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

export type AccordionListItem = {
  id?: string;
  trigger: React.ReactNode;
  children: React.ReactNode;
};

export type AccordionProps = {
  items: AccordionListItem[];
  className?: string;
  type: 'single' | 'multiple';
  collapsible: boolean;
  disabled: boolean;
  defaultValue?: string | string[];
  value?: string | string[];
  onValueChange?: (value: string | string[]) => void;
};

const cardShell =
  'flex h-fit w-full flex-col bg-card [--card-radius:1rem] [--card-padding:0.25rem] p-(--card-padding) rounded-(--card-radius) group';

const cardContentShell = cn(
  'relative flex flex-1 flex-col gap-0 overflow-hidden',
  'bg-muted [--card-content-radius:calc(var(--card-radius)-var(--card-padding))] [--card-content-padding:1rem] rounded-(--card-content-radius)',
);

function Accordion({
  items = [],
  className,
  type = 'single',
  collapsible = true,
  disabled = false,
  value,
  defaultValue,
  onValueChange,
}: AccordionProps) {
  const count = items?.length || 0;

  const children = items.map((item, index) => {
    const isFirst = index === 0;
    const isLast = index === count - 1;

    const itemValue = item.id ?? `item-${index}`;

    return (
      <AccordionItem
        key={itemValue}
        value={itemValue}
        className={cn(
          'rounded-none border-t-4 border-card',
          isFirst && 'rounded-t-lg border-t-0',
          isLast && 'data-[state=closed]:rounded-b-lg',
        )}
      >
        <AccordionTrigger
          className={cn(
            'min-h-12 rounded-none border-0 bg-card/50 p-4 text-left text-sm md:text-base hover:bg-card/75 transition-none',
            isFirst && 'rounded-t-lg',
            isLast && 'data-[state=closed]:rounded-b-lg',
          )}
        >
          {item.trigger}
        </AccordionTrigger>

        <AccordionContent
          className={cn(
            'bg-transparent whitespace-pre-line text-sm leading-relaxed text-muted-foreground md:text-base p-4 border-t-4',
            !isLast ? 'border-card' : 'border-transparent',
          )}
        >
          {item.children}
        </AccordionContent>
      </AccordionItem>
    );
  });

  return (
    <div className={cn(cardShell, className)}>
      {type === 'multiple' ? (
        <AccordionRoot
          type="multiple"
          value={value as string[] | undefined}
          defaultValue={defaultValue as string[] | undefined}
          onValueChange={onValueChange as ((v: string[]) => void) | undefined}
          disabled={disabled}
          className={cardContentShell}
        >
          {children}
        </AccordionRoot>
      ) : (
        <AccordionRoot
          type="single"
          collapsible={collapsible}
          value={value as string | undefined}
          defaultValue={defaultValue as string | undefined}
          onValueChange={onValueChange as ((v: string) => void) | undefined}
          disabled={disabled}
          className={cardContentShell}
        >
          {children}
        </AccordionRoot>
      )}
    </div>
  );
}

Accordion.displayName = 'Accordion';

export { Accordion };
