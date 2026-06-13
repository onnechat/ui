'use client'

import * as React from 'react'

import { AnimatePresence, motion } from 'motion/react'
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

  return (
    <AnimatePresence initial={false}>
      {open && (
        <motion.div
          key="collapsible-panel"
          id={contentId}
          role="region"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: ANIMATION.DURATION_FLOAT }}
          data-slot="collapsible-content"
          className={cn(
            'overflow-hidden',
            collapsibleContentVariants({ variant }),
            className,
          )}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
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
