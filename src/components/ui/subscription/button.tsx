import React from 'react'

import { Billing } from '@/types/billing.type'

import { api } from '@/lib/api'
import { cn } from '@/lib/cn'

import { useCustomQuery } from '@/hooks/use-custom-query'
import { useWorkspace } from '@/hooks/workspaces/use-workspace'

import { Icon } from '@/components/icon'

import { Button } from '@/components/ui/button'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'

export const SubscriptionButton = ({
  children: childrenProp,
  ...props
}: React.ComponentProps<typeof Button>) => {
  const router = { push: (_url: string) => {}, replace: (_url: string) => {}, back: () => {}, forward: () => {}, refresh: () => {}, prefetch: (_url: string) => {} };
  const { slug } = useParams()

  const { workspace } = useWorkspace(slug as string)

  const { data: billing, isLoading: isLoadingBilling } =
    useCustomQuery<Billing>({
      queryKey: ['billing', workspace?.id],
      queryFn: () =>
        api.get(`/establishments/${workspace?.id}/billing/subscription`),
      enabled: !!workspace?.id,
    })

  /**
   * The user has a active subscription when:
   * - The subscription is active (ACTIVE)
   * - The subscription is trialing (TRIALING)
   */
  const hasSubscription = !!(
    billing?.status === 'ACTIVE' || billing?.status === 'TRIALING'
  )

  /**
   * The button is disabled when:
   * - The billing is loading
   * - The user doesn't have a subscription
   * - The button is explicitly disabled
   */
  const isDisabled = isLoadingBilling || props.disabled

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!hasSubscription) {
      router.push(`/workspace/${slug}/settings/billing`)
    } else {
      props.onClick?.(e)
    }
  }

  /**
   * Remove Icon from children to avoid double icon rendering
   * when the user doesn't have a subscription
   */
  const children = !hasSubscription
    ? React.Children.map(childrenProp, (child) => {
        if (React.isValidElement(child) && child.type === Icon) {
          return null
        } else {
          return child
        }
      })
    : childrenProp

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <div className={cn(isDisabled && 'cursor-not-allowed')}>
          <Button
            {...props}
            disabled={isDisabled}
            onClick={handleClick}
            className={cn(props.className, 'min-w-10')}
          >
            {children}

            {!isLoadingBilling && !hasSubscription && (
              <Icon name="Crown" className="size-4" />
            )}
          </Button>
        </div>
      </TooltipTrigger>

      {!isLoadingBilling && !hasSubscription && (
        <TooltipContent>{'need_subscription'}</TooltipContent>
      )}
    </Tooltip>
  )
}
