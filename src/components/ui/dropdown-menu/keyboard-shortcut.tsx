import * as React from "react"
import { cn } from "@/lib/cn"

export const KeyboardShortcut = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLSpanElement>) => {
  return (
    <span
      className={cn("ml-auto text-xs tracking-widest opacity-60", className)}
      {...props}
    />
  )
}
KeyboardShortcut.displayName = "KeyboardShortcut"
