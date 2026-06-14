'use client'

import * as React from 'react'

import { cva, type VariantProps } from 'class-variance-authority'

import { cn } from '@/lib/cn'

import { Icon, type IconType } from '@/components/icon'

import {
  Collapsible,
  CollapsibleContent,
  collapsibleTriggerSettingsOverlayVariants,
  useCollapsibleOpen,
  useOptionalCollapsibleContext,
} from '@/components/ui/collapsible'
import { Label } from '@/components/ui/label'

const settingsItemVariants = cva(
  'flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-4 transition-colors',
  {
    variants: {
      align: {
        center: 'items-center',
        start: 'items-start',
      },
      variant: {
        row: '',
        card: 'bg-card rounded-xl',
      },
    },
    defaultVariants: {
      align: 'center',
      variant: 'row',
    },
  },
)

const defaultCollapseContentClassName =
  'p-0 bg-muted divide-y-4 divide-card gap-0 border-4 border-t-0 rounded-b-lg'

export type SettingsItemCollapse = {
  /** Expanded panel body. Trigger row extras go on {@link SettingsItem} as normal `children`. */
  children: React.ReactNode
  /** Controlled open state. */
  open?: boolean
  defaultOpen?: boolean
  onOpenChange?: (open: boolean) => void
  /** When set (uncontrolled only), keeps the panel open — e.g. inner switch is on. */
  expandWhen?: boolean
  /**
   * When true, the trigger row no longer toggles open/closed on click (row is not a button).
   * Use with {@link expandWhen}, controlled `open`, or a custom {@link SettingsItem} `action`
   * (e.g. switch with stopPropagation, or the default chevron becomes its own control).
   */
  triggerRowToggleDisabled?: boolean
  /** Merged into the surrounding {@link Collapsible} root (card shell). */
  rootClassName?: string
  contentClassName?: string
  variant?: 'card' | 'row'
  align?: 'center' | 'start'
  disabled?: boolean
}

type SettingsItemProps = Omit<React.HTMLAttributes<HTMLElement>, 'title'> &
  VariantProps<typeof settingsItemVariants> & {
    as?: 'div' | 'button'
    id?: string
    icon?: IconType
    title: React.ReactNode
    description?: React.ReactNode
    titleClassName?: string
    descriptionClassName?: string
    disabled?: boolean
    action?: React.ReactNode
    /** When true, acts as the trigger for an ancestor Collapsible (toggle + overlay styles). */
    collapsibleTrigger?: boolean
    /** When true with `collapsibleTrigger`, the row does not toggle the panel on click. */
    collapsibleTriggerToggleDisabled?: boolean
    /**
     * Wraps this row in a collapsible: trigger row + animated panel.
     * Prefer this over composing {@link Collapsible} manually when the pattern matches.
     */
    collapse?: SettingsItemCollapse
  }

type SettingsItemRowProps = Omit<SettingsItemProps, 'collapse'>

function SettingsItemCollapseChevron({ className }: { className?: string }) {
  const open = useCollapsibleOpen()

  return (
    <Icon
      name="ChevronDown"
      className={cn(
        'size-5 shrink-0 text-muted-foreground transition-transform',
        open && 'rotate-180',
        className,
      )}
    />
  )
}

/** Chevron that toggles the panel when the row itself is not clickable ({@link SettingsItemCollapse.triggerRowToggleDisabled}). */
function SettingsItemCollapseChevronToggleButton({
  className,
}: {
  className?: string
}) {
  const ctx = useOptionalCollapsibleContext()
  const open = useCollapsibleOpen()

  if (!ctx) {
    throw new Error(
      'SettingsItemCollapseChevronToggleButton must be used inside <Collapsible>.',
    )
  }

  return (
    <button
      type="button"
      className={cn(
        'inline-flex shrink-0 items-center justify-center rounded-md text-muted-foreground outline-none transition-colors',
        'hover:bg-muted/50 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background',
        ctx.disabled && 'pointer-events-none opacity-50 grayscale',
        className,
      )}
      aria-expanded={ctx.open}
      aria-controls={ctx.contentId}
      disabled={ctx.disabled}
      onClick={(e) => {
        e.stopPropagation()
        if (!ctx.disabled) ctx.setOpen(!ctx.open)
      }}
    >
      <Icon
        name="ChevronDown"
        className={cn('size-5 transition-transform', open && 'rotate-180')}
      />
    </button>
  )
}

const SettingsItemRow = React.forwardRef<
  HTMLDivElement | HTMLButtonElement,
  SettingsItemRowProps
