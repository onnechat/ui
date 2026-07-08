'use client'

import { Drawer as DrawerPrimitive } from 'vaul'

import * as React from 'react'

import { cn } from '@/lib/cn'

/**
 * Move focus into the drawer panel when it opens so the trigger is not left
 * focused while Radix applies aria-hidden on page roots (avoids console warnings).
 */
function focusFirstFocusableInDrawer(container: HTMLElement) {
  const el = container.querySelector<HTMLElement>(
    [
      'a[href]',
      'button:not([disabled])',
      'input:not([disabled]):not([type="hidden"])',
      'select:not([disabled])',
      'textarea:not([disabled])',
      '[tabindex]:not([tabindex="-1"])',
    ].join(','),
  )
  el?.focus()
}

function DrawerRoot({
  ...props
}: React.ComponentProps<typeof DrawerPrimitive.Root>) {
  return <DrawerPrimitive.Root data-slot="drawer" {...props} />
}

function DrawerTrigger({
  ...props
}: React.ComponentProps<typeof DrawerPrimitive.Trigger>) {
  return (
    <DrawerPrimitive.Trigger
      data-slot="drawer-trigger"
      className="cursor-pointer"
      {...props}
    />
  )
}

function DrawerPortal({
  ...props
}: React.ComponentProps<typeof DrawerPrimitive.Portal>) {
  return <DrawerPrimitive.Portal data-slot="drawer-portal" {...props} />
}

function DrawerClose({
  ...props
}: React.ComponentProps<typeof DrawerPrimitive.Close>) {
  return (
    <DrawerPrimitive.Close
      data-slot="drawer-close"
      className="cursor-pointer"
      {...props}
    />
  )
}

function DrawerOverlay({
  className,
  ...props
}: React.ComponentProps<typeof DrawerPrimitive.Overlay>) {
  return (
    <DrawerPrimitive.Overlay
      data-slot="drawer-overlay"
      className={cn(
        'data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 z-50 bg-black/50',
        className,
      )}
      {...props}
    />
  )
}

function DrawerContent({
  className,
  children,
  title = 'Title',
  showDivider = false,
  rounded = true,
  onOpenAutoFocus,
  ...props
}: React.ComponentProps<typeof DrawerPrimitive.Content> & {
  title?: string
  showDivider?: boolean
  rounded?: boolean
}) {
  const handleOpenAutoFocus = React.useCallback(
    (event: Event) => {
      onOpenAutoFocus?.(
        event as Parameters<
          NonNullable<
            React.ComponentProps<
              typeof DrawerPrimitive.Content
            >['onOpenAutoFocus']
          >
        >[0],
      )
      if (event.defaultPrevented) return

      event.preventDefault()
      const root = event.currentTarget
      if (root instanceof HTMLElement) {
        focusFirstFocusableInDrawer(root)
      }
    },
    [onOpenAutoFocus],
  )

  return (
    <DrawerPortal data-slot="drawer-portal">
      <DrawerOverlay />

      <DrawerPrimitive.Content
        data-slot="drawer-content"
        aria-describedby={undefined}
        onOpenAutoFocus={handleOpenAutoFocus}
        className={cn(
          // vaul applies its drag/open transform directly to this element — it must
          // stay free of `overflow`/`border-radius` itself. Chromium can fail to
          // clip a rounded, overflow-hidden box to its curve while that same box is
          // being actively transformed (the exact bug that made the desktop
          // DropdownMenu popup flash square-cornered while animating with `filter`).
          // The visual rounding/clipping lives on the inner wrapper below instead,
          // which never carries a transform of its own.
          'group/drawer-content fixed z-50 flex h-auto flex-col ring-0 focus:ring-0',
          'data-[vaul-drawer-direction=top]:inset-x-0 data-[vaul-drawer-direction=top]:top-0 data-[vaul-drawer-direction=top]:mb-24 data-[vaul-drawer-direction=top]:max-h-[80vh]',
          'data-[vaul-drawer-direction=bottom]:inset-x-0 data-[vaul-drawer-direction=bottom]:bottom-0 data-[vaul-drawer-direction=bottom]:mt-24 data-[vaul-drawer-direction=bottom]:max-h-[80vh]',
          'data-[vaul-drawer-direction=right]:inset-y-0 data-[vaul-drawer-direction=right]:right-0 data-[vaul-drawer-direction=right]:w-3/4 data-[vaul-drawer-direction=right]:sm:max-w-sm',
          'data-[vaul-drawer-direction=left]:inset-y-0 data-[vaul-drawer-direction=left]:left-0 data-[vaul-drawer-direction=left]:w-3/4 data-[vaul-drawer-direction=left]:sm:max-w-sm',
        )}
        {...props}
      >
        <div
          className={cn(
            'bg-background flex h-full min-h-0 w-full flex-1 flex-col overflow-hidden',
            rounded &&
              'group-data-[vaul-drawer-direction=top]/drawer-content:rounded-b-lg group-data-[vaul-drawer-direction=bottom]/drawer-content:rounded-t-lg',
            'group-data-[vaul-drawer-direction=top]/drawer-content:border-b',
            'group-data-[vaul-drawer-direction=bottom]/drawer-content:border-t',
            'group-data-[vaul-drawer-direction=right]/drawer-content:border-l',
            'group-data-[vaul-drawer-direction=left]/drawer-content:border-r',
            className,
          )}
        >
          <DrawerTitle className="sr-only">{title}</DrawerTitle>

          {showDivider && (
            <div className="bg-ring/25 mx-auto mt-4 hidden h-2 w-1/5 shrink-0 rounded-full group-data-[vaul-drawer-direction=bottom]/drawer-content:block" />
          )}
          {children}
        </div>
      </DrawerPrimitive.Content>
    </DrawerPortal>
  )
}

function DrawerHeader({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="drawer-header"
      className={cn(
        'flex flex-col gap-0.5 p-4 group-data-[vaul-drawer-direction=bottom]/drawer-content:text-center group-data-[vaul-drawer-direction=top]/drawer-content:text-center md:gap-1.5 md:text-left',
        className,
      )}
      {...props}
    />
  )
}

function DrawerFooter({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="drawer-footer"
      className={cn('mt-auto flex flex-col gap-2 p-4', className)}
      {...props}
    />
  )
}

function DrawerTitle({
  className,
  ...props
}: React.ComponentProps<typeof DrawerPrimitive.Title>) {
  return (
    <DrawerPrimitive.Title
      data-slot="drawer-title"
      className={cn('text-foreground font-semibold', className)}
      {...props}
    />
  )
}

function DrawerDescription({
  className,
  ...props
}: React.ComponentProps<typeof DrawerPrimitive.Description>) {
  return (
    <DrawerPrimitive.Description
      data-slot="drawer-description"
      className={cn('text-muted-foreground text-sm', className)}
      {...props}
    />
  )
}

const Drawer = Object.assign(DrawerRoot, {
  Close: DrawerClose,
  Content: DrawerContent,
  Description: DrawerDescription,
  Footer: DrawerFooter,
  Header: DrawerHeader,
  Overlay: DrawerOverlay,
  Portal: DrawerPortal,
  Title: DrawerTitle,
  Trigger: DrawerTrigger,
})
export { Drawer }
