'use client'

import * as React from 'react'

import * as TooltipPrimitive from '@radix-ui/react-tooltip'

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
  delayDuration = 400,
  skipDelayDuration = 300,
  ...props
}: React.ComponentProps<typeof TooltipPrimitive.Provider>) {
  return (
    <TooltipPrimitive.Provider
      data-slot="tooltip-provider"
      delayDuration={delayDuration}
      skipDelayDuration={skipDelayDuration}
      {...props}
    />
  )
}

function Tooltip({
  ...props
}: React.ComponentProps<typeof TooltipPrimitive.Root>) {
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
  ...props
}: React.ComponentProps<typeof TooltipPrimitive.Trigger>) {
  const { open, setOpen, isMobile } = useTooltipContext()

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (isMobile) {
      e.preventDefault()
      setOpen(!open)
    }

    onClick?.(e)
  }

  return (
    <TooltipPrimitive.Trigger
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
  ...props
}: React.ComponentProps<typeof TooltipPrimitive.Content>) {
  const contentBackground = className
    ?.split(' ')
    .find((cls) => cls.startsWith('bg-'))
    ?.replace('bg-', '')

  const contentForeground = className
    ?.split(' ')
    .find((cls) => cls.startsWith('text-'))
    ?.replace('text-', '')

  return (
    <TooltipPrimitive.Portal>
      <TooltipPrimitive.Content
        data-slot="tooltip-content"
        sideOffset={sideOffset}
        style={
          {
            '--content-background': contentBackground
              ? `hsl(var(--${contentBackground}))`
              : 'hsl(var(--primary))',
            '--content-foreground': contentForeground
              ? `hsl(var(--${contentForeground}))`
              : 'hsl(var(--primary-foreground))',
          } as React.CSSProperties
        }
        className={cn(
          'bg-(--content-background) text-(--content-foreground) animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 z-50 w-fit origin-(--radix-tooltip-content-transform-origin) rounded-lg px-3 py-2 text-sm text-balance',
          className,
        )}
        {...props}
      >
        {children}

        <TooltipPrimitive.Arrow className="fill-(--content-background)" />
      </TooltipPrimitive.Content>
    </TooltipPrimitive.Portal>
  )
}

export { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger }
