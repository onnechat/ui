'use client'

import * as React from 'react'

import { cn } from '@/lib/cn'

import { Icon } from '@/components/icon'

import { Button } from '@/components/ui/button'

type ScrollPosition = 'start' | 'end'

type MessageScrollerContextValue = {
  viewportRef: React.RefObject<HTMLDivElement>
  atEnd: boolean
  setAtEnd: (value: boolean) => void
  scrollToEnd: (behavior?: ScrollBehavior) => void
  scrollToStart: (behavior?: ScrollBehavior) => void
  scrollToMessage: (messageId: string, behavior?: ScrollBehavior) => void
  registerItem: (messageId: string, el: HTMLElement | null) => void
}

const MessageScrollerContext =
  React.createContext<MessageScrollerContextValue | null>(null)

function useScrollerContext() {
  const ctx = React.useContext(MessageScrollerContext)
  if (!ctx) {
    throw new Error(
      'MessageScroller parts must be used within <MessageScroller.Provider>.',
    )
  }
  return ctx
}

/** Imperative controls for the surrounding scroller. */
function useMessageScroller() {
  const { scrollToEnd, scrollToStart, scrollToMessage, atEnd } =
    useScrollerContext()
  return { scrollToEnd, scrollToStart, scrollToMessage, atEnd }
}

const AT_END_THRESHOLD = 24

function MessageScrollerProvider({
  autoScroll = false,
  defaultScrollPosition = 'end',
  children,
}: {
  /** Keep pinned to the bottom as new content streams in (while at the end). */
  autoScroll?: boolean
  /** Where to land on mount. */
  defaultScrollPosition?: ScrollPosition
  children?: React.ReactNode
}) {
  const viewportRef = React.useRef<HTMLDivElement>(null)
  const itemsRef = React.useRef(new Map<string, HTMLElement>())
  const [atEnd, setAtEnd] = React.useState(true)

  const scrollToEnd = React.useCallback((behavior: ScrollBehavior = 'smooth') => {
    const vp = viewportRef.current
    if (vp) vp.scrollTo({ top: vp.scrollHeight, behavior })
  }, [])

  const scrollToStart = React.useCallback(
    (behavior: ScrollBehavior = 'smooth') => {
      viewportRef.current?.scrollTo({ top: 0, behavior })
    },
    [],
  )

  const scrollToMessage = React.useCallback(
    (messageId: string, behavior: ScrollBehavior = 'smooth') => {
      itemsRef.current
        .get(messageId)
        ?.scrollIntoView({ behavior, block: 'start' })
    },
    [],
  )

  const registerItem = React.useCallback(
    (messageId: string, el: HTMLElement | null) => {
      if (el) itemsRef.current.set(messageId, el)
      else itemsRef.current.delete(messageId)
    },
    [],
  )

  // Land at the requested edge on mount (no animation).
  React.useLayoutEffect(() => {
    const vp = viewportRef.current
    if (!vp) return
    vp.scrollTop = defaultScrollPosition === 'end' ? vp.scrollHeight : 0
  }, [defaultScrollPosition])

  // Auto-scroll: while the user is at the bottom, follow content growth.
  React.useEffect(() => {
    if (!autoScroll) return
    const vp = viewportRef.current
    const content = vp?.firstElementChild
    if (!vp || !content) return
    const ro = new ResizeObserver(() => {
      if (atEnd) vp.scrollTo({ top: vp.scrollHeight })
    })
    ro.observe(content)
    return () => ro.disconnect()
  }, [autoScroll, atEnd])

  const value = React.useMemo<MessageScrollerContextValue>(
    () => ({
      viewportRef,
      atEnd,
      setAtEnd,
      scrollToEnd,
      scrollToStart,
      scrollToMessage,
      registerItem,
    }),
    [atEnd, scrollToEnd, scrollToStart, scrollToMessage, registerItem],
  )

  return (
    <MessageScrollerContext.Provider value={value}>
      {children}
    </MessageScrollerContext.Provider>
  )
}

/** The styled frame; lay Viewport + Button inside a Provider. */
function MessageScrollerRoot({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="message-scroller"
      className={cn('relative flex min-h-0 flex-col', className)}
      {...props}
    />
  )
}

function MessageScrollerViewport({
  className,
  onScroll,
  ...props
}: React.ComponentProps<'div'>) {
  const ctx = useScrollerContext()
  return (
    <div
      ref={ctx.viewportRef}
      data-slot="message-scroller-viewport"
      role="region"
      aria-label="Mensagens"
      tabIndex={0}
      onScroll={e => {
        const el = e.currentTarget
        ctx.setAtEnd(
          el.scrollHeight - el.scrollTop - el.clientHeight < AT_END_THRESHOLD,
        )
        onScroll?.(e)
      }}
      className={cn('scroll-fade-y min-h-0 flex-1 overflow-y-auto', className)}
      {...props}
    />
  )
}

function MessageScrollerContent({
  className,
  'aria-busy': ariaBusy,
  ...props
}: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="message-scroller-content"
      role="log"
      aria-relevant="additions"
      aria-busy={ariaBusy}
      className={cn('flex flex-col gap-4 p-4', className)}
      {...props}
    />
  )
}

function MessageScrollerItem({
  messageId,
  scrollAnchor,
  className,
  ...props
}: React.ComponentProps<'div'> & {
  messageId: string
  scrollAnchor?: boolean
}) {
  const ctx = useScrollerContext()
  const ref = React.useCallback(
    (el: HTMLElement | null) => ctx.registerItem(messageId, el),
    [ctx, messageId],
  )
  return (
    <div
      ref={ref}
      data-slot="message-scroller-item"
      data-message-id={messageId}
      data-anchor={scrollAnchor || undefined}
      className={cn('scroll-mt-4', className)}
      {...props}
    />
  )
}

/** Jump-to-latest control; fades in when the user scrolls up. */
function MessageScrollerButton({
  className,
  ...props
}: React.ComponentProps<typeof Button>) {
  const ctx = useScrollerContext()
  return (
    <Button
      data-slot="message-scroller-button"
      data-active={!ctx.atEnd}
      variant="secondary"
      size="icon"
      aria-label="Ir para a última mensagem"
      onClick={() => ctx.scrollToEnd()}
      className={cn(
        'absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full shadow-md transition-opacity',
        ctx.atEnd ? 'pointer-events-none opacity-0' : 'opacity-100',
        className,
      )}
      {...props}
    >
      <Icon name="ChevronDown" />
    </Button>
  )
}

const MessageScroller = Object.assign(MessageScrollerRoot, {
  Provider: MessageScrollerProvider,
  Viewport: MessageScrollerViewport,
  Content: MessageScrollerContent,
  Item: MessageScrollerItem,
  Button: MessageScrollerButton,
})

export { MessageScroller, useMessageScroller }
