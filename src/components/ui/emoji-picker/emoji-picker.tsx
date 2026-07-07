'use client'

import * as React from 'react'

import { EmojiPicker as EmojiPickerPrimitive } from 'frimousse'

import { Icon, type IconType } from '@/components/icon'

import { cn } from '@/lib/cn'

const EmojiPickerContext = React.createContext<{
  rootRef: React.RefObject<HTMLDivElement | null>
} | null>(null)

function EmojiPickerRoot({
  className,
  ...props
}: React.ComponentProps<typeof EmojiPickerPrimitive.Root>) {
  const rootRef = React.useRef<HTMLDivElement>(null)

  return (
    <EmojiPickerContext.Provider value={{ rootRef }}>
      <EmojiPickerPrimitive.Root
        ref={rootRef}
        data-slot="emoji-picker"
        className={cn(
          'isolate flex h-[368px] w-fit flex-col overflow-hidden rounded-xl bg-muted text-foreground [--card-content-padding:1rem]',
          className,
        )}
        {...props}
      />
    </EmojiPickerContext.Provider>
  )
}

/**
 * Emojibase groups in their canonical order — the order in which
 * `EmojiPicker.List` renders category sections. Used to map each category
 * button to the matching (index-aligned) section header for scrolling.
 */
const EMOJI_CATEGORIES: { label: string; icon: IconType }[] = [
  { label: 'Smileys & Emotion', icon: 'FaceSmile' },
  { label: 'People & Body', icon: 'HandWave' },
  { label: 'Animals & Nature', icon: 'Paw' },
  { label: 'Food & Drink', icon: 'Coffee' },
  { label: 'Travel & Places', icon: 'Globe' },
  { label: 'Activities', icon: 'Trophy' },
  { label: 'Objects', icon: 'Lightbulb' },
  { label: 'Symbols', icon: 'Heart' },
  { label: 'Flags', icon: 'Flag' },
]

/**
 * Opt-in category strip. Add it inside `EmojiPicker` (e.g. below `Search`) to
 * jump between category sections; it also highlights the section in view.
 */
function EmojiPickerCategorySelector({
  className,
  ...props
}: React.ComponentProps<'div'>) {
  const ctx = React.useContext(EmojiPickerContext)
  const [activeIndex, setActiveIndex] = React.useState(0)

  const getParts = React.useCallback(() => {
    const root = ctx?.rootRef.current
    const viewport = root?.querySelector<HTMLElement>('[frimousse-viewport]')
    if (!viewport) return null

    // Real section wrappers only — the (aria-hidden) sizer nests its header
    // deeper, so a direct-child match excludes it.
    const sections = Array.from(
      viewport.querySelectorAll<HTMLElement>('[frimousse-category]'),
    ).filter((el) =>
      el.querySelector(':scope > [data-slot="emoji-picker-category-header"]'),
    )

    return { viewport, sections }
  }, [ctx])

  React.useEffect(() => {
    const parts = getParts()
    if (!parts) return

    const { viewport } = parts

    const onScroll = () => {
      const current = getParts()
      if (!current) return

      const viewportTop = current.viewport.getBoundingClientRect().top

      let next = 0
      current.sections.forEach((section, index) => {
        if (section.getBoundingClientRect().top - viewportTop <= 8) next = index
      })

      setActiveIndex(next)
    }

    viewport.addEventListener('scroll', onScroll, { passive: true })
    onScroll()

    return () => viewport.removeEventListener('scroll', onScroll)
  }, [getParts])

  const scrollToCategory = (index: number) => {
    const parts = getParts()
    const target = parts?.sections[index]
    if (!parts || !target) return

    const delta =
      target.getBoundingClientRect().top -
      parts.viewport.getBoundingClientRect().top

    parts.viewport.scrollTo({
      top: parts.viewport.scrollTop + delta,
      behavior: 'smooth',
    })
    setActiveIndex(index)
  }

  return (
    <div
      data-slot="emoji-picker-category-selector"
      className={cn(
        'flex shrink-0 items-center gap-0.5 px-1.5 pt-1.5',
        className,
      )}
      {...props}
    >
      {EMOJI_CATEGORIES.map((category, index) => (
        <button
          key={category.label}
          type="button"
          aria-label={category.label}
          title={category.label}
          data-active={activeIndex === index ? '' : undefined}
          onClick={() => scrollToCategory(index)}
          className="flex flex-1 cursor-pointer items-center justify-center rounded-lg p-1.5 text-muted-foreground/50 transition-colors hover:bg-accent hover:text-foreground data-active:bg-accent data-active:text-foreground"
        >
          <Icon name={category.icon} className="size-4" />
        </button>
      ))}
    </div>
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
  CategorySelector: EmojiPickerCategorySelector,
  Viewport: EmojiPickerViewport,
  Loading: EmojiPickerLoading,
  Empty: EmojiPickerEmpty,
  List: EmojiPickerList,
  SkinToneSelector: EmojiPickerSkinToneSelector,
  Footer: EmojiPickerFooter,
  ActiveEmoji: EmojiPickerActiveEmoji,
})
