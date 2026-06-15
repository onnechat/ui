'use client'

import * as React from 'react'

import { Tooltip } from '@base-ui/react/tooltip'

import { cn } from '@/lib/cn'

import { useIsMobile } from '@/hooks/use-mobile'

interface TooltipContextValue {
  open: boolean
  setOpen: (open: boolean) => void
  isMobile: boolean
}

const TooltipContext = React.createContext<TooltipContextValue | null>(null)

function useTooltipContext() {
  const context = React.useContext(TooltipContext)
  if (!context) {
    throw new Error('Tooltip components must be used within a Tooltip')
  }
  return context
}

function TooltipProvider({
  delay = 400,
  timeout = 300,
  ...props
}: React.ComponentProps<typeof Tooltip.Provider>) {
  return (
    <Tooltip.Provider
      data-slot="tooltip-provider"
      delay={delay}
      timeout={timeout}
      {...props}
    />
  )
}

function TooltipRoot({
  ...props
}: React.ComponentProps<typeof Tooltip.Root>) {
  const isMobile = useIsMobile()
  const [open, setOpen] = React.useState(false)

  const contextValue = React.useMemo(
    () => ({ open, setOpen, isMobile }),
    [open, isMobile],
  )

  return (
    <TooltipContext.Provider value={contextValue}>
      <TooltipProvider>
        <Tooltip.Root
          data-slot="tooltip"
          open={open}
          onOpenChange={setOpen}
          {...props}
        />
      </TooltipProvider>
    </TooltipContext.Provider>
  )
}

function TooltipTrigger({
  onClick,
  ...props
}: React.ComponentProps<typeof Tooltip.Trigger>) {
  const { open, setOpen, isMobile } = useTooltipContext()

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (isMobile) {
      e.preventDefault()
      setOpen(!open)
    }

    onClick?.(e as any)
  }

  return (
    <Tooltip.Trigger
      data-slot="tooltip-trigger"
      onClick={handleClick}
      {...props}
    />
  )
}

function TooltipContent({
  className,
  sideOffset = 0,
  children,
  side,
  align,
  ...props
}: React.ComponentProps<typeof Tooltip.Popup> & {
  sideOffset?: number
  side?: 'bottom' | 'left' | 'right' | 'top'
  align?: 'center' | 'end' | 'start'
}) {
  const classes = (className as string | undefined)?.split(' ') ?? []

  const contentBackground = classes.find((cls) => cls.startsWith('bg-'))?.replace('bg-', '')
  const contentForeground = classes.find((cls) => cls.startsWith('text-'))?.replace('text-', '')

  const shadowClass = classes.find((cls) => cls.startsWith('shadow-'))
  const borderClasses = classes.filter((cls) => cls.startsWith('border'))

  const shadowMap: Record<string, string> = {
    'shadow-sm':  'drop-shadow(0 1px 1px rgb(0 0 0 / 0.05))',
    'shadow':     'drop-shadow(0 1px 3px rgb(0 0 0 / 0.1)) drop-shadow(0 1px 2px rgb(0 0 0 / 0.06))',
    'shadow-md':  'drop-shadow(0 4px 3px rgb(0 0 0 / 0.07)) drop-shadow(0 2px 2px rgb(0 0 0 / 0.06))',
    'shadow-lg':  'drop-shadow(0 10px 8px rgb(0 0 0 / 0.04)) drop-shadow(0 4px 3px rgb(0 0 0 / 0.1))',
    'shadow-xl':  'drop-shadow(0 20px 13px rgb(0 0 0 / 0.03)) drop-shadow(0 8px 5px rgb(0 0 0 / 0.08))',
    'shadow-2xl': 'drop-shadow(0 25px 25px rgb(0 0 0 / 0.15))',
  }

  const borderColorClass = classes.find((cls) => cls.startsWith('border-') && cls !== 'border')
  const borderColor = borderColorClass?.replace('border-', '')

  const filters: string[] = []

  if (shadowClass && shadowMap[shadowClass]) {
    filters.push(shadowMap[shadowClass])
  }

  if (borderClasses.length > 0) {
    const color = borderColor
      ? `hsl(var(--${borderColor}))`
      : 'hsl(var(--border))'
    filters.push(`drop-shadow(0 0 0 1px ${color})`)
  }

  const cleanedClassName = classes
    .filter((cls) =>
      !cls.startsWith('shadow-') &&
      !cls.startsWith('border')
    )
    .join(' ')

  return (
    <Tooltip.Portal>
      <Tooltip.Positioner sideOffset={sideOffset} side={side} align={align}>
        <Tooltip.Popup
          data-slot="tooltip-content"
          style={
            {
              '--content-background': contentBackground
                ? `hsl(var(--${contentBackground}))`
                : 'hsl(var(--primary))',
              '--content-foreground': contentForeground
                ? `hsl(var(--${contentForeground}))`
                : 'hsl(var(--primary-foreground))',
              ...(filters.length > 0 && { filter: filters.join(' ') }),
            } as React.CSSProperties
          }
          className={cn(
            'bg-(--content-background) text-(--content-foreground) animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 z-50 w-fit origin-(--transform-origin) rounded-lg px-3 py-2 text-sm text-balance',
            cleanedClassName,
          )}
          {...props}
        >
          {children}

          <Tooltip.Arrow className="fill-(--content-background)" />
        </Tooltip.Popup>
      </Tooltip.Positioner>
    </Tooltip.Portal>
  )
}

export { TooltipRoot as Tooltip, TooltipContent, TooltipProvider, TooltipTrigger }
