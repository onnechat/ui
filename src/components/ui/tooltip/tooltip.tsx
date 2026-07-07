'use client'

import * as React from 'react'

import { Tooltip as TooltipPrimitive } from '@base-ui/react/tooltip'

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
}: TooltipPrimitive.Provider.Props) {
  return (
    <TooltipPrimitive.Provider
      data-slot="tooltip-provider"
      delay={delay}
      timeout={timeout}
      {...props}
    />
  )
}

function TooltipRoot({ ...props }: TooltipPrimitive.Root.Props) {
  const isMobile = useIsMobile()
  const [open, setOpen] = React.useState(false)

  const contextValue = React.useMemo(
    () => ({ open, setOpen, isMobile }),
    [open, isMobile],
  )

  return (
    <TooltipContext.Provider value={contextValue}>
      <TooltipProvider>
        <TooltipPrimitive.Root
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
  asChild,
  children,
  ...props
}: TooltipPrimitive.Trigger.Props & {
  asChild?: boolean
}) {
  const { open, setOpen, isMobile } = useTooltipContext()

  const handleClick: TooltipPrimitive.Trigger.Props['onClick'] = (e) => {
    if (isMobile) {
      e.preventDefault()
      setOpen(!open)
    }

    onClick?.(e)
  }

  if (asChild && React.isValidElement(children)) {
    return (
      <TooltipPrimitive.Trigger
        data-slot="tooltip-trigger"
        onClick={handleClick}
        render={children as React.ReactElement<Record<string, unknown>>}
        {...props}
      />
    )
  }

  return (
    <TooltipPrimitive.Trigger
      data-slot="tooltip-trigger"
      onClick={handleClick}
      {...props}
    >
      {children}
    </TooltipPrimitive.Trigger>
  )
}

function TooltipContent({
  className,
  side,
  align,
  sideOffset = 0,
  children,
  ...props
}: Omit<TooltipPrimitive.Popup.Props, 'className'> &
  Pick<TooltipPrimitive.Positioner.Props, 'side' | 'align' | 'sideOffset'> & {
    className?: string
  }) {
  const classes = className?.split(' ') ?? []

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
      ? `var(--${borderColor})`
      : 'var(--border)'
    filters.push(`drop-shadow(0 0 0 1px ${color})`)
  }

  const cleanedClassName = classes
    .filter((cls) =>
      !cls.startsWith('shadow-') &&
      !cls.startsWith('border')
    )
    .join(' ')

  return (
    <TooltipPrimitive.Portal>
      <TooltipPrimitive.Positioner
        data-slot="tooltip-positioner"
        side={side}
        align={align}
        sideOffset={sideOffset}
        className="z-50"
      >
        <TooltipPrimitive.Popup
          data-slot="tooltip-content"
          style={
            {
              '--content-background': contentBackground
                ? `var(--${contentBackground})`
                : 'var(--primary)',
              '--content-foreground': contentForeground
                ? `var(--${contentForeground})`
                : 'var(--primary-foreground)',
              ...(filters.length > 0 && { filter: filters.join(' ') }),
            } as React.CSSProperties
          }
          className={cn(
            'bg-(--content-background) text-(--content-foreground) z-50 w-fit origin-(--transform-origin) rounded-lg px-3 py-2 text-sm text-balance',
            'transition-[transform,scale,opacity] duration-150 ease-out',
            'data-starting-style:scale-95 data-starting-style:opacity-0',
            'data-ending-style:scale-95 data-ending-style:opacity-0 data-ending-style:duration-100 data-ending-style:ease-in',
            cleanedClassName,
          )}
          {...props}
        >
          {children}

          <TooltipPrimitive.Arrow className="flex data-[side=bottom]:top-[-6px] data-[side=top]:bottom-[-6px] data-[side=top]:rotate-180 data-[side=left]:right-[-10px] data-[side=left]:rotate-90 data-[side=right]:left-[-10px] data-[side=right]:-rotate-90">
            <svg width="14" height="7" viewBox="0 0 14 7" fill="none">
              <path
                d="M0 7L6.29289 0.707107C6.68342 0.316583 7.31658 0.316583 7.70711 0.707107L14 7H0Z"
                className="fill-(--content-background)"
              />
            </svg>
          </TooltipPrimitive.Arrow>
        </TooltipPrimitive.Popup>
      </TooltipPrimitive.Positioner>
    </TooltipPrimitive.Portal>
  )
}

const Tooltip = Object.assign(TooltipRoot, { Provider: TooltipProvider, Content: TooltipContent, Trigger: TooltipTrigger })

export { Tooltip }
