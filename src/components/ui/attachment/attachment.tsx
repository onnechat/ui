'use client'

import * as React from 'react'

import { cva, type VariantProps } from 'class-variance-authority'

import { cn } from '@/lib/cn'

import { Icon } from '@/components/icon'
import { Button } from '@/components/ui/button'
import { Loader } from '@/components/ui/loader'

const attachmentVariants = cva(
  // Card-like surface: bg-card, 16px radius, NO border (matches Card/Button).
  'group/attachment relative flex min-w-0 rounded-2xl text-card-foreground transition-colors',
  {
    variants: {
      size: {
        default: 'gap-3 p-3',
        sm: 'gap-2.5 p-2.5',
        xs: 'gap-2 p-2',
      },
      orientation: {
        // `flex-wrap` lets a full-width `Attachment.Progress` drop to its own
        // line below the media/content/actions row (via `basis-full`).
        horizontal: 'flex-row flex-wrap items-center',
        vertical: 'w-40 flex-col items-stretch',
      },
      // The card surface stays calm (`bg-card`) across the working states — the
      // media pip / spinner and the progress bar do the talking. Only `error`
      // shifts the whole surface (destructive tint + ring) since it needs to
      // grab attention. `idle` reads "queued" purely via its upload pip.
      state: {
        idle: 'bg-card',
        uploading: 'bg-card',
        processing: 'bg-card',
        error: 'bg-destructive/5 ring-1 ring-inset ring-destructive/25',
        done: 'bg-card',
      },
    },
    defaultVariants: {
      size: 'default',
      orientation: 'horizontal',
      state: 'done',
    },
  },
)

type AttachmentState = NonNullable<
  VariantProps<typeof attachmentVariants>['state']
>

type AttachmentContextValue = {
  state: AttachmentState
}

const AttachmentContext = React.createContext<AttachmentContextValue>({
  state: 'done',
})

function useAttachment() {
  return React.useContext(AttachmentContext)
}

function AttachmentRoot({
  className,
  size,
  orientation,
  state = 'done',
  ...props
}: React.ComponentProps<'div'> & VariantProps<typeof attachmentVariants>) {
  return (
    <AttachmentContext.Provider value={{ state: state ?? 'done' }}>
      <div
        data-slot="attachment"
        data-state={state ?? 'done'}
        data-size={size ?? 'default'}
        data-orientation={orientation ?? 'horizontal'}
        className={cn(
          attachmentVariants({ size, orientation, state }),
          className,
        )}
        {...props}
      />
    </AttachmentContext.Provider>
  )
}

// Root is NOT clipped — the clipping lives on the inner surface so the corner
// pip can overhang the edge without being cropped.
const attachmentMediaVariants = cva('relative flex shrink-0 rounded-xl', {
  variants: {
    size: {
      default: 'size-10',
      sm: 'size-9',
      xs: 'size-8',
    },
  },
  defaultVariants: {
    size: 'default',
  },
})

// Corner status pip drawn over the media. `null` states show nothing so the
// spinner overlay can take over instead.
const STATE_PIP: Record<
  AttachmentState,
  { icon: 'Upload' | 'Check' | 'TriangleWarning'; className: string } | null
> = {
  idle: { icon: 'Upload', className: 'bg-background text-muted-foreground' },
  uploading: null,
  processing: null,
  done: { icon: 'Check', className: 'bg-success text-success-foreground' },
  error: {
    icon: 'TriangleWarning',
    className: 'bg-destructive text-destructive-foreground',
  },
}

function AttachmentMedia({
  className,
  variant = 'icon',
  size,
  children,
  ...props
}: React.ComponentProps<'div'> & {
  variant?: 'icon' | 'image'
} & VariantProps<typeof attachmentMediaVariants>) {
  const { state } = useAttachment()
  const busy = state === 'uploading' || state === 'processing'
  const pip = STATE_PIP[state]

  return (
    <div
      data-slot="attachment-media"
      data-variant={variant}
      data-state={state}
      className={cn(attachmentMediaVariants({ size }), className)}
      {...props}
    >
      {/* Clipped surface: bg + rounded corners, holds the icon/thumbnail. */}
      <div
        className={cn(
          'bg-muted text-muted-foreground absolute inset-0 flex items-center justify-center overflow-hidden rounded-[inherit] [&_svg:not([class*=size-])]:size-5',
          variant === 'image' && '[&_img]:size-full [&_img]:object-cover',
        )}
      >
        {/* The file icon/thumbnail dims out of the way while work is happening. */}
        <div
          className={cn(
            'flex size-full items-center justify-center transition-opacity duration-200',
            busy && 'opacity-25',
          )}
        >
          {children}
        </div>

        {/* Distinct overlays so the two busy states never read the same:
            `uploading` streams an arrow upward (data going out), `processing`
            spins (indeterminate server-side work). */}
        {state === 'uploading' && (
          <div className="text-foreground absolute inset-0 flex items-center justify-center">
            <Icon
              name="ArrowUp"
              className="size-4 animate-[attachment-upload_1.1s_ease-in-out_infinite] motion-reduce:animate-none"
            />
          </div>
        )}
        {state === 'processing' && (
          <div className="text-foreground absolute inset-0 flex items-center justify-center">
            <Loader variant="button" iconClassName="size-4" />
          </div>
        )}
      </div>

      {/* Corner pip sits OUTSIDE the clipped surface so it never gets cropped. */}
      {pip && (
        <span
          aria-hidden
          className={cn(
            'ring-card absolute -right-1 -bottom-1 flex size-4 items-center justify-center rounded-full ring-2 [&_svg]:size-2.5',
            pip.className,
          )}
        >
          <Icon name={pip.icon} />
        </span>
      )}
    </div>
  )
}

