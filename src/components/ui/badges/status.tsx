
import { Badge } from '@/components/internal/badge'

export const StatusBadge = ({ status }: { status: string }) => {

  const variant =
    status === 'PENDING'
      ? 'warning'
      : status === 'ACCEPTED'
        ? 'success'
        : status === 'CANCELLED'
          ? 'destructive'
          : 'outline'

  return <Badge variant={variant}>{status}</Badge>
}
