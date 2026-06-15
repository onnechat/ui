import * as React from 'react'

import { ScrollArea as ScrollAreaBase } from '@base-ui/react/scroll-area'

import { cn } from '@/lib/cn'

const ScrollArea = React.forwardRef<
  React.ElementRef<typeof ScrollAreaBase.Root>,
  React.ComponentPropsWithoutRef<typeof ScrollAreaBase.Root>
>(({ className, children, ...props }, ref) => (
  <ScrollAreaBase.Root
    ref={ref}
    className={cn('relative overflow-hidden', className)}
    {...props}
  >
    <ScrollAreaBase.Viewport className="h-full w-full">
      {children}
    </ScrollAreaBase.Viewport>
    <ScrollBar />
    <ScrollAreaBase.Corner />
  </ScrollAreaBase.Root>
))
ScrollArea.displayName = ScrollAreaBase.Root.displayName

const ScrollBar = React.forwardRef<
  React.ElementRef<typeof ScrollAreaBase.Scrollbar>,
  React.ComponentPropsWithoutRef<typeof ScrollAreaBase.Scrollbar>
>(({ className, orientation = 'vertical', ...props }, ref) => (
  <ScrollAreaBase.Scrollbar
    ref={ref}
    orientation={orientation}
    className={cn(
      'flex touch-none select-none transition-colors',
      orientation === 'vertical' &&
        'h-full w-2.5 border-l border-l-transparent p-px',
      orientation === 'horizontal' &&
        'h-2.5 flex-col border-t border-t-transparent p-px',
      className,
    )}
    {...props}
  >
    <ScrollAreaBase.Thumb className="relative flex-1 rounded-full bg-border hover:bg-muted-foreground transition-colors" />
  </ScrollAreaBase.Scrollbar>
))
ScrollBar.displayName = ScrollAreaBase.Scrollbar.displayName

export { ScrollArea, ScrollBar }