function AttachmentContent({
  className,
  ...props
}: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="attachment-content"
      className={cn('flex min-w-0 flex-col justify-center', className)}
      {...props}
    />
  )
}

function AttachmentTitle({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="attachment-title"
      className={cn('truncate text-sm font-medium', className)}
      {...props}
    />
  )
}

function AttachmentDescription({
  className,
  ...props
}: React.ComponentProps<'div'>) {
  const { state } = useAttachment()
  return (
    <div
      data-slot="attachment-description"
      className={cn(
        'truncate text-xs',
        // The description echoes the state colour so the status reads even
        // without the media in view.
        state === 'error'
          ? 'text-destructive'
          : state === 'uploading' || state === 'processing'
            ? 'text-foreground/80'
            : 'text-muted-foreground',
        className,
      )}
      {...props}
    />
  )
}

/**
 * Thin upload progress bar. Place it as a DIRECT child of `Attachment` (a
 * sibling of Media/Content/Actions), not inside Content — in the horizontal
 * layout it wraps to its own full-width line at the bottom (`basis-full`); in
 * the vertical layout it just stacks full-width. Pass `value` (0–100) for a
 * determinate bar; omit it (or use it in `processing`) for an indeterminate
 * sweep.
 */
function AttachmentProgress({
  className,
  value,
  ...props
}: React.ComponentProps<'div'> & { value?: number }) {
  const { state } = useAttachment()
  const indeterminate = value == null || state === 'processing'
  const clamped = Math.max(0, Math.min(100, value ?? 0))

  return (
    <div
      data-slot="attachment-progress"
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={indeterminate ? undefined : clamped}
      className={cn(
        'bg-muted relative order-last h-1 w-full overflow-hidden rounded-full group-data-[orientation=horizontal]/attachment:basis-full',
        className,
      )}
      {...props}
    >
      <div
        className={cn(
          'bg-primary h-full rounded-full',
          indeterminate
            ? 'w-1/3 animate-[progress-indeterminate_1.2s_ease-in-out_infinite]'
            : 'transition-[width] duration-300 ease-out',
        )}
        style={indeterminate ? undefined : { width: `${clamped}%` }}
      />
    </div>
  )
}

/** Right-aligned actions; sits above the full-card Trigger. */
function AttachmentActions({
  className,
  ...props
}: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="attachment-actions"
      className={cn(
        'relative z-10 ml-auto flex shrink-0 items-center gap-1 self-start',
        className,
      )}
      {...props}
    />
  )
}

function AttachmentAction({
  className,
  ...props
}: React.ComponentProps<typeof Button>) {
  return (
    <Button
      data-slot="attachment-action"
      variant="ghost"
      size="icon-sm"
      className={cn('size-7', className)}
      {...props}
    />
  )
}

/** Full-card clickable overlay; stays behind the actions (which are z-10). */
function AttachmentTrigger({
  className,
  ...props
}: React.ComponentProps<'button'>) {
  return (
    <button
      type="button"
      data-slot="attachment-trigger"
      className={cn(
        'absolute inset-0 rounded-[inherit] outline-none focus-visible:ring-ring/50 focus-visible:ring-[3px]',
        className,
      )}
      {...props}
    />
  )
}

/** Horizontally scrollable, snapping row of attachments with edge fade. */
function AttachmentGroup({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="attachment-group"
      className={cn(
        'scroll-fade-x flex snap-x snap-mandatory gap-2 overflow-x-auto pb-1 [&>*]:snap-start [&>*]:shrink-0',
        className,
      )}
      {...props}
    />
  )
}

const Attachment = Object.assign(AttachmentRoot, {
  Media: AttachmentMedia,
  Content: AttachmentContent,
  Title: AttachmentTitle,
  Description: AttachmentDescription,
  Progress: AttachmentProgress,
  Actions: AttachmentActions,
  Action: AttachmentAction,
  Trigger: AttachmentTrigger,
  Group: AttachmentGroup,
})

export { Attachment, attachmentVariants, useAttachment }
