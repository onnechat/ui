
import { cn } from '@/lib/cn'

interface CellProps extends React.HTMLAttributes<HTMLSpanElement> {
  wrap?: boolean
  emptyText?: string
}

export const Cell = ({
  wrap = false,
  children,
  className,
  emptyText = 'Not defined',
  ...props
}: CellProps) => {

  return (
    <span
      {...props}
      className={cn(
        wrap ? 'whitespace-normal' : 'text-nowrap whitespace-nowrap',
        !children && 'italic opacity-50',
        className,
      )}
    >
      {children || emptyText}
    </span>
  )
}
