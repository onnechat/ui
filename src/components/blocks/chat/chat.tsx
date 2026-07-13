'use client'

import * as React from 'react'

import { cn } from '@/lib/cn'

import { Icon, type IconType } from '@/components/icon'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { MessageScroller } from '@/components/ui/message-scroller'
import { Textarea } from '@/components/ui/textarea'
import { TypingIndicator } from '@/components/ui/typing-indicator'

/**
 * Chat block — an opinionated shell that frames a conversation inside a `Card`:
 * a header, a scrollable message area (wired to `MessageScroller`) and a
 * composer footer. Drop `Message`/`Bubble`/`Marker` inside `Chat.Body` to render
 * turns; the same shell serves an agent thread or a person-to-person chat.
 */
function ChatRoot({
  className,
  autoScroll = true,
  children,
  ...props
}: React.ComponentProps<'div'> & { autoScroll?: boolean }) {
  return (
    <MessageScroller.Provider
      autoScroll={autoScroll}
      defaultScrollPosition="end"
    >
      <Card
        data-slot="chat"
        className={cn('flex h-[34rem] max-w-md flex-col', className)}
        {...props}
      >
        {children}
      </Card>
    </MessageScroller.Provider>
  )
}

/** Header row: pair with `Chat.Identity` or compose freely (title, actions). */
function ChatHeader({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <Card.Header
      data-slot="chat-header"
      className={cn('min-h-0 py-3', className)}
      {...props}
    />
  )
}

/** Avatar + title + subtitle cluster for the header. */
function ChatIdentity({
  title,
  subtitle,
  avatar,
  className,
  ...props
}: Omit<React.ComponentProps<'div'>, 'title'> & {
  title: React.ReactNode
  subtitle?: React.ReactNode
  avatar?: React.ReactNode
}) {
  return (
    <div
      data-slot="chat-identity"
      className={cn('flex min-w-0 items-center gap-3', className)}
      {...props}
    >
      {avatar}
      <div className="flex min-w-0 flex-col">
        <span className="text-foreground truncate text-sm font-medium">
          {title}
        </span>
        {subtitle && (
          <span className="text-muted-foreground truncate text-xs">
            {subtitle}
          </span>
        )}
      </div>
    </div>
  )
}

/** Pushes the following header content to the far edge (e.g. action buttons). */
function ChatHeaderActions({
  className,
  ...props
}: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="chat-header-actions"
      className={cn('ml-auto flex items-center gap-1', className)}
      {...props}
    />
  )
}

/**
 * Scrollable message area. It fills the card's muted content surface and hosts
 * the `MessageScroller` viewport plus the jump-to-latest button.
 */
function ChatBody({
  className,
  children,
  ...props
}: React.ComponentProps<'div'>) {
  return (
    <Card.Content
      data-slot="chat-body"
      className={cn('[--card-content-padding:0px] gap-0', className)}
      {...props}
    >
      <MessageScroller className="flex-1">
        <MessageScroller.Viewport>
          <MessageScroller.Content className="gap-3">
            {children}
          </MessageScroller.Content>
        </MessageScroller.Viewport>
        <MessageScroller.Button />
      </MessageScroller>
    </Card.Content>
  )
}

/** Centered empty state for a fresh conversation. */
function ChatEmpty({
  icon = 'Message',
  title,
  description,
  className,
  children,
  ...props
}: React.ComponentProps<'div'> & {
  icon?: IconType
  title?: React.ReactNode
  description?: React.ReactNode
}) {
  return (
    <div
      data-slot="chat-empty"
      className={cn(
        'flex flex-1 flex-col items-center justify-center gap-3 px-6 py-10 text-center',
        className,
      )}
      {...props}
    >
      <div className="bg-background text-muted-foreground flex size-12 items-center justify-center rounded-full [&_svg]:size-5">
        <Icon name={icon} />
      </div>
      {title && (
        <p className="text-foreground text-sm font-medium text-balance">
          {title}
        </p>
      )}
      {description && (
        <p className="text-muted-foreground max-w-xs text-xs text-balance">
          {description}
        </p>
      )}
      {children}
    </div>
  )
}

type ChatComposerProps = Omit<React.ComponentProps<'div'>, 'onSubmit'> & {
  /** Called with the trimmed message when the user submits. */
  onSend?: (message: string) => void
  placeholder?: string
  disabled?: boolean
  /** Leading slot, e.g. an attachment `DropdownMenu` trigger. */
  actions?: React.ReactNode
  /** Overrides the default send button (icon-only, submits the field). */
  sendLabel?: string
}

/**
 * Composer footer: a rounded input pill with an optional leading `actions`
 * slot, a growing textarea (Enter sends, Shift+Enter breaks a line) and a send
 * button. Holds its own draft state and clears it after `onSend`.
 */
function ChatComposer({
  className,
  onSend,
  placeholder = 'Escreva uma mensagem…',
  disabled,
  actions,
  sendLabel = 'Enviar mensagem',
  ...props
}: ChatComposerProps) {
  const [value, setValue] = React.useState('')
  const canSend = value.trim().length > 0 && !disabled

  const submit = () => {
    if (!canSend) return
    onSend?.(value.trim())
    setValue('')
  }

  return (
    <Card.Footer
      data-slot="chat-composer"
      className={cn('items-stretch', className)}
      {...props}
    >
      {/* The pill uses `bg-muted` (not `bg-input`, which equals `bg-card` in
          light mode) so it reads as a distinct input surface over the footer —
          no border, matching the lib's borderless surfaces (Card/Button). */}
      <div className="bg-muted focus-within:ring-ring/50 flex w-full items-end gap-1 rounded-xl p-1.5 transition focus-within:ring-[3px]">
        {actions && <div className="flex shrink-0 items-end">{actions}</div>}
        <Textarea
          value={value}
          disabled={disabled}
          onChange={event => setValue(event.target.value)}
          onKeyDown={event => {
            if (event.key === 'Enter' && !event.shiftKey) {
              event.preventDefault()
              submit()
            }
          }}
          rows={1}
          placeholder={placeholder}
          aria-label={placeholder}
          className="min-h-8 flex-1 resize-none self-center border-0 bg-transparent px-2 py-1.5 shadow-none focus-visible:ring-0"
        />
        <Button
          variant="primary"
          size="icon-sm"
          onClick={submit}
          disabled={!canSend}
          aria-label={sendLabel}
          className="shrink-0"
        >
          <Icon name="ArrowUp" />
        </Button>
      </div>
    </Card.Footer>
  )
}

/**
 * "Someone is typing" indicator — three bouncing dots + a label. Place it
 * BETWEEN `Chat.Body` and `Chat.Composer` (Discord-style, right above the
 * input) and render it only while the other party is composing. This is NOT a
 * `Marker` — a Marker flags something important IN the transcript; a live
 * typing hint belongs next to the input.
 */
function ChatTyping({
  className,
  children,
  ...props
}: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="chat-typing"
      className={cn('px-4 pt-2 pb-0.5', className)}
      {...props}
    >
      <TypingIndicator>{children}</TypingIndicator>
    </div>
  )
}

const Chat = Object.assign(ChatRoot, {
  Header: ChatHeader,
  Identity: ChatIdentity,
  HeaderActions: ChatHeaderActions,
  Body: ChatBody,
  Empty: ChatEmpty,
  Typing: ChatTyping,
  Composer: ChatComposer,
})

export { Chat }
