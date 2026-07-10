'use client'

import { Slider as SliderPrimitive } from '@base-ui/react/slider'

import { cva, type VariantProps } from 'class-variance-authority'

import { cn } from '@/lib/cn'

// Toggle control: the track height and the thumb scale together (not a field
// height). sm/default/lg keeps parity with the field-size naming.
const sliderTrackVariants = cva(
  'relative w-full grow overflow-hidden rounded-full bg-border',
  {
    variants: {
      size: {
        sm: 'h-0.5',
        default: 'h-1',
        lg: 'h-1.5',
      },
    },
    defaultVariants: {
      size: 'default',
    },
  },
)

const sliderThumbVariants = cva(
  'block rounded-full border-2 border-primary bg-primary-foreground shadow outline-none transition-colors focus-visible:ring-3 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      size: {
        sm: 'size-3.5',
        default: 'size-4',
        lg: 'size-5',
      },
    },
    defaultVariants: {
      size: 'default',
    },
  },
)

type SliderRootProps = Omit<SliderPrimitive.Root.Props, 'size'> &
  VariantProps<typeof sliderTrackVariants>

function SliderRoot({ className, children, size, ...props }: SliderRootProps) {
  return (
    <SliderPrimitive.Root
      data-slot="slider"
      data-size={size ?? 'default'}
      className={cn('relative flex w-full items-center', className)}
      {...props}
    >
      <SliderPrimitive.Control
        data-slot="slider-control"
        className="relative flex w-full items-center py-2 cursor-pointer"
      >
        <SliderTrack size={size}>
          <SliderIndicator />
        </SliderTrack>
        {children ?? <SliderThumb size={size} />}
      </SliderPrimitive.Control>
    </SliderPrimitive.Root>
  )
}

type SliderTrackProps = Omit<SliderPrimitive.Track.Props, 'size'> &
  VariantProps<typeof sliderTrackVariants>

function SliderTrack({ className, size, ...props }: SliderTrackProps) {
  return (
    <SliderPrimitive.Track
      data-slot="slider-track"
      className={cn(sliderTrackVariants({ size }), className)}
      {...props}
    />
  )
}

function SliderIndicator({
  className,
  ...props
}: SliderPrimitive.Indicator.Props) {
  return (
    <SliderPrimitive.Indicator
      data-slot="slider-indicator"
      className={cn('absolute h-full bg-primary', className)}
      {...props}
    />
  )
}

type SliderThumbProps = Omit<SliderPrimitive.Thumb.Props, 'size'> &
  VariantProps<typeof sliderThumbVariants>

function SliderThumb({ className, size, ...props }: SliderThumbProps) {
  return (
    <SliderPrimitive.Thumb
      data-slot="slider-thumb"
      className={cn(sliderThumbVariants({ size }), className)}
      {...props}
    />
  )
}

const Slider = Object.assign(SliderRoot, {
  Control: SliderPrimitive.Control,
  Track: SliderTrack,
  Indicator: SliderIndicator,
  Thumb: SliderThumb,
})

export { Slider, sliderTrackVariants, sliderThumbVariants }
