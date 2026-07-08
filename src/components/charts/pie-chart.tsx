'use client'

import {
  Cell,
  Pie,
  PieChart as RechartsPieChart,
} from 'recharts'

import {
  type ComponentProps,
  useCallback,
  useId,
  useMemo,
  useRef,
  useState,
} from 'react'

import { motion } from 'motion/react'

import {
  type ChartConfig,
  ChartContainer,
  getLoadingData,
  LoadingIndicator,
} from '@/components/charts/core/chart'
import {
  ChartLegend,
  ChartLegendContent,
  type ChartLegendVariant,
} from '@/components/charts/core/legend'
import {
  ChartTooltip,
  ChartTooltipContent,
  type TooltipRoundness,
  type TooltipVariant,
} from '@/components/charts/core/tooltip'

// Constants
const DONUT_INNER_RADIUS = '62%'
const DEFAULT_PADDING_ANGLE = 2
const DEFAULT_CORNER_RADIUS = 4
const LOADING_PIE_DATA_KEY = 'loading'
const LOADING_ANIMATION_DURATION = 2000 // in milliseconds
// Reserved space so the bottom-centered legend never overlaps the circle
const LEGEND_MARGIN = 36

type ChartProps = ComponentProps<typeof RechartsPieChart>
type PieProps = ComponentProps<typeof Pie>
type PieVariant = 'default' | 'donut'

type BasePieChartProps<
  TData extends Record<string, unknown>,
  TConfig extends Record<string, ChartConfig[string]>,
> = {
  /**
   * Keyed by the category values found in `data[nameKey]` — each slice reads
   * its label and colors from the matching entry.
   */
  chartConfig: TConfig
  data: TData[]
  /** Numeric field of each row that sizes the slice. */
  dataKey: keyof TData & string
  /** Categorical field of each row that names the slice (and its config key). */
  nameKey: keyof TData & string
  className?: string
  chartProps?: Omit<ChartProps, 'data'>
  pieProps?: Omit<
    PieProps,
    'data' | 'dataKey' | 'nameKey' | 'children' | 'ref'
  >
  defaultSelectedDataKey?: string | null
  pieVariant?: PieVariant
  paddingAngle?: number
  cornerRadius?: number
  legendVariant?: ChartLegendVariant
  /** Center content, rendered only on the `donut` variant. */
  centerLabel?: React.ReactNode
  centerValue?: React.ReactNode
  // Hide Stuffs
  hideTooltip?: boolean
  hideLegend?: boolean
  // Tooltip
  tooltipRoundness?: TooltipRoundness
  tooltipVariant?: TooltipVariant
  tooltipAnimationDuration?: number
  tooltipContentProps?: Omit<
    ComponentProps<typeof ChartTooltipContent>,
    'selected' | 'roundness' | 'variant'
  >
  isLoading?: boolean
  loadingSlices?: number
}

type PieChartClickable = {
  isClickable: true
  onSelectionChange?: (selectedDataKey: string | null) => void
}

type PieChartNotClickable = {
  isClickable?: false
  onSelectionChange?: never
}

type PieChartProps<
  TData extends Record<string, unknown>,
  TConfig extends Record<string, ChartConfig[string]>,
> = BasePieChartProps<TData, TConfig> &
  (PieChartClickable | PieChartNotClickable)

export function PieChart<
  TData extends Record<string, unknown>,
  TConfig extends Record<string, ChartConfig[string]>,
