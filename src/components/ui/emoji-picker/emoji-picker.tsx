'use client'

import * as React from 'react'

import { EmojiPicker as EmojiPickerPrimitive } from 'frimousse'

import { Icon } from '@/components/icon'

import { cn } from '@/lib/cn'

function EmojiPickerRoot({
  className,
  ...props
}: React.ComponentProps<typeof EmojiPickerPrimitive.Root>) {
  return (
    <EmojiPickerPrimitive.Root
      data-slot="emoji-picker"
      className={cn(
        'isolate flex h-[368px] w-fit flex-col overflow-hidden rounded-xl bg-muted text-foreground [--card-content-padding:1rem]',
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
    <div
      data-slot="emoji-picker-search-wrapper"
      className="flex h-14 shrink-0 items-center gap-4 px-(--card-content-padding)"
    >
      <Icon name="Magnifier" className="size-4 shrink-0 opacity-50" />

      <EmojiPickerPrimitive.Search
        data-slot="emoji-picker-search"
        className={cn(
          'flex h-10 w-full bg-transparent py-3 text-sm outline-hidden placeholder:text-muted-foreground/50 disabled:cursor-not-allowed disabled:opacity-50',
          '[&::-webkit-search-cancel-button]:hidden',
          className,
        )}
        placeholder={'Search emoji...'}
        {...props}
      />
    </div>
  )
}

function EmojiPickerViewport({
  className,
  ...props
}: React.ComponentProps<typeof EmojiPickerPrimitive.Viewport>) {
  return (
    <EmojiPickerPrimitive.Viewport
      data-slot="emoji-picker-viewport"
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
      data-slot="emoji-picker-loading"
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
      data-slot="emoji-picker-empty"
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
      data-slot="emoji-picker-list"
      className={cn('select-none pb-1.5', className)}
      components={{
        CategoryHeader: ({ category, ...props }) => (
          <div
            data-slot="emoji-picker-category-header"
            className="bg-muted px-3 pt-3 pb-1.5 text-xs font-medium uppercase text-muted-foreground/50"
            {...props}
          >
            {category.label}
          </div>
        ),
        Row: ({ children, ...props }) => (
          <div
            data-slot="emoji-picker-row"
            className="scroll-my-1.5 px-1.5"
            {...props}
          >
            {children}
          </div>
        ),
        Emoji: ({ emoji, ...props }) => (
          <button
            data-slot="emoji-picker-emoji"
            className="flex size-8 cursor-pointer items-center justify-center rounded-lg text-lg transition-colors data-active:bg-accent data-active:text-accent-foreground"
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
      data-slot="emoji-picker-skin-tone-selector"
      className={cn(
        'flex size-7 cursor-pointer items-center justify-center rounded-lg text-sm transition-colors hover:bg-accent',
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
      data-slot="emoji-picker-footer"
      className={cn(
        'flex shrink-0 items-center justify-between px-(--card-content-padding) py-2',
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
      data-slot="emoji-picker-active-emoji"
      className={cn('min-w-0 truncate text-xs text-muted-foreground', className)}
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
