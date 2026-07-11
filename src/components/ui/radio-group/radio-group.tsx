'use client'

import { Radio as RadioPrimitive } from '@base-ui/react/radio'
import { RadioGroup as RadioGroupPrimitive } from '@base-ui/react/radio-group'

import { cva, type VariantProps } from 'class-variance-authority'

import { cn } from '@/lib/cn'

const radioGroupItemVariants = cva(
  'relative flex items-center justify-center border-input data-checked:bg-primary data-checked:text-primary-foreground data-checked:border-primary focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive aspect-square shrink-0 rounded-full border shadow-xs transition-shadow outline-none focus-visible:ring-[3px] cursor-pointer data-disabled:cursor-not-allowed data-disabled:opacity-50',
  {
    variants: {
      // Toggle control: the circle + inner dot scale together (not a field
      // height). sm/default/lg keeps parity with the field-size naming.
      size: {
        sm: 'size-3.5 [&_svg]:size-[5px]',
        default: 'size-4 [&_svg]:size-1.5',
        lg: 'size-5 [&_svg]:size-2',
      },
    },
    defaultVariants: {
      size: 'default',
    },
  },
)

function RadioGroupRoot({ className, ...props }: RadioGroupPrimitive.Props) {
  return (
    <RadioGroupPrimitive
      data-slot="radio-group"
      className={cn('grid gap-3', className)}
      {...props}
    />
  )
}

type RadioGroupItemProps = Omit<RadioPrimitive.Root.Props, 'size'> &
  VariantProps<typeof radioGroupItemVariants>

function RadioGroupItem({ className, size, ...props }: RadioGroupItemProps) {
  return (
    <RadioPrimitive.Root
      data-slot="radio-group-item"
      data-size={size ?? 'default'}
      className={cn(radioGroupItemVariants({ size }), className)}
      {...props}
    >
      <RadioPrimitive.Indicator className="flex items-center justify-center text-current data-unchecked:hidden">
        <svg
          viewBox="0 0 6 6"
          fill="currentcolor"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle cx="3" cy="3" r="3" />
        </svg>
      </RadioPrimitive.Indicator>
    </RadioPrimitive.Root>
  )
}

const RadioGroup = Object.assign(RadioGroupRoot, { Item: RadioGroupItem })
export { RadioGroup, radioGroupItemVariants }
