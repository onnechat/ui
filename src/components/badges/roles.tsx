import { useTranslations } from 'next-intl'

import { cn } from '@/lib/cn'

import { Badge } from '@/components/ui/badge'

export const RoleBadge = ({
  role,
  className,
}: {
  role: string
  className?: string
}) => {
  const t = useTranslations('roles')

  const transformed = role
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toUpperCase()

  const variant = transformed === 'ADMIN' ? 'default' : 'outline'
  const label = transformed === 'ADMIN' ? t('ADMIN') : t('USER')

  return (
    <Badge variant={variant} className={cn('text-xs', className)}>
      {label}
    </Badge>
  )
}
