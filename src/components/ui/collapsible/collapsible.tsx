'use client'

import * as React from 'react'

import { cva, type VariantProps } from 'class-variance-authority'

import { cn } from '@/lib/cn'

import { ANIMATION } from '@/constants/animations'

const collapsibleRootVariants = cva('w-full', {
  variants: {
    variant: {
      row: '',
      card: 'rounded-lg bg-card',
    },
  },
  defaultVariants: {
    variant: 'card',
  },
})

/** Extra styles on top of {@link SettingsItem} for the collapsible trigger. */
const collapsibleTriggerSettingsOverlayVariants = cva(
  [
    'group w-full outline-none transition-colors',
    'focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring cursor-pointer',
    'disabled:pointer-events-none disabled:opacity-50 disabled:grayscale',
  ],
  {
    variants: {
      variant: {
        row: '',
        card: 'hover:bg-muted/50 rounded-lg data-[state=open]:rounded-b-none',
      },
    },
    defaultVariants: {
      variant: 'card',
    },
  },
)

const collapsibleContentVariants = cva('min-h-0', {
  variants: {
    variant: {
      row: '',
      card: 'border-t border-border/50 px-4 pb-4 pt-4',
    },
  },
  defaultVariants: {
    variant: 'card',
  },
})

type CollapsibleAlign = 'center' | 'start' | null | undefined

type CollapsibleContextValue = VariantProps<typeof collapsibleRootVariants> & {
  align: CollapsibleAlign
  open: boolean
  setOpen: (next: boolean) => void
  contentId: string
  disabled: boolean
}

const CollapsibleContext = React.createContext<CollapsibleContextValue | null>(
  null,
)

function useCollapsibleContext(component: string) {
  const ctx = React.useContext(CollapsibleContext)
  if (!ctx) {
    throw new Error(`${component} must be used within <Collapsible>`)
  }
  return ctx
}

/** Read open state from a parent {@link Collapsible} (e.g. custom chevron in the trigger action). */
function useCollapsibleOpen() {
  return useCollapsibleContext('useCollapsibleOpen').open
}

/** Returns null when not inside {@link Collapsible}; use from {@link SettingsItem} with `collapsibleTrigger`. */
function useOptionalCollapsibleContext() {
  return React.useContext(CollapsibleContext)
}

function Collapsible({
  className,
  variant = 'card',
  align = 'start',
  open: openProp,
  defaultOpen,
  onOpenChange,
  /** When set (uncontrolled only), keeps the panel open — e.g. inner switch is on. */
  expandWhen,
  disabled = false,
  children,
  ...props
}: React.ComponentProps<'div'> &
  VariantProps<typeof collapsibleRootVariants> & {
    align?: CollapsibleAlign
    open?: boolean
    defaultOpen?: boolean
    onOpenChange?: (open: boolean) => void
    expandWhen?: boolean
    disabled?: boolean
  }) {
  const contentId = React.useId()
  const isControlled = openProp !== undefined
  const [uncontrolledOpen, setUncontrolledOpen] = React.useState(
    defaultOpen ?? false,
  )

  const open = isControlled
    ? Boolean(openProp)
    : Boolean(expandWhen) || uncontrolledOpen

  const setOpen = React.useCallback(
    (next: boolean) => {
      if (disabled) return
      if (!isControlled) {
        if (next) {
          setUncontrolledOpen(true)
        } else {
          setUncontrolledOpen(false)
        }
      }
      onOpenChange?.(next)
    },
    [disabled, isControlled, onOpenChange],
  )

  const contextValue = React.useMemo(
    () => ({
      variant,
      align,
      open,
      setOpen,
      contentId,
      disabled,
    }),
    [variant, align, open, setOpen, contentId, disabled],
  )

  return (
    <CollapsibleContext.Provider value={contextValue}>
      <div
        data-slot="collapsible"
        data-state={open ? 'open' : 'closed'}
        className={cn(collapsibleRootVariants({ variant }), className)}
        {...props}
      >
        {children}
      </div>
    </CollapsibleContext.Provider>
  )
}

function CollapsibleContent({
  className,
  children,
}: {
  className?: string
  children?: React.ReactNode
}) {
  const { variant, open, contentId } =
    useCollapsibleContext('CollapsibleContent')
  const contentRef = React.useRef<HTMLDivElement>(null)
  const [measuredHeight, setMeasuredHeight] = React.useState(0)
  const [animating, setAnimating] = React.useState(false)

  React.useEffect(() => {
    const el = contentRef.current
    if (!el) return

    const ro = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const h = entry.target.scrollHeight
        if (h > 0) setMeasuredHeight(h)
      }
    })
    ro.observe(el)

    const initialH = el.scrollHeight
    if (initialH > 0) setMeasuredHeight(initialH)

    return () => ro.disconnect()
  }, [])

  React.useEffect(() => {
    if (open) setAnimating(true)
  }, [open])

  const height = open ? measuredHeight : 0

  const isCard = variant === 'card'

  return (
    <div
      id={contentId}
      role="region"
      data-slot="collapsible-content"
      style={{
        height,
        overflow: 'hidden',
        opacity: open ? 1 : 0,
        transition: `height ${ANIMATION.DURATION_FLOAT}s ease-in-out, opacity ${ANIMATION.DURATION_FLOAT / 2}s ease`,
        transitionDelay: open ? `0s, ${ANIMATION.DURATION_FLOAT / 2}s` : '0s, 0s',
      }}
      onTransitionEnd={() => {
        if (!open) setAnimating(false)
      }}
      className={cn(className)}
    >
      <div
        ref={contentRef}
        className={cn(
          isCard && 'border-t border-border/50 px-4 pb-4 pt-4',
        )}
      >
        {children}
      </div>
    </div>
  )
}

export {
  Collapsible,
  CollapsibleContent,
  collapsibleContentVariants,
  collapsibleRootVariants,
  collapsibleTriggerSettingsOverlayVariants,
  useCollapsibleOpen,
  useOptionalCollapsibleContext,
}
