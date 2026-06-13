import Cookies from 'js-cookie'


import { Invite } from '@/types/invite.type'

import { api } from '@/lib/api'

import { useCustomQuery } from '@/hooks/use-custom-query'

import { ANIMATION } from '@/constants/animations'
import { COOKIES_KEYS } from '@/constants/keys'

import { Icon } from '@/components/icon'

import { Button } from '@/components/internal/button'

export const SidebarNotification = () => {
  const router = { push: (_url: string) => {}, replace: (_url: string) => {}, back: () => {}, forward: () => {}, refresh: () => {}, prefetch: (_url: string) => {} };

  const { data: invitesData, isFetching: isFetchingInvites } = useCustomQuery<
    Invite[]
  >({
    queryKey: ['invites', 'me'],
    queryFn: () => api.get('/me/invites'),
  })

  const count = invitesData?.length ?? 0
  const shouldShow = !isFetchingInvites && count > 0

  const handleRemoveWorkspace = () => {
    Cookies.remove(COOKIES_KEYS.WORKSPACE_SLUG)

    setTimeout(() => {
      router.push('/workspace/invites')
    }, ANIMATION.DURATION_FLOAT)
  }

  if (!shouldShow) return null

  return (
    <Button
      size="icon"
      variant="ghost"
      onClick={handleRemoveWorkspace}
      className="relative hover:bg-sidebar-accent hover:text-foreground"
    >
      <Icon name="Bell" className="size-4" />

      {count > 0 && (
        <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full size-4 shrink-0 flex items-center justify-center">
          {count}
        </span>
      )}
    </Button>
  )
}
