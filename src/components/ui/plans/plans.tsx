'use client'

import NumberFlow from '@number-flow/react'
import confetti from 'canvas-confetti'
import Cookies from 'js-cookie'
import { TextMorph } from 'torph/react'

import { createContext, useContext, useMemo, useRef, useState } from 'react'

import { AnimatePresence, motion } from 'motion/react'

import { AvailableLocale } from '@/config/locales'
import { getPreviousPlan, plans as BASE_PLANS } from '@/config/plans'

import { api } from '@/lib/api'
import { cn } from '@/lib/cn'
import { env } from '@/lib/env'

import { useCustomQuery } from '@/hooks/use-custom-query'
import { useFormat } from '@/hooks/use-format'
import { useMe } from '@/hooks/user/use-me'
import { useWorkspace } from '@/hooks/workspaces/use-workspace'

import { COOKIES_KEYS } from '@/constants/keys'

import { Card } from '@/components/ui/card'
import { Icon, IconType } from '@/components/icon'

import { Button } from '@/components/internal/button'
import { Skeleton } from '@/components/internal/skeleton'
import { Switch } from '@/components/internal/switch'

export type AvailablePlans = (typeof BASE_PLANS)[number]['id']

const BILLING_PERIODS = {
  MONTHLY: 'monthly',
  ANNUAL: 'annual',
} as const

export type BillingPeriod =
  (typeof BILLING_PERIODS)[keyof typeof BILLING_PERIODS]

type PlansContextValue = {
  period: BillingPeriod
  setPeriod: (period: BillingPeriod) => void
  plans: ReturnType<typeof usePlansData>['plans']
  isPlansLoading: boolean
  isTrial?: boolean
  isLoading?: boolean
  currentPlan?: AvailablePlans
  workspaceName?: string
  onSelectPlan?: (plan: AvailablePlans, period: BillingPeriod) => void
}

const PlansContext = createContext<PlansContextValue | null>(null)

const usePlansContext = () => {
  const ctx = useContext(PlansContext)

  if (!ctx) {
    throw new Error('Plans components must be used within a PlansProvider')
  }

  return ctx
}

const usePlansData = (locale: AvailableLocale) => {

  const { data: plansData, isLoading: isPlansLoading } = useCustomQuery<Array<{ name: string; limits: Record<string, number>; pricingOptions: unknown }>>({
    queryKey: ['plans'],
    queryFn: () => api.get('/billing/plans'),
  })

  const externalPlanData = Array.isArray(plansData)
    ? plansData
        .filter((plan) => plan.name.toLowerCase() !== 'enterprise')
        .map((plan) => ({
          name: plan.name,
          limits: plan.limits,
          pricing: plan.pricingOptions,
        }))
    : undefined

  const pricingEnabled = env.features.pricing.available

  const plans = useMemo(() => {
    return BASE_PLANS.map((plan, index) => {
      const price = {
        note: plan.price?.note?.[locale] ?? '',
      }

      const limits = externalPlanData?.find(
        (limit) => limit.name.toLowerCase() === plan.name.toLowerCase(),
      )?.limits ?? {
        maxAppointments: 0,
        maxWhatsApps: 0,
        maxProfessionals: 0,
        maxUsers: 0,
      }

      const pricing = externalPlanData?.find(
        (pricing) => pricing.name.toLowerCase() === plan.name.toLowerCase(),
      )?.pricing

      const previousPlan = index > 0 ? getPreviousPlan(index) : undefined

      return {
        ...plan,
        disabled: !pricingEnabled || Boolean(plan.disabled),
        canSelect: pricingEnabled,
        price,
        pricing,
        tagline: plan.taglineKey,
        previousPlan,
        features: plan.features
          .map((feature) => {
            if (!feature.countKey) {
              return feature.translationKey
            }

            const count = limits?.[feature.countKey] ?? 0

            if (feature.omitWhenZero && count === 0) {
              return null
            }

            return feature.translationKey, { count }
          })
          .filter((feature): feature is string => !!feature),
      }
    })
  }, [locale, externalPlanData, pricingEnabled])

  return { plans, isPlansLoading }
}

type PlansProviderProps = {
  children: React.ReactNode
  className?: string
  isTrial?: boolean
  isLoading?: boolean
  currentPlan?: AvailablePlans
  workspaceName?: string
  onSelectPlan?: (plan: AvailablePlans, period: BillingPeriod) => void
}