>(function SettingsItemRow(
  {
    as = 'div',
    id,
    icon,
    title,
    description,
    align = 'start',
    variant,
    disabled = false,
    action,
    className,
    children,
    titleClassName,
    descriptionClassName,
    collapsibleTrigger = false,
    collapsibleTriggerToggleDisabled = false,
    onClick,
    ...props
  },
  ref,
) {
  const collapsibleCtx = useOptionalCollapsibleContext()

  if (collapsibleTrigger && collapsibleCtx === null) {
    throw new Error(
      'SettingsItem: collapsibleTrigger requires an ancestor <Collapsible>.',
    )
  }

  const effectiveAs =
    collapsibleTrigger && collapsibleTriggerToggleDisabled
      ? 'div'
      : collapsibleTrigger
        ? 'button'
        : as
  const Comp = effectiveAs === 'button' ? 'button' : 'div'

  const effectiveDisabled =
    disabled || Boolean(collapsibleTrigger && collapsibleCtx?.disabled)

  const handleClick = React.useCallback(
    (e: React.MouseEvent<HTMLButtonElement & HTMLDivElement>) => {
      if (collapsibleTrigger && collapsibleCtx) {
        if (collapsibleCtx.disabled) return
        if (!collapsibleTriggerToggleDisabled) {
          collapsibleCtx.setOpen(!collapsibleCtx.open)
        }
      }
      onClick?.(e)
    },
    [
      collapsibleTrigger,
      collapsibleTriggerToggleDisabled,
      collapsibleCtx,
      onClick,
    ],
  )

  return (
    <Comp
      ref={ref as React.Ref<HTMLDivElement & HTMLButtonElement>}
      type={effectiveAs === 'button' ? 'button' : undefined}
      data-slot={collapsibleTrigger ? 'collapsible-trigger' : 'settings-item'}
      disabled={effectiveAs === 'button' ? effectiveDisabled : undefined}
      aria-disabled={
        effectiveAs === 'div' && effectiveDisabled ? true : undefined
      }
      aria-expanded={
        collapsibleTrigger && collapsibleCtx ? collapsibleCtx.open : undefined
      }
      aria-controls={
        collapsibleTrigger && collapsibleCtx
          ? collapsibleCtx.contentId
          : undefined
      }
      data-state={
        collapsibleTrigger && collapsibleCtx
          ? collapsibleCtx.open
            ? 'open'
            : 'closed'
          : undefined
      }
      className={cn(
        settingsItemVariants({ align, variant }),
        effectiveAs === 'button' &&
          'cursor-pointer border-0 font-inherit text-inherit',
        collapsibleTrigger &&
          collapsibleCtx &&
          (collapsibleTriggerToggleDisabled
            ? 'group w-full cursor-default rounded-lg outline-none data-[state=open]:rounded-b-none'
            : collapsibleTriggerSettingsOverlayVariants({
                variant: collapsibleCtx.variant ?? 'card',
              })),
        effectiveDisabled && 'opacity-50 pointer-events-none grayscale',
        className,
      )}
      {...props}
      onClick={collapsibleTrigger || onClick ? handleClick : undefined}
    >
      <div className="flex flex-col sm:flex-row gap-4 items-start w-full sm:max-w-[75%]">
        {icon && (
          <Icon
            name={icon}
            className={cn(
              'shrink-0 size-4 text-muted-foreground',
              description && 'sm:mt-0.5',
            )}
          />
        )}

        <div className="flex flex-col items-start justify-start gap-4 sm:gap-2 text-left">
          {id ? (
            <Label
              htmlFor={id}
              className={cn(
                'text-base font-medium leading-none',
                titleClassName,
              )}
            >
              {title}
            </Label>
          ) : (
            <span
              className={cn(
                'text-base font-medium leading-none',
                titleClassName,
              )}
            >
              {title}
            </span>
          )}

          {description && (
            <span
              className={cn(
                'text-sm text-muted-foreground text-balance',
                descriptionClassName,
              )}
            >
              {description}
            </span>
          )}
        </div>
      </div>

      {(action || children) && (
        <div className="flex items-center gap-4">
          {children}
          {action}
        </div>
      )}
    </Comp>
  )
})

SettingsItemRow.displayName = 'SettingsItemRow'

export const SettingsItem = React.forwardRef<
  HTMLDivElement | HTMLButtonElement,
  SettingsItemProps
>(function SettingsItem({ collapse, collapsibleTrigger, ...props }, ref) {
  if (collapse && collapsibleTrigger) {
    throw new Error(
      'SettingsItem: do not pass collapsibleTrigger together with collapse; use collapse alone.',
    )
  }

  if (collapse) {
    const triggerRowToggleDisabled = Boolean(collapse.triggerRowToggleDisabled)

    return (
      <Collapsible
        variant={collapse.variant ?? 'card'}
        align={collapse.align ?? 'start'}
        open={collapse.open}
        defaultOpen={collapse.defaultOpen}
        onOpenChange={collapse.onOpenChange}
        expandWhen={collapse.expandWhen}
        disabled={collapse.disabled}
        className={collapse.rootClassName}
      >
        <SettingsItemRow
          ref={ref}
          {...props}
          collapsibleTrigger
          collapsibleTriggerToggleDisabled={triggerRowToggleDisabled}
          action={
            props.action ??
            (triggerRowToggleDisabled ? (
              <SettingsItemCollapseChevronToggleButton />
            ) : (
              <SettingsItemCollapseChevron />
            ))
          }
        />
        <CollapsibleContent
          className={cn(
            collapse.contentClassName ?? defaultCollapseContentClassName,
          )}
        >
          {collapse.children}
        </CollapsibleContent>
      </Collapsible>
    )
  }

  return (
    <SettingsItemRow
      ref={ref}
      {...props}
      collapsibleTrigger={collapsibleTrigger}
    />
  )
})

SettingsItem.displayName = 'SettingsItem'
