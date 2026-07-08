import { cva, type VariantProps } from 'class-variance-authority'

import { cn } from '@/lib/cn'
import { Slot } from '@/lib/slot'
import { Separator } from '@/components/ui/separator'

// The `_[data-slot=...-control]` descendant selectors reach into wrapper components
// (InputGroup, ActionGroup) whose actual bordered element sits one level below the
// direct `button-group` child — those wrappers render as `display: contents` so
// library-internal elements (e.g. Base UI's focus-guard sentinels) never become
// direct children of `button-group` and never confuse `:first-child`/`:last-child`.
//
// The edge selectors use `:nth-child(1 of S)`/`:nth-last-child(1 of S)` instead of
// `:first-child`/`:last-child` because Base UI injects siblings next to popup
// triggers placed directly inside the group: focus-guard spans around Menu/Popover
// triggers while their popup is open, a hidden `span[aria-owns]` portal anchor at
// the Content declaration site, and the always-present hidden native <select>
// after the Select trigger. The `of` filter skips those, so a trigger keeps its
// outer-edge rounding while its popup is open.
const buttonGroupVariants = cva(
  "flex w-fit items-stretch has-[>[data-slot=button-group]]:gap-2 [&>*]:focus-visible:relative [&>*]:focus-visible:z-10 [&>[data-slot=select-trigger]:not([class*='w-'])]:w-fit [&>input]:flex-1 [&>[data-slot=input-group]]:flex-1",
  {
    variants: {
      orientation: {
        horizontal:
          "[&>*:not(:nth-child(1_of_:not([data-base-ui-focus-guard],span[aria-owns],select[aria-hidden=true])))]:rounded-l-none [&>*:not(:nth-child(1_of_:not([data-base-ui-focus-guard],span[aria-owns],select[aria-hidden=true])))]:border-l-0 [&>*:not(:nth-last-child(1_of_:not([data-base-ui-focus-guard],span[aria-owns],select[aria-hidden=true])))]:rounded-r-none [&>*:not(:nth-child(1_of_:not([data-base-ui-focus-guard],span[aria-owns],select[aria-hidden=true])))_[data-slot=input-group-control]]:rounded-l-none [&>*:not(:nth-last-child(1_of_:not([data-base-ui-focus-guard],span[aria-owns],select[aria-hidden=true])))_[data-slot=input-group-control]]:rounded-r-none [&>*:not(:nth-child(1_of_:not([data-base-ui-focus-guard],span[aria-owns],select[aria-hidden=true])))_[data-slot=dropdown-menu-trigger]]:rounded-l-none [&>*:not(:nth-last-child(1_of_:not([data-base-ui-focus-guard],span[aria-owns],select[aria-hidden=true])))_[data-slot=dropdown-menu-trigger]]:rounded-r-none",
        vertical:
          "flex-col [&>*:not(:nth-child(1_of_:not([data-base-ui-focus-guard],span[aria-owns],select[aria-hidden=true])))]:rounded-t-none [&>*:not(:nth-child(1_of_:not([data-base-ui-focus-guard],span[aria-owns],select[aria-hidden=true])))]:border-t-0 [&>*:not(:nth-last-child(1_of_:not([data-base-ui-focus-guard],span[aria-owns],select[aria-hidden=true])))]:rounded-b-none [&>*:not(:nth-child(1_of_:not([data-base-ui-focus-guard],span[aria-owns],select[aria-hidden=true])))_[data-slot=input-group-control]]:rounded-t-none [&>*:not(:nth-last-child(1_of_:not([data-base-ui-focus-guard],span[aria-owns],select[aria-hidden=true])))_[data-slot=input-group-control]]:rounded-b-none [&>*:not(:nth-child(1_of_:not([data-base-ui-focus-guard],span[aria-owns],select[aria-hidden=true])))_[data-slot=dropdown-menu-trigger]]:rounded-t-none [&>*:not(:nth-last-child(1_of_:not([data-base-ui-focus-guard],span[aria-owns],select[aria-hidden=true])))_[data-slot=dropdown-menu-trigger]]:rounded-b-none",
      },
    },
    defaultVariants: {
      orientation: 'horizontal',
    },
  },
)

function ButtonGroup({
  className,
  orientation,
  ...props
}: React.ComponentProps<'div'> & VariantProps<typeof buttonGroupVariants>) {
  return (
    <div
      role="group"
      data-slot="button-group"
      data-orientation={orientation}
      className={cn(buttonGroupVariants({ orientation }), className)}
      {...props}
    />
  )
}

function ButtonGroupText({
  className,
  asChild = false,
  ...props
}: React.ComponentProps<'div'> & {
  asChild?: boolean
}) {
  const Comp = asChild ? Slot : 'div'

  return (
    <Comp
      className={cn(
        "bg-accent flex items-center gap-2 rounded-xl px-4 text-sm text-muted-foreground font-medium [&_svg:not([class*='size-'])]:size-4 [&_svg]:pointer-events-none",
        className,
      )}
      {...props}
    />
  )
}

type ButtonGroupSeparatorProps = React.ComponentProps<typeof Separator>

function ButtonGroupSeparator({
  className,
  orientation = 'vertical',
  ...props
}: ButtonGroupSeparatorProps) {
  return (
    <Separator
      data-slot="button-group-separator"
      orientation={orientation}
      className={cn(
        'bg-input relative !m-0 self-stretch data-[orientation=vertical]:h-auto',
        className,
      )}
      {...props}
    />
  )
}

export {
  ButtonGroup,
  ButtonGroupSeparator,
  ButtonGroupText,
  buttonGroupVariants,
}
