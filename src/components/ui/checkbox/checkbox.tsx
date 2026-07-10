'use client'

import { Checkbox as CheckboxPrimitive } from '@base-ui/react/checkbox'

import { cva, type VariantProps } from 'class-variance-authority'

import { Icon } from '@/components/icon'

import { cn } from '@/lib/cn'

const checkboxVariants = cva(
  'peer relative flex shrink-0 items-center justify-center border-2 border-input transition-colors outline-none cursor-pointer group-has-disabled/field:opacity-50 after:absolute after:-inset-x-3 after:-inset-y-2 focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 aria-invalid:aria-checked:border-primary dark:bg-input/30 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40 data-checked:border-primary data-checked:bg-primary data-checked:text-primary-foreground dark:data-checked:bg-primary',
  {
    variants: {
      // Toggle control: the box + check icon scale together (not the field
      // heights). sm/default/lg keeps parity with the field-size naming.
      size: {
        sm: 'size-3.5 rounded-[3px] [&_svg]:size-3',
        default: 'size-4 rounded-[4px] [&_svg]:size-3.5',
        lg: 'size-5 rounded-[5px] [&_svg]:size-4',
      },
    },
    defaultVariants: {
      size: 'default',
    },
  },
)

export type CheckboxProps = Omit<CheckboxPrimitive.Root.Props, 'size'> &
  VariantProps<typeof checkboxVariants> & {
    indeterminate?: boolean
  }

function Checkbox({ className, indeterminate, size, ...props }: CheckboxProps) {
  return (
    <CheckboxPrimitive.Root
      data-slot="checkbox"
      data-size={size ?? 'default'}
      indeterminate={indeterminate}
      className={cn(checkboxVariants({ size }), className)}
      {...props}
    >
      <CheckboxPrimitive.Indicator
        data-slot="checkbox-indicator"
        className="grid place-content-center text-current transition-none"
      >
        <Icon name={indeterminate ? 'Minus' : 'Check'} />
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  )
}
export { Checkbox, checkboxVariants }
