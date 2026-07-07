'use client'

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useId,
  useMemo,
  useState,
} from 'react'

import { create } from 'zustand'

import { cn } from '@/lib/cn'

import { useIsMobile } from '@/hooks/use-mobile'

import { Icon } from '@/components/icon'

import { Button, type ButtonVariants } from '@/components/ui/button'
import {
  Dialog as UiDialog,
  DialogContent as UiDialogContent,
  DialogDescription as UiDialogDescription,
  DialogFooter as UiDialogFooter,
  DialogHeader as UiDialogHeader,
  DialogTitle as UiDialogTitle,
} from '@/components/internal/dialog'

export const useDialog = create<DialogStore>((set) => ({
  isOpen: false,
  open: () => set({ isOpen: true }),
  close: () => set({ isOpen: false }),
  toggle: () => set((state) => ({ isOpen: !state.isOpen })),
}))

interface DialogStore {
  isOpen: boolean
  open: () => void
  close: () => void
  toggle: () => void
}

interface DialogStackContextType {
  activeIndex: number
  register: (id: string, order?: number) => number
  unregister: (id: string) => void
  goTo: (index: number) => void
  next: () => void
  back: () => void
  total: number
}

const DialogStackContext = createContext<DialogStackContextType | null>(null)

export const useDialogStack = () => {
  const context = useContext(DialogStackContext)

  if (!context) {
    throw new Error('useDialogStack must be used within a DialogStack')
  }

  return context
}

export function DialogStack({
  children,
  defaultIndex = 0,
  onIndexChange,
}: {
  children: React.ReactNode
  defaultIndex?: number
  onIndexChange?: (index: number) => void
}) {
  const [activeIndex, setActiveIndex] = useState(defaultIndex)
  const [items, setItems] = useState<{ id: string; order: number | null }[]>([])

  const register = useCallback((id: string, order?: number) => {
    setItems((prev) => {
      if (prev.find((item) => item.id === id)) return prev
      const newItems = [...prev, { id, order: order ?? null }]
      return newItems
    })

    return order ?? 0
  }, [])

  const unregister = useCallback((id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id))
  }, [])

  const goTo = useCallback(
    (index: number) => {
      setActiveIndex(index)
      onIndexChange?.(index)
    },
    [onIndexChange],
  )

  const next = useCallback(() => {
    setActiveIndex((prev) => {
      const nextIndex = prev + 1
      onIndexChange?.(nextIndex)
      return nextIndex
    })
  }, [onIndexChange])

  const back = useCallback(() => {
    setActiveIndex((prev) => {
      const prevIndex = Math.max(0, prev - 1)
      onIndexChange?.(prevIndex)
      return prevIndex
    })
  }, [onIndexChange])

  const value = useMemo(
    () => ({
      activeIndex,
      register,
      unregister,
      goTo,
      next,
      back,
      total: items.length,
    }),
    [activeIndex, register, unregister, goTo, next, back, items.length],
  )

  return (
    <DialogStackContext.Provider value={value}>
      {children}
    </DialogStackContext.Provider>
  )
}

