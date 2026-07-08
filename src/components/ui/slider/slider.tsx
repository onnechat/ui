'use client'

import { Slider as SliderPrimitive } from '@base-ui/react/slider'

import { cn } from '@/lib/cn'

function SliderRoot({
  className,
  children,
  ...props
}: SliderPrimitive.Root.Props) {
  return (
    <SliderPrimitive.Root
      data-slot="slider"
      className={cn('relative flex w-full items-center', className)}
      {...props}
    >
      <SliderPrimitive.Control
        data-slot="slider-control"
        className="relative flex w-full items-center py-2 cursor-pointer"
      >
        <SliderTrack>
          <SliderIndicator />
        </SliderTrack>
        {children ?? <SliderThumb />}
      </SliderPrimitive.Control>
    </SliderPrimitive.Root>
  )
}

function SliderTrack({ className, ...props }: SliderPrimitive.Track.Props) {
  return (
    <SliderPrimitive.Track
      data-slot="slider-track"
      className={cn(
        'relative h-1 w-full grow overflow-hidden rounded-full bg-border',
        className,
      )}
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

function SliderThumb({ className, ...props }: SliderPrimitive.Thumb.Props) {
  return (
    <SliderPrimitive.Thumb
      data-slot="slider-thumb"
      className={cn(
        'block size-4 rounded-full border-2 border-primary bg-primary-foreground shadow outline-none transition-colors focus-visible:ring-3 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50',
        className,
      )}
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

export { Slider }
