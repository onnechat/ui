'use client'

import * as React from 'react'

import { RemoveScroll } from 'react-remove-scroll'

import { Dialog as DialogPrimitive } from '@base-ui/react/dialog'

import { Icon } from '@/components/icon'

import { cn } from '@/lib/cn'

import { ANIMATION } from '@/constants/animations'

function Dialog({ ...props }: DialogPrimitive.Root.Props) {
  // 'trap-focus' keeps focus containment without Base UI's body scroll lock —
  // scroll locking is handled by RemoveScroll in DialogOverlay.
  return <DialogPrimitive.Root data-slot="dialog" modal="trap-focus" {...props} />
}

function DialogTrigger({ ...props }: DialogPrimitive.Trigger.Props) {
  return (
    <DialogPrimitive.Trigger
      data-slot="dialog-trigger"
      className="cursor-pointer"
      {...props}
    />
  )
}

function DialogPortal({ ...props }: DialogPrimitive.Portal.Props) {
  return <DialogPrimitive.Portal data-slot="dialog-portal" {...props} />
}

function DialogClose({ ...props }: DialogPrimitive.Close.Props) {
  return <DialogPrimitive.Close data-slot="dialog-close" {...props} />
}

/** Backdrop scroll lock without `overflow: hidden` on body (avoids breaking sticky headers). */
function DialogOverlay({
  className,
  contentRef,
  scrollableRef,
  ...props
}: Omit<React.ComponentProps<'div'>, 'ref'> & {
  contentRef: React.RefObject<HTMLElement | null>
  /** Actual overflow container when content scroll lives inside the panel (not on `contentRef`). */
  scrollableRef?: React.RefObject<HTMLElement | null>
}) {
  const shards = React.useMemo(
    () => (scrollableRef ? [contentRef, scrollableRef] : [contentRef]),
    [contentRef, scrollableRef],
  )

  return (
    <RemoveScroll allowPinchZoom removeScrollBar={false} shards={shards}>
      <div
        data-slot="dialog-overlay"
        className={cn(
          'animate-in fade-in-0 duration-200 fixed inset-0 z-50 bg-black/80',
          className,
        )}
        {...props}
      />
    </RemoveScroll>
  )
}

function DialogContent({
  className,
  children,
  closeButton = false,
  closeButtonClassName,
  title = 'Title',
  overlay = true,
  scrollableRef,
  ...props
}: DialogPrimitive.Popup.Props & {
  closeButton?: boolean
  closeButtonClassName?: string
  title?: string
  overlay?: boolean
  scrollableRef?: React.RefObject<HTMLElement | null>
}) {
  const contentRef = React.useRef<HTMLDivElement>(null)

  return (
    <DialogPortal>
      {overlay && (
        <DialogOverlay contentRef={contentRef} scrollableRef={scrollableRef} />
      )}

      <DialogPrimitive.Popup
        ref={contentRef}
        data-slot="dialog-content"
        aria-describedby={props['aria-describedby'] || ''}
        initialFocus={() => {
          // Don't move focus into the dialog and drop focus from the trigger,
          // matching the previous blur-on-open behavior.
          if (document.activeElement instanceof HTMLElement) {
            document.activeElement.blur()
          }
          return contentRef.current
        }}
        className={cn(
          'bg-background fixed top-1/2 left-1/2 z-50 grid max-sm:h-dvh sm:max-h-[calc(100%-2rem)] w-full sm:max-w-[calc(100%-2rem)] -translate-x-1/2 -translate-y-1/2 gap-4 overflow-hidden sm:rounded-xl border p-6 shadow-lg',
          'transition-[transform,scale,opacity] ease-out',
          'data-starting-style:scale-98 data-starting-style:opacity-0',
          'data-ending-style:scale-98 data-ending-style:opacity-0',
          `duration-${ANIMATION.DURATION}`,
          className,
        )}
        {...props}
      >
        <DialogTitle className="sr-only">{title}</DialogTitle>

        {children}

        {closeButton && (
          <DialogPrimitive.Close
            className={cn(
              'group focus-visible:border-ring focus-visible:ring-ring/50 absolute top-3 right-3 flex size-7 items-center justify-center rounded transition-[color,box-shadow] outline-none cursor-pointer focus-visible:ring-[3px] disabled:pointer-events-none',
              closeButtonClassName,
            )}
          >
            <Icon
              name="Xmark"
              size={16}
              className="opacity-60 transition-opacity group-hover:opacity-100"
            />
            <span className="sr-only">{'close'}</span>
          </DialogPrimitive.Close>
        )}
      </DialogPrimitive.Popup>
    </DialogPortal>
  )
}

function DialogHeader({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="alert-dialog-header"
      className={cn('flex flex-col gap-1', className)}
      {...props}
    />
  )
}

function DialogFooter({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="alert-dialog-footer"
      className={cn(
        'flex flex-col-reverse gap-3 xs:flex-row xs:justify-end',
        className,
      )}
      {...props}
    />
  )
}

function DialogTitle({
  className,
  ...props
}: DialogPrimitive.Title.Props) {
  return (
    <DialogPrimitive.Title
      data-slot="alert-dialog-title"
      className={cn('text-lg sm:text-xl leading-none', className)}
      {...props}
    />
  )
}

function DialogDescription({
  className,
  ...props
}: DialogPrimitive.Description.Props) {
  return (
    <DialogPrimitive.Description
      data-slot="alert-dialog-description"
      className={cn('text-muted-foreground text-sm', className)}
      {...props}
    />
  )
}

export {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
  DialogTrigger,
}
