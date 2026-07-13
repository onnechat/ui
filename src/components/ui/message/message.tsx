'use client'

import * as React from 'react'

import { cn } from '@/lib/cn'

type MessageAlign = 'start' | 'end'

const MessageAlignContext = React.createContext<MessageAlign>('start')

function useMessageAlign() {
  return React.useContext(MessageAlignContext)
}

/**
 * A single conversation row. `align="start"` for incoming (other party),
 * `align="end"` for outgoing (current user) — the whole row (avatar + content)
 * flips side. Wrap consecutive same-sender rows in `Message.Group`.
 */
function MessageRoot({
  className,
  align = 'start',
  ...props
}: React.ComponentProps<'div'> & { align?: MessageAlign }) {
  return (
    <MessageAlignContext.Provider value={align}>
      <div
        data-slot="message"
        data-align={align}
        className={cn(
          'group/message flex items-end gap-2',
          // Only reserve the footer-clearance offset on the avatar when a
          // footer actually exists — without one, the avatar sits flush with
          // the bottom bubble instead of floating above it.
          'has-[[data-slot=message-footer]]:[--message-avatar-offset:1.375rem]',
          align === 'end' && 'flex-row-reverse',
          className,
        )}
        {...props}
      />
    </MessageAlignContext.Provider>
  )
}

/**
 * Avatar slot. It's `sticky` to the bottom of the scroll viewport, so while a
 * long same-sender group scrolls by, the avatar trails the latest visible
 * bubble instead of scrolling away with the first one. The bottom margin
 * (`--message-avatar-offset`) is 0 by default and only grows to clear a footer
 * when the row actually has one (see `MessageRoot`), so the avatar always sits
 * on the last bubble — never floating above it.
 */
function MessageAvatar({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="message-avatar"
      className={cn(
        'sticky bottom-0 mb-[var(--message-avatar-offset,0px)] self-end shrink-0',
        className,
      )}
      {...props}
    />
  )
}

/** Wraps header + bubble(s) + footer, aligned to the message side. */
function MessageContent({ className, ...props }: React.ComponentProps<'div'>) {
  const align = useMessageAlign()
  return (
    <div
      data-slot="message-content"
      className={cn(
        'flex min-w-0 flex-col gap-1',
        align === 'end' ? 'items-end' : 'items-start',
        className,
      )}
      {...props}
    />
  )
}

/** Sender name / label above the bubble. */
function MessageHeader({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="message-header"
      className={cn(
        'text-muted-foreground px-1 text-xs font-medium',
        className,
      )}
      {...props}
    />
  )
}

/** Metadata / timestamp / actions below the bubble. */
function MessageFooter({ className, ...props }: React.ComponentProps<'div'>) {
  const align = useMessageAlign()
  return (
    <div
      data-slot="message-footer"
      className={cn(
        'text-muted-foreground flex items-center gap-1.5 px-1 text-xs',
        align === 'end' && 'flex-row-reverse',
        className,
      )}
      {...props}
    />
  )
}

/**
 * Stacks consecutive messages from the same sender with tighter spacing.
 * Optionally tightens the bubble corners between grouped rows.
 */
function MessageGroup({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="message-group"
      className={cn('flex flex-col gap-1', className)}
      {...props}
    />
  )
}

const Message = Object.assign(MessageRoot, {
  Avatar: MessageAvatar,
  Content: MessageContent,
  Header: MessageHeader,
  Footer: MessageFooter,
  Group: MessageGroup,
})

export { Message, useMessageAlign }
