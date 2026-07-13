'use client'

import * as React from 'react'

import { useRender } from '@base-ui/react/use-render'

import { cva, type VariantProps } from 'class-variance-authority'

import { cn } from '@/lib/cn'

const markerVariants = cva(
  'flex items-center gap-2 text-xs text-muted-foreground select-none',
  {
    variants: {
      // `default` = inline status note; `border` = status row with a bottom
      // rule; `separator` = centered label with a hairline on each side (date
      // breaks like "Hoje"). Colors stay muted so it never competes with bubbles.
      variant: {
        default: 'justify-center py-1',
        border: 'w-full justify-start border-b pb-2',
        separator:
          'my-2 justify-center gap-3 before:h-px before:flex-1 before:bg-border after:h-px after:flex-1 after:bg-border',
      },
      // When acting as a link/button, add an interactive affordance.
      interactive: {
        true: 'rounded-md transition-colors hover:text-foreground focus-visible:ring-ring/50 focus-visible:ring-[3px] focus-visible:outline-none',
        false: '',
      },
    },
    defaultVariants: {
      variant: 'default',
      interactive: false,
    },
  },
)

type MarkerRootProps = React.ComponentProps<'div'> &
  VariantProps<typeof markerVariants> & {
    /**
     * Render as a different element (Base UI pattern), e.g. `render={<a />}`
     * or `render={<button />}` to make the whole marker clickable.
     */
    render?: useRender.RenderProp
  }

function MarkerRoot({ className, variant, render, ...props }: MarkerRootProps) {
  return useRender({
    render: render ?? <div />,
    props: {
      'data-slot': 'marker',
      'data-variant': variant ?? 'default',
      className: cn(
        markerVariants({ variant, interactive: Boolean(render) }),
        className,
      ),
      ...props,
    },
  })
}

/** Decorative icon/spinner slot, hidden from assistive tech. */
function MarkerIcon({ className, ...props }: React.ComponentProps<'span'>) {
  return (
    <span
      data-slot="marker-icon"
      aria-hidden
      className={cn(
        'flex shrink-0 items-center justify-center [&_svg]:size-3.5',
        className,
      )}
      {...props}
    />
  )
}

function MarkerContent({ className, ...props }: React.ComponentProps<'span'>) {
  return (
    <span
      data-slot="marker-content"
      className={cn('font-medium', className)}
      {...props}
    />
  )
}

const Marker = Object.assign(MarkerRoot, {
  Icon: MarkerIcon,
  Content: MarkerContent,
})

export { Marker, markerVariants }
