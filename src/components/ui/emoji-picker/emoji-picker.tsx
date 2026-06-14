'use client'

import * as React from 'react'

import { EmojiPicker as EmojiPickerPrimitive } from 'frimousse'

import { cn } from '@/lib/cn'

function EmojiPickerRoot({
  className,
  ...props
}: React.ComponentProps<typeof EmojiPickerPrimitive.Root>) {
  return (
    <EmojiPickerPrimitive.Root
      className={cn(
        'isolate flex h-[368px] w-fit flex-col rounded-lg border bg-card text-card-foreground shadow-md',
        className,
      )}
      {...props}
    />
  )
}

function EmojiPickerSearch({
  className,
  ...props
}: React.ComponentProps<typeof EmojiPickerPrimitive.Search>) {
  return (
    <EmojiPickerPrimitive.Search
      className={cn(
        'z-10 mx-2 mt-2 rounded-lg border-0 bg-muted px-2.5 py-2 text-sm outline-none placeholder:text-muted-foreground/50 focus-visible:ring-2 focus-visible:ring-ring',
        className,
      )}
      placeholder={'Search emoji...'}
      {...props}
    />
  )
}

function EmojiPickerViewport({
  className,
  ...props
}: React.ComponentProps<typeof EmojiPickerPrimitive.Viewport>) {
  return (
    <EmojiPickerPrimitive.Viewport
      className={cn('relative flex-1 outline-hidden', className)}
      {...props}
    />
  )
}

function EmojiPickerLoading({
  className,
  children = 'Loading...',
  ...props
}: React.ComponentProps<typeof EmojiPickerPrimitive.Loading>) {
  return (
    <EmojiPickerPrimitive.Loading
      className={cn(
        'absolute inset-0 flex items-center justify-center text-sm text-muted-foreground',
        className,
      )}
      {...props}
    >
      {children}
    </EmojiPickerPrimitive.Loading>
  )
}

function EmojiPickerEmpty({
  className,
  children,
  ...props
}: React.ComponentProps<typeof EmojiPickerPrimitive.Empty>) {
  return (
    <EmojiPickerPrimitive.Empty
      className={cn(
        'absolute inset-0 flex items-center justify-center text-sm text-muted-foreground',
        className,
      )}
      {...props}
    >
      {typeof children === 'function' ? children : children ?? 'No emoji found.'}
    </EmojiPickerPrimitive.Empty>
  )
}

function EmojiPickerList({
  className,
  ...props
}: React.ComponentProps<typeof EmojiPickerPrimitive.List>) {
  return (
    <EmojiPickerPrimitive.List
      className={cn('select-none pb-1.5', className)}
      components={{
        CategoryHeader: ({ category, ...props }) => (
          <div
            className="bg-card px-3 pt-3 pb-1.5 text-xs font-medium text-muted-foreground"
            {...props}
          >
            {category.label}
          </div>
        ),
        Row: ({ children, ...props }) => (
          <div className="scroll-my-1.5 px-1.5" {...props}>
            {children}
          </div>
        ),
        Emoji: ({ emoji, ...props }) => (
          <button
            className="flex size-8 items-center justify-center rounded-md text-lg transition-colors data-active:bg-accent"
            {...props}
          >
            {emoji.emoji}
          </button>
        ),
      }}
      {...props}
    />
  )
}

function EmojiPickerSkinToneSelector({
  className,
  ...props
}: React.ComponentProps<typeof EmojiPickerPrimitive.SkinToneSelector>) {
  return (
    <EmojiPickerPrimitive.SkinToneSelector
      className={cn(
        'flex size-7 items-center justify-center rounded-md text-sm transition-colors hover:bg-accent',
        className,
      )}
      {...props}
    />
  )
}

function EmojiPickerFooter({
  className,
  children,
  ...props
}: React.ComponentProps<'div'>) {
  return (
    <div
      className={cn(
        'flex items-center justify-between border-t px-2 py-1.5',
        className,
      )}
      {...props}
    >
      {children}
    </div>
  )
}

function EmojiPickerActiveEmoji({
  className,
  ...props
}: React.ComponentProps<typeof EmojiPickerPrimitive.ActiveEmoji> & { className?: string }) {
  return (
    <span
      className={cn(
        'min-w-0 truncate text-xs text-muted-foreground',
        className,
      )}
    >
      <EmojiPickerPrimitive.ActiveEmoji
        {...(props as React.ComponentProps<typeof EmojiPickerPrimitive.ActiveEmoji>)}
      />
    </span>
  )
}

export const EmojiPicker = Object.assign(EmojiPickerRoot, {
  Search: EmojiPickerSearch,
  Viewport: EmojiPickerViewport,
  Loading: EmojiPickerLoading,
  Empty: EmojiPickerEmpty,
  List: EmojiPickerList,
  SkinToneSelector: EmojiPickerSkinToneSelector,
  Footer: EmojiPickerFooter,
  ActiveEmoji: EmojiPickerActiveEmoji,
})
