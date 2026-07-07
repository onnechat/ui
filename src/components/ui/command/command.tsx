'use client'

import { Command as CommandPrimitive } from 'cmdk'

import * as React from 'react'

import { Icon } from '@/components/icon'

import { cn } from '@/lib/cn'

import {
  Dialog,
  DialogContent,
  DialogDescription,
} from '@/components/internal/dialog'

import { Kbd } from '@/components/ui/kbd'

function CommandRoot({
  className,
  ...props
}: React.ComponentProps<typeof CommandPrimitive>) {
  return (
    <CommandPrimitive
      data-slot="command"
      className={cn(
        'flex h-full w-full flex-col overflow-hidden rounded-xl bg-muted text-foreground [--card-content-padding:1rem]',
        '**:data-[slot=command-input-wrapper]:flex **:data-[slot=command-input-wrapper]:min-h-14 **:data-[slot=command-input-wrapper]:items-center',
        '**:[[cmdk-group-heading]]:text-xs **:[[cmdk-group-heading]]:font-medium **:[[cmdk-group-heading]]:uppercase **:[[cmdk-group-heading]]:text-muted-foreground/50',
        '**:[[cmdk-group]]:px-(--card-content-padding)! **:[[cmdk-group]:not([hidden])_~[cmdk-group]]:pt-0',
        '**:[[cmdk-input-wrapper]_svg]:h-5 **:[[cmdk-input-wrapper]_svg]:w-5 **:[[cmdk-input]]:h-12',
        '**:[[cmdk-item]]:gap-3 **:[[cmdk-item]]:px-3 **:[[cmdk-item]]:py-3 **:[[cmdk-item]]:rounded-lg **:[[cmdk-item]_svg]:h-5 **:[[cmdk-item]_svg]:w-5',
        className,
      )}
      {...props}
    />
  )
}

function CommandDialog({
  title = 'Command Palette',
  description = 'Search for a command to run...',
  children,
  className,
  commandClassName,
  closeButtonClassName,
  showCloseButton = true,
  filter,
  ...props
}: Omit<React.ComponentProps<typeof Dialog>, 'children'> & {
  children?: React.ReactNode
  title?: string
  description?: string
  className?: string
  commandClassName?: string
  closeButtonClassName?: string
  showCloseButton?: boolean
  filter?: React.ComponentProps<typeof CommandPrimitive>['filter']
}) {
  return (
    <Dialog {...props}>
      <DialogContent
        title={title}
        closeButton={showCloseButton}
        closeButtonClassName={cn(
          'top-[calc(var(--card-padding)+1.75rem)] right-[calc(var(--card-padding)+0.75rem)] -translate-y-1/2',
          'size-7 rounded-md p-1 bg-muted/50 hover:bg-muted hover:opacity-100 text-muted-foreground',
          closeButtonClassName,
        )}
        className={cn(
          'overflow-hidden gap-0 border-0 bg-card p-(--card-padding) shadow-none',
          '[--card-radius:1rem] [--card-padding:0.25rem] lg:rounded-(--card-radius) lg:p-(--card-padding)',
          'max-w-xl! border-none outline-none max-h-dvh max-sm:px-1 shadow-lg sm:rounded-2xl',
          className,
        )}
      >
        <DialogDescription className="sr-only">{description}</DialogDescription>

        <Command
          filter={filter}
          className={cn(
            '[--card-content-radius:calc(var(--card-radius)-var(--card-padding))] sm:rounded-xl lg:rounded-(--card-content-radius)',
            commandClassName,
          )}
        >
          {children}
        </Command>
      </DialogContent>
    </Dialog>
  )
}

