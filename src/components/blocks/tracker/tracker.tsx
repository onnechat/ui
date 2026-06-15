import { twMerge } from 'tailwind-merge'

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'

interface TrackerBlockProps {
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
}: TrackerBlockProps) => {
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
      <TooltipTrigger
        render={
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
        }
      />
      <TooltipContent className="bg-popover text-popover-foreground border border-border rounded-md px-3 py-1.5 text-sm shadow-md">
        {tooltip}
      </TooltipContent>
    </Tooltip>
  )
}

interface TrackerProps
  extends
  React.ComponentProps<'div'>,
  Pick<TrackerBlockProps, 'disabledTooltip'> {
  data: TrackerBlockProps[]
  defaultBackgroundColor?: string
}

const Tracker = ({
  data = [],
  disabledTooltip = false,
  className,
  ref,
  ...props
}: TrackerProps) => {
  return (
    <div
      ref={ref}
      className={twMerge('group flex h-10 w-full items-center', className)}
      {...props}
    >
      {data.map((props, index) => (
        <Block
          disabledTooltip={disabledTooltip}
          key={props.key ?? index}
          {...props}
        />
      ))}
    </div>
  )
}

export { Tracker, type TrackerBlockProps }