const PlansProvider = ({
  children,
  isTrial,
  isLoading,
  currentPlan,
  workspaceName,
  onSelectPlan,
}: PlansProviderProps) => {
  const locale = "pt-BR" as AvailableLocale
  const [period, setPeriod] = useState<BillingPeriod>(BILLING_PERIODS.ANNUAL)

  const { plans, isPlansLoading } = usePlansData(locale)

  const value = useMemo(
    () => ({
      period,
      setPeriod,
      plans,
      isPlansLoading,
      isTrial,
      isLoading,
      currentPlan,
      workspaceName,
      onSelectPlan,
    }),
    [
      period,
      plans,
      isPlansLoading,
      isTrial,
      isLoading,
      currentPlan,
      workspaceName,
      onSelectPlan,
    ],
  )

  return <PlansContext.Provider value={value}>{children}</PlansContext.Provider>
}

type PlansSwitchProps =
  | {
      invert?: boolean
    }
  | {
      double?: boolean
    }

const PlansSwitch = ({ ...props }: PlansSwitchProps) => {
  const { period, setPeriod, isPlansLoading } = usePlansContext()

  const switchRef = useRef<HTMLButtonElement>(null)

  const invert = 'invert' in props ? props.invert : false
  const double = 'double' in props ? props.double : false

  const Label = (props: React.ComponentProps<'span'>) => {
    return <span className="text-muted-foreground" {...props} />
  }

  const handleSwitchPeriod = (checked: boolean) => {
    setPeriod(checked ? BILLING_PERIODS.ANNUAL : BILLING_PERIODS.MONTHLY)
  }

  const handleClickSwitch = async (
    event: React.MouseEvent<HTMLButtonElement>,
  ) => {
    try {
      if (isPlansLoading || period === BILLING_PERIODS.ANNUAL) return

      const rect = event.currentTarget.getBoundingClientRect()

      const x = rect.left + rect.width / 2
      const y = rect.top + rect.height / 2

      await confetti({
        origin: {
          x: x / window.innerWidth,
          y: y / window.innerHeight,
        },
      })
    } catch {
      console.error('Confetti error')
    }
  }

  const handleClickLabel = () => {
    switchRef.current?.click()
  }

  if (isPlansLoading) {
    return <Skeleton className="w-42 h-7 translate-y-0.5" />
  }

  return (
    <div
      className={cn(
        'flex items-center justify-center gap-4',
        invert && 'flex-row-reverse',
      )}
    >
      {double ? (
        <>
          <Label
            onClick={handleClickLabel}
            className="cursor-pointer select-none"
          >
            {`switch.${BILLING_PERIODS.MONTHLY}`}
          </Label>

          <Switch
            ref={switchRef}
            onClick={handleClickSwitch}
            onCheckedChange={handleSwitchPeriod}
            checked={period === BILLING_PERIODS.ANNUAL}
            aria-label={'switchAriaLabel'}
          />

          <Label
            onClick={handleClickLabel}
            className="cursor-pointer select-none"
          >
            {`switch.${BILLING_PERIODS.ANNUAL}`}
          </Label>
        </>
      ) : (
        <>
          <Switch
            ref={switchRef}
            onClick={handleClickSwitch}
            onCheckedChange={handleSwitchPeriod}
            checked={period === BILLING_PERIODS.ANNUAL}
            aria-label={'switchAriaLabel'}
          />

          <Label
            onClick={handleClickLabel}
            className="cursor-pointer select-none"
          >
            {`switch.${period}`}
          </Label>
        </>
      )}
    </div>
  )
}