function CommandInput({
  className,
  ...props
}: React.ComponentProps<typeof CommandPrimitive.Input>) {
  return (
    <div
      data-slot="command-input-wrapper"
      className="flex h-9 min-h-14 items-center gap-4 px-(--card-content-padding)"
    >
      <Icon name="Magnifier" className="size-4 shrink-0 opacity-50" />

      <CommandPrimitive.Input
        data-slot="command-input"
        className={cn(
          'flex h-10 w-full rounded-md bg-transparent py-3 pr-9 text-sm outline-hidden placeholder:text-muted-foreground/50 disabled:cursor-not-allowed disabled:opacity-50',
          '[&_button]:size-8!',
          className,
        )}
        {...props}
      />
    </div>
  )
}

function CommandList({
  className,
  ...props
}: React.ComponentProps<typeof CommandPrimitive.List>) {
  return (
    <CommandPrimitive.List
      data-slot="command-list"
      className={cn(
        'max-lg:h-full lg:max-h-[500px] scroll-py-1 overflow-x-hidden overflow-y-auto',
        className,
      )}
      {...props}
    />
  )
}

function CommandEmpty({
  ...props
}: React.ComponentProps<typeof CommandPrimitive.Empty>) {
  return (
    <CommandPrimitive.Empty
      data-slot="command-empty"
      className="py-6 text-center text-sm"
      {...props}
    />
  )
}

function CommandGroup({
  className,
  ...props
}: React.ComponentProps<typeof CommandPrimitive.Group>) {
  return (
    <CommandPrimitive.Group
      data-slot="command-group"
      className={cn(
        'overflow-hidden p-2 text-foreground **:[[cmdk-group-heading]]:py-2',
        className,
      )}
      {...props}
    />
  )
}

function CommandSeparator({
  className,
  ...props
}: React.ComponentProps<typeof CommandPrimitive.Separator>) {
  return (
    <CommandPrimitive.Separator
      data-slot="command-separator"
      className={cn('-mx-1 h-px bg-border', className)}
      {...props}
    />
  )
}

function CommandItem({
  className,
  ...props
}: React.ComponentProps<typeof CommandPrimitive.Item>) {
  return (
    <CommandPrimitive.Item
      data-slot="command-item"
      className={cn(
        "relative flex cursor-default items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-hidden select-none data-[disabled=true]:pointer-events-none data-[disabled=true]:opacity-50 data-[selected=true]:bg-accent data-[selected=true]:text-accent-foreground [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 [&_svg:not([class*='text-'])]:text-muted-foreground",
        className,
      )}
      {...props}
    />
  )
}

function CommandShortcut({
  className,
  ...props
}: React.ComponentProps<'span'>) {
  return (
    <span
      data-slot="command-shortcut"
      className={cn(
        'ml-auto text-xs tracking-widest text-muted-foreground',
        className,
      )}
      {...props}
    />
  )
}

function CommandFooter({
  className,
  navigateLabel = 'navigate',
  selectLabel = 'select',
  closeLabel = 'close',
  children,
  ...props
}: React.ComponentProps<'div'> & {
  navigateLabel?: string
  selectLabel?: string
  closeLabel?: string
}) {
  return (
    <div
      data-slot="command-footer"
      className={cn(
        'hidden lg:flex shrink-0 items-center justify-between p-4 text-xs text-muted-foreground',
        className,
      )}
      {...props}
    >
      {children ?? (
        <>
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1.5">
              <Kbd keys={['ArrowUp', 'ArrowDown']} />

              <span>{navigateLabel}</span>
            </span>

            <span className="flex items-center gap-1.5">
              <Kbd keys={['Enter']} />

              <span>{selectLabel}</span>
            </span>
          </div>

          <span className="flex items-center gap-1.5">
            <Kbd keys={['Escape']} />

            <span>{closeLabel}</span>
          </span>
        </>
      )}
    </div>
  )
}

const Command = Object.assign(CommandRoot, {
  Dialog: CommandDialog,
  Empty: CommandEmpty,
  Footer: CommandFooter,
  Group: CommandGroup,
  Input: CommandInput,
  Item: CommandItem,
  List: CommandList,
  Separator: CommandSeparator,
  Shortcut: CommandShortcut,
})

export { Command }
