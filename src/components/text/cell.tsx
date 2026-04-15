import { useTranslations } from 'next-intl'

import { cn } from '@/lib/cn'

export const Cell = ({
  wrap = false,
  children,
  className,
  ...props
}: React.HTMLAttributes<HTMLSpanElement> & {
  wrap?: boolean
}) => {
  const t = useTranslations('common')

  return (
    <span
      {...props}
      className={cn(
        wrap ? 'whitespace-normal' : 'text-nowrap whitespace-nowrap',
        !children && 'italic opacity-50',
        className,
      )}
    >
      {children || t('notDefined')}
    </span>
  )
}
