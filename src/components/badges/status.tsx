import { useTranslations } from 'next-intl'

import { Badge } from '@/components/ui/badge'

export const StatusBadge = ({ status }: { status: string }) => {
  const t = useTranslations('statuses')

  const variant =
    status === 'PENDING'
      ? 'warning'
      : status === 'ACCEPTED'
        ? 'success'
        : status === 'CANCELLED'
          ? 'destructive'
          : 'outline'

  return <Badge variant={variant}>{t(status)}</Badge>
}
