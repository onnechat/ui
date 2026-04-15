import * as React from 'react'

import { cn } from '@/lib/cn'

type KeyProps = React.ComponentProps<'kbd'>

export function Key({ className, ...props }: KeyProps) {
  return (
    <kbd
      className={cn(
        'inline-flex justify-center items-center py-0.75 px-2 text-sm bg-muted border font-mono text-muted-foreground shadow-[0px_2px_0px_0px_rgba(0,0,0,0.08)] dark:shadow-[0px_2px_0px_0px_rgba(255,255,255,0.1)] rounded-lg',
        className,
      )}
      {...props}
    />
  )
}

type KeyboardInputProps = React.ComponentProps<'div'> & {
  keybind: string | string[]
}

export function KeyboardShortcut({
  keybind,
  className,
  ...props
}: KeyboardInputProps) {
  return Array.isArray(keybind) ? (
    <div className={cn('flex items-center gap-1', className)}>
      {keybind.map((k) => (
        <Key key={k} {...props}>
          {k}
        </Key>
      ))}
    </div>
  ) : (
    <Key className={className} {...props}>
      {keybind}
    </Key>
  )
}
