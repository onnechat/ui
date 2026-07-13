'use client'

import * as React from 'react'

import { cva, type VariantProps } from 'class-variance-authority'

import { cn } from '@/lib/cn'

const bubbleVariants = cva(
  'relative w-fit max-w-full min-w-0 rounded-2xl px-4 py-2.5 text-sm break-words wrap-anywhere',
  {
    variants: {
      // `incoming` = other party, on the `card` surface; `outgoing` = the
      // current user, on `primary`. The reduced corner on the sender side is
      // the classic "tail" without an SVG.
      variant: {
        incoming: 'bg-card text-card-foreground rounded-bl-md',
        outgoing: 'bg-primary text-primary-foreground rounded-br-md',
      },
    },
    defaultVariants: {
      variant: 'incoming',
    },
  },
)

function BubbleRoot({
  className,
  variant,
  ...props
}: React.ComponentProps<'div'> & VariantProps<typeof bubbleVariants>) {
  return (
    <div
      data-slot="bubble"
      data-variant={variant ?? 'incoming'}
      className={cn(bubbleVariants({ variant }), className)}
      {...props}
    />
  )
}

function BubbleContent({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="bubble-content"
      className={cn('leading-relaxed whitespace-pre-wrap', className)}
      {...props}
    />
  )
}

/** A row of actions revealed on hover, e.g. copy / react. */
function BubbleActions({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="bubble-actions"
      className={cn(
        'mt-1 flex items-center gap-1 opacity-0 transition-opacity group-hover/message:opacity-100 focus-within:opacity-100',
        className,
      )}
      {...props}
    />
  )
}

const Bubble = Object.assign(BubbleRoot, {
  Content: BubbleContent,
  Actions: BubbleActions,
})

export { Bubble, bubbleVariants }
