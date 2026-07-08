'use client'

import { twMerge } from 'tailwind-merge'

import { motion } from 'motion/react'

import { Tooltip } from '@/components/ui/tooltip'

// Constants
const LOADING_ANIMATION_DURATION = 2000 // in milliseconds
const DEFAULT_LOADING_BLOCKS = 30

interface TrackerChartBlockProps {
  key?: string | number
  color?: string
  tooltip?: string
  defaultBackgroundColor?: string
  disabledTooltip?: boolean
}

const Block = ({
  color,
  tooltip,
  disabledTooltip,
  defaultBackgroundColor = 'var(--color-secondary)',
}: TrackerChartBlockProps) => {
  return disabledTooltip ? (
    <div className="size-full overflow-hidden px-[0.5px] transition first:rounded-l-sm first:pl-0 last:rounded-r-sm last:pr-0 sm:px-px">
      <div
        style={
          {
            '--color': color || defaultBackgroundColor,
          } as React.CSSProperties
        }
        className="size-full rounded-[1px] bg-(--color) hover:opacity-50"
      />
    </div>
  ) : (
    <Tooltip>
      <Tooltip.Trigger asChild>
        <div
          role="button"
          aria-label={tooltip}
          className="size-full overflow-hidden px-[0.5px] transition first:rounded-l-sm first:pl-0 last:rounded-r-sm last:pr-0 sm:px-px cursor-pointer"
        >
          <div
            style={
              {
                '--color': color || defaultBackgroundColor,
              } as React.CSSProperties
            }
            className="size-full rounded-[1px] bg-(--color) hover:opacity-80 transition-opacity"
          />
        </div>
      </Tooltip.Trigger>
      <Tooltip.Content className="bg-popover text-popover-foreground border border-border rounded-md px-3 py-1.5 text-sm shadow-md">
        {tooltip}
      </Tooltip.Content>
    </Tooltip>
  )
}

interface TrackerChartProps
  extends
  React.ComponentProps<'div'>,
  Pick<TrackerChartBlockProps, 'disabledTooltip'> {
  data: TrackerChartBlockProps[]
  defaultBackgroundColor?: string
  isLoading?: boolean
  loadingBlocks?: number
}

const TrackerChart = ({
  data = [],
  disabledTooltip = false,
  isLoading = false,
  loadingBlocks = DEFAULT_LOADING_BLOCKS,
  className,
  ref,
  ...props
}: TrackerChartProps) => {
  return (
    <div
      ref={ref}
      className={twMerge('group flex h-10 w-full items-center', className)}
      {...props}
    >
      {isLoading ? (
        <TrackerChartLoading blocks={loadingBlocks} />
      ) : (
        data.map((props, index) => (
          <Block
            disabledTooltip={disabledTooltip}
            key={props.key ?? index}
            {...props}
          />
        ))
      )}
    </div>
  )
}

// Generate gradient stops with smooth easing for loading animation
const generateEasedGradientStops = (
  steps: number = 17,
  minOpacity: number = 0.05,
  maxOpacity: number = 0.9,
) => {
  return Array.from({ length: steps }, (_, i) => {
    const t = i / (steps - 1) // 0 to 1
    // Sine-based bell curve easing: peaks at center (t=0.5), smooth falloff at edges
    const eased = Math.sin(t * Math.PI) ** 2
    const opacity = minOpacity + eased * (maxOpacity - minOpacity)
    return {
      offset: `${(t * 100).toFixed(0)}%`,
      opacity: Number(opacity.toFixed(3)),
    }
  })
}

/**
 * HTML/CSS port of the SVG shimmer the other charts use: the bell-curve
 * gradient occupies the middle third of a 300%-wide mask image, and animating
 * `mask-position` from 100% to 0% sweeps it across the visible area
 * left-to-right on the same 2s loop.
 */
const buildShimmerMaskImage = () => {
  const bellStops = generateEasedGradientStops()
    .map(({ offset, opacity }) => {
      // Map the bell's 0–100% onto the middle third (33.333%–66.667%)
      const position = (100 / 3 + parseFloat(offset) / 3).toFixed(2)
      return `rgba(0, 0, 0, ${opacity}) ${position}%`
    })
    .join(', ')

  return `linear-gradient(to right, transparent 0%, transparent 33.33%, ${bellStops}, transparent 66.67%, transparent 100%)`
}

const SHIMMER_MASK_IMAGE = buildShimmerMaskImage()

const TrackerChartLoading = ({ blocks }: { blocks: number }) => {
  return (
    <motion.div
      aria-hidden
      className="flex size-full items-center"
      style={{
        maskImage: SHIMMER_MASK_IMAGE,
        maskSize: '300% 100%',
        maskRepeat: 'no-repeat',
      }}
      initial={{ maskPosition: '100% 0%' }}
      animate={{ maskPosition: '0% 0%' }}
      transition={{
        duration: LOADING_ANIMATION_DURATION / 1000,
        ease: 'linear',
        repeat: Infinity,
        repeatType: 'loop',
      }}
    >
      {Array.from({ length: blocks }).map((_, index) => (
        <div
          key={index}
          className="size-full overflow-hidden px-[0.5px] first:rounded-l-sm first:pl-0 last:rounded-r-sm last:pr-0 sm:px-px"
        >
          <div className="size-full rounded-[1px] bg-current opacity-30" />
        </div>
      ))}
    </motion.div>
  )
}

export { TrackerChart, type TrackerChartBlockProps }