>({
  chartConfig,
  data,
  dataKey,
  nameKey,
  className,
  chartProps,
  pieProps,
  defaultSelectedDataKey = null,
  pieVariant = 'default',
  paddingAngle = DEFAULT_PADDING_ANGLE,
  cornerRadius = DEFAULT_CORNER_RADIUS,
  legendVariant,
  centerLabel,
  centerValue,
  hideTooltip = false,
  hideLegend = false,
  tooltipRoundness,
  tooltipVariant,
  tooltipAnimationDuration,
  tooltipContentProps,
  isClickable = false,
  isLoading = false,
  loadingSlices,
  onSelectionChange,
}: PieChartProps<TData, TConfig>) {
  const [selectedDataKey, setSelectedDataKey] = useState<string | null>(
    defaultSelectedDataKey,
  )
  const { loadingData, onShimmerExit } = useLoadingData(
    isLoading,
    loadingSlices,
  )
  const chartId = useId().replace(/:/g, '') // Remove colons for valid CSS selectors

  // Wrapper function to update state and call parent callback
  // Only call callback when isClickable is true
  const handleSelectionChange = useCallback(
    (newSelectedDataKey: string | null) => {
      setSelectedDataKey(newSelectedDataKey)
      if (isClickable && onSelectionChange) {
        onSelectionChange(newSelectedDataKey)
      }
    },
    [onSelectionChange, isClickable],
  )

  const isDonut = pieVariant === 'donut'
  const hasCenterContent =
    isDonut &&
    !isLoading &&
    (centerLabel !== undefined || centerValue !== undefined)
  const showLegend = !hideLegend && !isLoading

  return (
    <ChartContainer className={className} config={chartConfig}>
      <LoadingIndicator isLoading={isLoading} />
      <RechartsPieChart
        id="charts-pie-chart"
        accessibilityLayer
        // Reserve room for the bottom-centered legend so the circle never
        // renders underneath it (the recharts legend wrapper is absolute).
        margin={showLegend ? { bottom: LEGEND_MARGIN } : undefined}
        {...chartProps}
      >
        {!hideTooltip && !isLoading && (
          <ChartTooltip
            cursor={false}
            animationDuration={tooltipAnimationDuration}
            content={
              <ChartTooltipContent
                nameKey={nameKey}
                hideLabel
                selected={selectedDataKey}
                roundness={tooltipRoundness}
                variant={tooltipVariant}
                {...tooltipContentProps}
              />
            }
          />
        )}

        {showLegend && (
          <ChartLegend
            verticalAlign="bottom"
            align="center"
            content={
              <ChartLegendContent
                nameKey={nameKey}
                verticalAlign="bottom"
                align="center"
                selected={selectedDataKey}
                onSelectChange={handleSelectionChange}
                isClickable={isClickable}
                variant={legendVariant}
              />
            }
          />
        )}

        {!isLoading && (
          <Pie
            data={data}
            dataKey={dataKey}
            nameKey={nameKey}
            innerRadius={isDonut ? DONUT_INNER_RADIUS : 0}
            paddingAngle={paddingAngle}
            cornerRadius={cornerRadius}
            strokeWidth={0}
            {...pieProps}
          >
            {data.map((entry, index) => {
              const sliceKey = String(entry[nameKey])
              const isSelected =
                selectedDataKey === null || selectedDataKey === sliceKey

              return (
                <Cell
                  key={`${sliceKey}-${index}`}
                  fill={`var(--color-${sliceKey}-0)`}
                  opacity={isSelected ? 1 : 0.3}
                  className="transition-opacity"
                />
              )
            })}
          </Pie>
        )}

        {/* ======== LOADING PIE ======== */}
        {isLoading && (
          <Pie
            data={loadingData}
            dataKey={LOADING_PIE_DATA_KEY}
            innerRadius={isDonut ? DONUT_INNER_RADIUS : 0}
            paddingAngle={paddingAngle}
            cornerRadius={cornerRadius}
            fill="currentColor"
            fillOpacity={0.08}
            stroke="none"
            isAnimationActive={false}
            legendType="none"
            tooltipType="none"
            style={{ mask: `url(#${chartId}-loading-mask)` }}
          />
        )}

        {hasCenterContent && (
          <foreignObject
            x="35%"
            y="35%"
            width="30%"
            height="30%"
            className="pointer-events-none"
          >
            <div className="flex h-full w-full flex-col items-center justify-center text-center">
              {centerValue !== undefined && (
                <span className="text-foreground text-2xl font-semibold leading-tight">
                  {centerValue}
                </span>
              )}
              {centerLabel !== undefined && (
                <span className="text-muted-foreground text-xs">
                  {centerLabel}
                </span>
              )}
            </div>
          </foreignObject>
        )}

        {/* ======== CHART STYLES ======== */}
        <defs>
          {isLoading && (
            <LoadingPiePatternStyle
              chartId={chartId}
              onShimmerExit={onShimmerExit}
            />
          )}
        </defs>
      </RechartsPieChart>
    </ChartContainer>
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

const LoadingPiePatternStyle = ({
  chartId,
  onShimmerExit,
}: {
  chartId: string
  onShimmerExit: () => void
}) => {
  const gradientStops = generateEasedGradientStops()

  // Pattern width needs to accommodate: 1 (left buffer) + 1 (visible) + 1 (right buffer) = 3
  const patternWidth = 3

  // Animation goes from -1 (left of visible) to 2 (right of visible)
  // Total travel distance = 3, matching pattern width
  const startX = -1
  const endX = 2

  // Track last x value to detect threshold crossing
  const lastXRef = useRef(startX)

  return (
    <>
      {/* Gradient for smooth fade: edges dim, middle bright for sweep effect */}
      <linearGradient
        id={`${chartId}-loading-mask-gradient`}
        x1="0"
        y1="0"
        x2="1"
        y2="0"
      >
        {gradientStops.map(({ offset, opacity }) => (
          <stop
            key={offset}
            offset={offset}
            stopColor="white"
            stopOpacity={opacity}
          />
        ))}
      </linearGradient>
      <pattern
        id={`${chartId}-loading-mask-pattern`}
        patternUnits="objectBoundingBox"
        patternContentUnits="objectBoundingBox"
        patternTransform="rotate(25)"
        width={patternWidth}
        height="1"
        x="0"
        y="0"
      >
        {/* Use motion.rect with keyframe animation for precise timing */}
        <motion.rect
          y="0"
          width="1"
          height="1"
          fill={`url(#${chartId}-loading-mask-gradient)`}
          initial={{ attrX: startX }}
          animate={{ attrX: endX }}
          transition={{
            duration: LOADING_ANIMATION_DURATION / 1000,
            ease: 'linear',
            repeat: Infinity,
            repeatType: 'loop',
          }}
          // Use onUpdate to fire callback at precise exit point
          onUpdate={(latest) => {
            const xValue =
              typeof latest.attrX === 'number' ? latest.attrX : startX
            const lastX = lastXRef.current

            // Fire when crossing the exit threshold (x >= 1 means shimmer fully exited right)
            if (xValue >= 1 && lastX < 1) {
              onShimmerExit()
            }

            // Update tracked value
            lastXRef.current = xValue
          }}
        />
      </pattern>
      {/* Masking */}
      <mask id={`${chartId}-loading-mask`} maskUnits="userSpaceOnUse">
        <rect
          width="100%"
          height="100%"
          fill={`url(#${chartId}-loading-mask-pattern)`}
        />
      </mask>
    </>
  )
}

/**
 * Hook to manage loading data with pixel-perfect shimmer synchronization.
 *
 * Uses motion.dev's onUpdate callback to ensure slice data is only
 * regenerated when the shimmer has completely exited the visible area.
 */
function useLoadingData(isLoading: boolean, loadingSlices: number = 5) {
  const [loadingDataKey, setLoadingDataKey] = useState(false)

  // Callback fired by motion.dev when shimmer exits visible area
  const onShimmerExit = useCallback(() => {
    if (isLoading) {
      setLoadingDataKey((prev) => !prev)
    }
  }, [isLoading])

  const loadingData = useMemo(
    () => getLoadingData(loadingSlices, 20, 80),
    // loadingDataKey toggle triggers re-computation when shimmer exits
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [loadingSlices, loadingDataKey],
  )

  return { loadingData, onShimmerExit }
}
