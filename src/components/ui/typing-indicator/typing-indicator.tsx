'use client'

import * as React from 'react'

import { cva, type VariantProps } from 'class-variance-authority'

import { cn } from '@/lib/cn'

const typingIndicatorVariants = cva(
  'text-muted-foreground inline-flex items-center',
  {
    variants: {
      size: {
        sm: 'gap-1.5 text-xs [&_[data-dot]]:size-1',
        default: 'gap-2 text-sm [&_[data-dot]]:size-1.5',
        lg: 'gap-2.5 text-base [&_[data-dot]]:size-2',
      },
    },
    defaultVariants: {
      size: 'default',
    },
  },
)

// Stagger the three dots so they ripple instead of pulsing in unison.
const DOT_DELAYS = ['0s', '0.16s', '0.32s']

/**
 * Animated "typing…" indicator — three bouncing dots plus an optional label.
 * Standalone so it can live next to a chat composer (Discord-style), inside a
 * `Bubble` for an assistant-composing state, or anywhere a live "working" hint
 * is needed. The container is an `aria-live` region; the dots are decorative.
 */
function TypingIndicator({
  className,
  size,
  children,
  label,
  ...props
}: React.ComponentProps<'div'> &
  VariantProps<typeof typingIndicatorVariants> & {
    /** Text shown after the dots (alias for `children`). */
    label?: React.ReactNode
  }) {
  const content = label ?? children

  return (
    // `role="status"` is a polite live region and lets an `aria-label` name the
    // indicator when there's no visible text (just the dots).
    <div
      data-slot="typing-indicator"
      role="status"
      className={cn(typingIndicatorVariants({ size }), className)}
      {...props}
    >
      <span aria-hidden className="flex items-center gap-1">
        {DOT_DELAYS.map(delay => (
          <span
            key={delay}
            data-dot
            className="animate-[typing-bounce_1.1s_ease-in-out_infinite] rounded-full bg-current"
            style={{ animationDelay: delay }}
          />
        ))}
      </span>
      {content != null && <span>{content}</span>}
    </div>
  )
}

export { TypingIndicator, typingIndicatorVariants }