function Dialog({
  title,
  description,
  actions: actionsProp,
  isOpen,
  onOpenChange,
  style,
  className,
  overlay = true,
  children,
  order,
  removeOverlay = false,
  notRelative = false,
  showDescription = false,
  classNames,
  hideMobileFooterClose = false,
}: {
  title?: string | React.ReactNode
  description?: string
  actions?:
    | {
        className?: string
        variant?: ButtonVariants
        label: string
        onClick: () => void
        disabled?: boolean
        isLoading?: boolean
      }[]
    | null
    | undefined
  className?: string
  children: React.ReactNode
  isOpen?: boolean
  onOpenChange?: (open: boolean) => void
  style?: React.CSSProperties
  overlay?: boolean
  order?: number
  offset?: number
  removeOverlay?: boolean
  notRelative?: boolean
  showDescription?: boolean
  /** Mobile: do not prepend the default “Close” button next to `actions` (header X still closes). */
  hideMobileFooterClose?: boolean
  classNames?: {
    container?: string
    content?: string
    header?: string
    description?: string
    footer?: string
  }
}) {
  const isMobile = useIsMobile()

  const globalDialog = useDialog()
  const stack = useContext(DialogStackContext)

  const id = useId()

  const scrollableContentRef = React.useRef<HTMLDivElement>(null)

  const [stackOrder, setStackOrder] = useState<number | null>(order ?? null)

  let isBehind = false
  let dialogOpen = isOpen !== undefined ? isOpen : globalDialog.isOpen

  let stackStyle: React.CSSProperties = {}

  const handleClose = () => {
    if (stack) {
      if (stack.activeIndex > 0) {
        if (onOpenChange) {
          onOpenChange(false)
        } else {
          stack.back()
        }

        return
      }
    }

    if (onOpenChange) {
      onOpenChange(false)
    } else {
      globalDialog.close()
    }
  }

  const finalStyle = { ...style, ...stackStyle }
  const closeLabel = 'close'

  const mobileCloseAction: {
    variant: 'default'
    label: string
    onClick: () => void
    className: string
    disabled?: boolean
    isLoading?: boolean
  } = {
    variant: 'default',
    label: closeLabel,
    onClick: handleClose,
    className: 'mr-auto',
  }

  const actions = (() => {
    if (!isMobile || hideMobileFooterClose) {
      if (actionsProp === null) return null
      return actionsProp ?? undefined
    }

    if (actionsProp === null || actionsProp === undefined) {
      return [mobileCloseAction]
    }

    if (actionsProp.length === 0) {
      return [mobileCloseAction]
    }

    if (actionsProp.some((a) => a.label === closeLabel)) {
      return actionsProp
    }

    return [mobileCloseAction, ...actionsProp]
  })()

  if (stack) {
    const targetOrder = order ?? stackOrder ?? 0

    if (targetOrder !== null) {
      dialogOpen = stack.activeIndex >= targetOrder

      const distanceFromActive = targetOrder - stack.activeIndex

      isBehind = distanceFromActive < 0

      if (distanceFromActive <= 0) {
        // Horizontal “carousel”: previous steps sit one panel width to the left
        // instead of scaling/grayscale stacking behind the active step.
        stackStyle = {
          top: '50%',
          left: '50%',
          transform: `translate(-50%, -50%) translateX(calc(${distanceFromActive} * 100%))`,
          zIndex: 50 + targetOrder,
          position: 'fixed',
          pointerEvents: distanceFromActive === 0 ? 'auto' : 'none',
          transition: 'transform 300ms cubic-bezier(0.32, 0.72, 0, 1)',
        }
      } else {
        dialogOpen = false
      }
    }
  }

  useEffect(() => {
    if (stack) {
      const assigned = stack.register(id, order)

      if (order === undefined) {
        setStackOrder(assigned)
      }

      return () => stack.unregister(id)
    }
  }, [stack?.register, stack?.unregister, id, order, stack])

  return (
    <UiDialog
      open={dialogOpen}
      onOpenChange={(open) => {
        if (!open) handleClose()
      }}
    >
      <UiDialogContent
        style={finalStyle}
        overlay={removeOverlay ? false : overlay}
        scrollableRef={scrollableContentRef}
        className={cn(
          'p-0 gap-0 max-w-2xl! bg-card border-none outline-none max-h-dvh max-sm:px-1 sm:p-1 sm:rounded-2xl group w-full flex min-h-0 flex-col overflow-hidden flex-1',
          !(actions && actions.length > 0) && 'max-sm:pb-1',
          stack && 'will-change-transform',
          className,
          classNames?.container,
        )}
      >
        {(title || description) && (
          <UiDialogHeader
            className={cn(
              'max-sm:px-4 max-sm:py-6 sm:p-4 rounded-t-xl shrink-0 gap-3 flex flex-row items-center justify-between',
              classNames?.header,
            )}
          >
            <div className="flex flex-col gap-1">
              {title && <UiDialogTitle>{title}</UiDialogTitle>}

              {description && (
                <UiDialogDescription
                  className={cn(!showDescription && 'sr-only')}
                >
                  {description}
                </UiDialogDescription>
              )}
            </div>

            <Button
              variant="ghost"
              onClick={handleClose}
              aria-label={'close'}
              className="ml-auto rounded-md p-1 bg-muted/50 hover:bg-muted hover:opacity-100 text-muted-foreground"
            >
              <Icon name="Xmark" className="size-4" />
            </Button>
          </UiDialogHeader>
        )}

        <div
          ref={scrollableContentRef}
          {...(isBehind ? { inert: true } : {})}
          className={cn(
            'p-4 w-full bg-muted text-card-foreground flex min-h-0 flex-col gap-4 rounded-xl overflow-y-auto overflow-x-hidden flex-1',
            isBehind && 'pointer-events-none select-none',
            isBehind && !stack && 'opacity-0',
            !stack && 'transition-opacity duration-300',
            !notRelative && 'relative',
            classNames?.content,
          )}
        >
          {children}
        </div>

        {actions && actions.length > 0 && (
          <UiDialogFooter
            className={cn('flex-row justify-end p-4 rounded-b-xl shrink-0', classNames?.footer)}
          >
            {actions.map((action) => (
              <Button
                key={action.label}
                onClick={action.onClick}
                variant={action.variant}
                disabled={action.disabled}
                className={action.className}
                isLoading={action.isLoading}
              >
                {action.label}
              </Button>
            ))}
          </UiDialogFooter>
        )}
      </UiDialogContent>
    </UiDialog>
  )
}

export { Dialog }
