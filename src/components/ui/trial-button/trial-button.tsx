'use client'

import { TextMorph } from 'torph/react'

import { Trial } from '@/types/trial.type'

import { cn } from '@/lib/cn'

import { useCustomQuery } from '@/hooks/use-custom-query'
import { useIsClient } from '@/hooks/use-is-client'

import { Icon, IconType } from '@/components/icon'

import { Button } from '@/components/internal/button'

const FALLBACK_TRIAL_DAYS = 0

export const TrialButton = ({ className }: { className?: string }) => {

  const mounted = useIsClient()

  const { data, isLoading } = useCustomQuery<Trial>({
    queryKey: ['trial'],
    queryFn: async () => {
      const response = await fetch('/api/trial')
      return (await response.json()) as Trial
    },
  })

  return (
    <>
      <Button
        asChild
        variant="primary"
        className={cn(
          'rounded-2xl px-6 py-3 min-h-12 h-fit text-sm sm:text-base ring-4 ring-primary/15 focus-visible:border-primary focus-visible:ring-primary/35 focus-visible:ring-8 transition-[ring] duration-500 animate-fade-in',
          className,
        )}
      >
        <a
          href="/auth/register"
          className="relative flex items-center justify-center"
        >
          <span
            aria-hidden
            className={cn(
              'transition-all duration-500',
              mounted ? 'opacity-0 sr-only' : 'opacity-100',
            )}
          >
            {'trialLoading'}
          </span>

          <TextMorph as="span" className="absolute">
            {isLoading
              ? 'trialLoading'
              : `trial ${data?.trialDays ?? FALLBACK_TRIAL_DAYS} days`}
          </TextMorph>
        </a>
      </Button>

      <div className="flex flex-col md:flex-row lg:flex-col items-center lg:items-start gap-4 animate-fade-in">
        {[
          {
            icon: 'CheckDouble',
            label: 'noCreditCard',
          },
          {
            icon: 'CheckDouble',
            label: 'noCommitment',
          },
        ].map((item) => (
          <div
            key={`${item.icon}-${item.label}`}
            className="flex items-center gap-3"
          >
            <Icon
              name={item.icon as IconType}
              className="size-4 text-success"
            />

            <p className="text-muted-foreground text-sm">{item.label}</p>
          </div>
        ))}
      </div>
    </>
  )
}