const PlansList = ({ className }: { className?: string }) => {
  const router = { push: (_url: string) => {}, replace: (_url: string) => {}, back: () => {}, forward: () => {}, refresh: () => {}, prefetch: (_url: string) => {} };
  const pathname = "/";

  const locale = "pt-BR";
  const format = useFormat()

  const workspaceSlug = Cookies.get(COOKIES_KEYS.WORKSPACE_SLUG)

  const { me } = useMe()
  const { workspace } = useWorkspace(workspaceSlug)

  const ref = useRef<HTMLDivElement>(null)

  const {
    period,
    plans,
    isPlansLoading,
    isTrial,
    isLoading,
    currentPlan,
    onSelectPlan,
  } = usePlansContext()

  const isLoggedIn = !!me

  const handleWhatsAppRedirect = (planName: string) => {
    const whatsappNumber = env.phone.whatsapp
    if (!whatsappNumber) return

    const clean = whatsappNumber.replace(/\D/g, '')
    const hasWorkspaceSelected =
      !!workspaceSlug && pathname.startsWith(`/workspace/${workspaceSlug}`)

    const message = encodeURIComponent(
      isLoggedIn
        ? (hasWorkspaceSelected
          ? ('loggedIn.withWorkspace', {
              plan: planName,
              workspace: workspace?.name ?? '',
              period: `switch.${period}`,
            })
          : ('loggedIn.withoutWorkspace', {
              plan: planName,
              period: `switch.${period}`,
              brand: env.brand.name,
            }))
        : ('loggedOut', {
            plan: planName,
            period: `switch.${period}`,
            brand: env.brand.name,
          }),
    )

    const url = `https://wa.me/${clean}?text=${message}`
    window.open(url, '_blank')
  }

  if (isPlansLoading) {
    return (
      <div
        ref={ref}
        className={cn(
          'w-full grid gap-4 sm:gap-6 md:grid-cols-2 xl:grid-cols-3',
          className,
        )}
      >
        {Array.from({ length: 3 }).map((_, index) => (
          <Skeleton key={index} className="w-full h-150" />
        ))}
      </div>
    )
  }

  return (
    <div
      ref={ref}
      className={cn(
        'w-full grid gap-4 sm:gap-6 md:grid-cols-2 xl:grid-cols-3',
        ref.current?.clientWidth &&
          ref.current?.clientWidth < 768 &&
          'xl:grid-cols-3',
        className,
      )}
    >
      <>
        {plans.map((plan) => {
          const hasPricingFromAPI = !!plan.pricing && plan.pricing.length > 0

          const isCurrentPlan = isTrial
            ? false
            : currentPlan
              ? currentPlan === plan.id
              : false

          const isDisabled = plan.disabled
          const isAvailable = plan.canSelect
          const isConsultation = plan.consultation || !hasPricingFromAPI

          const isHighlighted =
            (plan.highlight && !isDisabled) ||
            (plans.filter((plan) => !plan.disabled).length === 1 && !isDisabled)

          const highlightPlan = isHighlighted

          const monthlyPriceObj =
            plan.pricing?.find(
              (pricing: { billingPeriod: string }) =>
                pricing.billingPeriod === BILLING_PERIODS.MONTHLY,
            ) ?? null

          const monthlyPrice = monthlyPriceObj?.amount ?? 0

          const yearlyPriceObj =
            plan.pricing?.find(
              (pricing: { billingPeriod: string }) =>
                pricing.billingPeriod === BILLING_PERIODS.ANNUAL,
            ) ?? null

          const yearlyPrice = yearlyPriceObj?.amount ?? 0

          const discountPercent =
            monthlyPrice && yearlyPrice && monthlyPrice > 0
              ? Math.round(
                  ((monthlyPrice * 12 - yearlyPrice) / (monthlyPrice * 12)) *
                    100,
                )
              : 0

          const showDiscount = env.features.pricing.showDiscount
            ? period === BILLING_PERIODS.ANNUAL &&
              !!discountPercent &&
              discountPercent > 0 &&
              !isDisabled &&
              !isConsultation
            : false

          return (
            <Card
              key={plan.name}
              className={cn(
                'relative h-full min-h-150 text-card-foreground rounded-xl bg-(--plan-border) p-1',
                isDisabled &&
                  'grayscale max-sm:hidden blur-xs pointer-events-none select-none',
              )}
              style={
                {
                  /* Plan */
                  '--plan': highlightPlan ? 'var(--primary)' : 'var(--card)',
                  '--plan-border': highlightPlan
                    ? 'color-mix(in srgb, var(--plan) 20%, transparent)'
                    : 'var(--card)',
                  /* Discount */
                  '--plan-discount': highlightPlan
                    ? 'var(--primary)'
                    : 'color-mix(in srgb, var(--foreground) 15%, transparent)',
                  '--plan-discount-foreground': highlightPlan
                    ? 'var(--primary-foreground)'
                    : 'var(--foreground)',
                } as React.CSSProperties
              }
            >
              <Card.Header className="flex-col items-start gap-3 bg-muted rounded-t-[calc(var(--card-radius)-var(--card-padding))] mb-0">
                <div className="flex items-center justify-between w-full">
                  <div className="flex items-center gap-2.5">
                    <Icon
                      name={plan.icon as IconType}
                      className={cn(
                        'shrink-0 size-5 transition-all',
                        highlightPlan ? 'text-(--plan)' : 'text-foreground',
                      )}
                    />

                    <h3 className="text-foreground">{plan.name}</h3>
                  </div>

                  {showDiscount && (
                    <PlansDiscount
                      percent={discountPercent}
                      className="ml-auto translate-y-6 -translate-x-2"
                    />
                  )}
                </div>

                <div className="flex flex-col items-start justify-start gap-1 text-2xl sm:text-3xl md:text-4xl lg:text-[40px] font-title my-2 w-full">
                  <div className="flex flex-col items-start justify-end gap-1 w-full">
                    <div className="flex items-center justify-start tracking-tight w-full h-15">
                      {!(isDisabled || isConsultation) ? (
                        <div className="flex items-end justify-start gap-1 w-full">
                          <NumberFlow
                            locales={locale}
                            format={{
                              style: 'currency',
                              currency:
                                period === BILLING_PERIODS.MONTHLY
                                  ? monthlyPriceObj?.currency
                                  : yearlyPriceObj?.currency,
                            }}
                            value={format.centsToCurrency(
                              period === BILLING_PERIODS.MONTHLY
                                ? monthlyPrice
                                : yearlyPrice / 12,
                            )}
                          />

                          {!isDisabled && plan.price && (
                            <TextMorph className="text-muted-foreground text-sm mb-2.5 ml-0.5">
                              {plan.price?.note}
                            </TextMorph>
                          )}
                        </div>
                      ) : (
                        <span>{'onConsultation.title'}</span>
                      )}
                    </div>

                    <AnimatePresence mode="wait">
                      {period === BILLING_PERIODS.ANNUAL && (
                        <motion.span
                          transition={{ duration: 0.2 }}
                          initial={{ opacity: 0, y: -10, height: 0 }}
                          exit={{ opacity: 0, y: -10, height: 0 }}
                          animate={{ opacity: 1, y: 0, height: 'auto' }}
                          className="text-muted-foreground text-sm -mt-1"
                        >
                          {isConsultation
                            ? 'onConsultation.note'
                            : ('plan.singlePayment', {
                                price: format.currency({
                                  value:
                                    period === BILLING_PERIODS.ANNUAL
                                      ? yearlyPrice
                                      : monthlyPrice * 12,
                                  cents: true,
                                }),
                              })}
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </div>
                </div>

                {!isDisabled && (
                  <p className="text-muted-foreground text-sm text-balance">
                    {plan.tagline}
                  </p>
                )}
              </Card.Header>

              <hr className="border-3 border-(--plan-border) opacity-15" />

              <Card.Content className="bg-muted h-full p-4 rounded-none">
                <ul className="flex-1 space-y-4">
                  {plan.features.map((feature) => {
                    const length = feature.length

                    return (
                      <li
                        key={feature}
                        className="flex items-center gap-3 pr-4 text-sm"
                      >
                        <Icon
                          name="CheckDouble"
                          strokeWidth={3}
                          className={cn(
                            'shrink-0 size-4 fill-transparent!',
                            isDisabled
                              ? 'text-muted-foreground/15'
                              : 'text-success',
                          )}
                        />

                        {isDisabled ? (
                          <span
                            className="bg-foreground/5 -mt-0.25 leading-relaxed h-4 rounded-full"
                            style={{ width: `${length * 5}px` }}
                          />
                        ) : (
                          <span className="text-foreground/90 text-balance -mt-0.25 leading-relaxed">
                            {feature}
                          </span>
                        )}
                      </li>
                    )
                  })}
                </ul>
              </Card.Content>

              <hr className="border-3 border-(--plan-border) opacity-15" />

              <Card.Footer className="bg-muted rounded-b-[calc(var(--card-radius)-var(--card-padding))] mt-0">
                <Button
                  isLoading={isLoading}
                  disabled={isDisabled || isLoading}
                  className="w-full! rounded-xl py-3.5 h-fit"
                  variant={highlightPlan ? 'primary' : 'default'}
                  onClick={() => {
                    if (isConsultation) {
                      handleWhatsAppRedirect(plan.name)
                    } else if (isLoggedIn) {
                      onSelectPlan?.(plan.name as AvailablePlans, period)
                    } else {
                      router.push('/auth/login')
                    }
                  }}
                >
                  {isDisabled
                    ? 'unavailable'
                    : isConsultation
                      ? 'onConsultation.contactUs'
                      : isCurrentPlan
                        ? 'manage'
                        : isAvailable
                          ? (plan.cta || 'subscribe', { plan: plan.name })
                          : 'comingSoon'}

                  {(isCurrentPlan || isConsultation) && !isLoading && (
                    <Icon name="ExternalLink" className="size-3 opacity-50" />
                  )}
                </Button>
              </Card.Footer>

              {isHighlighted && (
                <div className="absolute inset-0 outline-6 outline-(--plan-border)/50 rounded-xl -z-10 animate-pulse duration-1000 ease-in-out" />
              )}
            </Card>
          )
        })}
      </>
    </div>
  )
}

const PlansRoot = ({
  children,
  isTrial,
  isLoading,
  currentPlan,
  workspaceName,
  onSelectPlan,
}: PlansProviderProps) => {
  return (
    <PlansProvider
      isTrial={isTrial}
      isLoading={isLoading}
      currentPlan={currentPlan}
      workspaceName={workspaceName}
      onSelectPlan={onSelectPlan}
    >
      {children}
    </PlansProvider>
  )
}

const Plans = Object.assign(PlansRoot, {
  Switch: PlansSwitch,
  List: PlansList,
})

const PlansSection = ({
  isTrial,
  isLoading,
  currentPlan,
  workspaceName,
  onSelectPlan,
  className,
}: {
  isTrial?: boolean
  isLoading?: boolean
  currentPlan?: AvailablePlans | undefined
  workspaceName?: string
  onSelectPlan?: (plan: AvailablePlans, period: BillingPeriod) => void
  className?: string
}) => {
  return (
    <Plans
      isTrial={isTrial}
      isLoading={isLoading}
      currentPlan={currentPlan}
      onSelectPlan={onSelectPlan}
      workspaceName={workspaceName}
    >
      <div className={cn('flex flex-col gap-4', className)}>
        <Plans.Switch double />
        <Plans.List />
      </div>
    </Plans>
  )
}

const PlansDiscount = ({
  percent,
  className,
}: {
  percent: number
  className?: string
}) => {
  const showDiscount = percent > 0
  if (!showDiscount) return null

  return (
    <motion.div
      key="discount-badge"
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.98 }}
      transition={{
        duration: 0.2,
        type: 'spring',
        stiffness: 100,
        damping: 10,
      }}
      className={cn(
        'absolute right-4 size-16 md:size-18 pointer-events-none select-none',
        className,
      )}
    >
      <svg
        viewBox="0 0 84 84"
        xmlns="http://www.w3.org/2000/svg"
        className="shrink-0 size-full text-(--plan-discount)"
      >
        <path
          fill="currentColor"
          d="M40.052.653a2 2 0 0 1 2.957 0l6.458 7.088a2 2 0 0 0 2.085.559l9.137-2.91a2 2 0 0 1 2.56 1.479l2.05 9.367a2 2 0 0 0 1.526 1.527l9.367 2.048a2 2 0 0 1 1.478 2.561l-2.91 9.137a2 2 0 0 0 .56 2.085l7.088 6.458a2 2 0 0 1 0 2.957l-7.088 6.458a2 2 0 0 0-.56 2.085l2.91 9.137a2 2 0 0 1-1.478 2.56l-9.367 2.05a2 2 0 0 0-1.527 1.526l-2.049 9.367a2 2 0 0 1-2.56 1.478l-9.137-2.91a2 2 0 0 0-2.085.56l-6.458 7.088a2 2 0 0 1-2.957 0l-6.458-7.088a2 2 0 0 0-2.085-.56l-9.137 2.91a2 2 0 0 1-2.56-1.478l-2.05-9.367a2 2 0 0 0-1.526-1.527L6.87 63.25a2 2 0 0 1-1.479-2.56l2.91-9.137a2 2 0 0 0-.559-2.085L.653 43.009a2 2 0 0 1 0-2.957l7.088-6.458A2 2 0 0 0 8.3 31.51l-2.91-9.137a2 2 0 0 1 1.479-2.56l9.367-2.05a2 2 0 0 0 1.527-1.526L19.81 6.87a2 2 0 0 1 2.561-1.479L31.51 8.3a2 2 0 0 0 2.085-.559L40.052.653Z"
        />
      </svg>

      <div className="absolute inset-0 flex flex-col items-center justify-center text-(--plan-discount-foreground) text-base md:text-lg font-semibold leading-[0.925em] tracking-[-0.02em]">
        <div className="flex items-center">
          <span>{percent}</span>
          <span className="mt-px">%</span>
        </div>
        <span>OFF</span>
      </div>
    </motion.div>
  )
}

export {
  Plans,
  PlansList,
  PlansProvider,
  PlansSection,
  PlansSwitch,
  usePlansContext,
}
