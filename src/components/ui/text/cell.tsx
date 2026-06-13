
import { cn } from '@/lib/cn'

export const Cell = ({
  wrap = false,
  children,
  className,
  ...props
}: React.HTMLAttributes<HTMLSpanElement> & {
  wrap?: boolean
}) => {

  return (
    <span
      {...props}
      className={cn(
        wrap ? 'whitespace-normal' : 'text-nowrap whitespace-nowrap',
        !children && 'italic opacity-50',
        className,
      )}
    >
      {children || 'notDefined'}
    </span>
  )
}
