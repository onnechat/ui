
import { cn } from '@/lib/cn'

import { Badge } from '@/components/internal/badge'

export const RoleBadge = ({
  role,
  className,
}: {
  role: string
  className?: string
}) => {

  const transformed = role
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toUpperCase()

  const variant = transformed === 'ADMIN' ? 'default' : 'outline'
  const label = transformed === 'ADMIN' ? 'ADMIN' : 'USER'

  return (
    <Badge variant={variant} className={cn('text-xs', className)}>
      {label}
    </Badge>
  )
}
