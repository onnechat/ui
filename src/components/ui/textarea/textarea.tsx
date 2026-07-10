import * as React from 'react'

import { cva, type VariantProps } from 'class-variance-authority'

import { cn } from '@/lib/cn'

const textareaVariants = cva(
  'border-transparent placeholder:text-muted-foreground/50 focus-visible:border-transparent focus-visible:ring-ring/50 bg-input aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive flex w-full rounded-lg border transition-[color] outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50',
  {
    variants: {
      // Textarea has no fixed height; the size scales its min-height + padding +
      // font, mirroring the field scale (sm/default/lg) used across the lib.
      size: {
        sm: 'min-h-16 px-3 py-1.5 text-sm',
        default: 'min-h-19.5 px-3 py-2 text-sm',
        lg: 'min-h-24 px-4 py-2.5 text-base',
      },
    },
    defaultVariants: {
      size: 'default',
    },
  },
)

type TextareaProps = React.ComponentProps<'textarea'> &
  VariantProps<typeof textareaVariants>

function Textarea({ className, size, ...props }: TextareaProps) {
  return (
    <textarea
      data-slot="textarea"
      data-size={size ?? 'default'}
      className={cn(textareaVariants({ size }), className)}
      {...props}
    />
  )
}
Textarea.displayName = 'Textarea'

export { Textarea, textareaVariants }
export type { TextareaProps }
