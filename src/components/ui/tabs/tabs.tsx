'use client';

import * as React from 'react';

import { Tabs as TabsPrimitive } from '@base-ui/react/tabs';

import { cn } from '@/lib/cn';

const cardShell =
  'flex flex-col bg-card [--card-radius:1rem] [--card-padding:0.25rem] p-(--card-padding) rounded-(--card-radius) group w-full h-fit';

const cardContentShell = cn(
  'relative bg-muted flex flex-1 flex-col gap-2',
  '[--card-content-radius:calc(var(--card-radius)-var(--card-padding))] [--card-content-padding:1rem] rounded-(--card-content-radius) p-(--card-content-padding) overflow-hidden',
);

type TabsRootProps = React.ComponentProps<typeof TabsPrimitive.Root>;

function Tabs({ className, ...props }: TabsRootProps) {
  return (
    <TabsPrimitive.Root
      className={cn(cardShell, className)}
      {...props}
    />
  );
}

type TabsListProps = React.ComponentProps<typeof TabsPrimitive.List>;

function TabsList({ className, ...props }: TabsListProps) {
  return (
    <TabsPrimitive.List
      className={cn(
        'relative flex items-center gap-0.5 p-4',
        className,
      )}
      {...props}
    />
  );
}

type TabsTabProps = React.ComponentProps<typeof TabsPrimitive.Tab>;

function TabsTrigger({ className, ...props }: TabsTabProps) {
  return (
    <TabsPrimitive.Tab
      className={cn(
        'relative flex min-h-9 items-center justify-center rounded-lg px-3 py-1.5 text-sm font-medium text-muted-foreground transition-colors outline-none select-none data-selected:text-foreground data-selected:bg-card focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 data-active:text-foreground cursor-pointer hover:bg-muted hover:text-muted-foreground',
        className,
      )}
      {...props}
    />
  );
}

type TabsPanelProps = React.ComponentProps<typeof TabsPrimitive.Panel>;

function TabsContent({ className, ...props }: TabsPanelProps) {
  return (
    <TabsPrimitive.Panel
      className={cn(cardContentShell, className)}
      {...props}
    />
  );
}

Tabs.List = TabsList;
Tabs.Trigger = TabsTrigger;
Tabs.Content = TabsContent;

export { Tabs };
