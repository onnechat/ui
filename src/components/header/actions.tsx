'use client'

import Link from 'next/link'
import { useTranslations } from 'next-intl'

import { AnimatePresence, motion } from 'motion/react'

import { cn } from '@/lib/cn'

import { useIsClient } from '@/hooks/use-is-client'
import { useMe } from '@/hooks/user/use-me'

import { TEST_ID } from '@/constants/tests/id'

import { Icon } from '@/components/icon/index'
import { LanguageSwitch } from '@/components/language-switch'

import { Button, type ButtonVariants } from '@/components/ui/button'

export function HeaderActions({
  className,
  bottom,
}: {
  className?: string
  bottom?: boolean
}) {
  const t = useTranslations('header.actions')
  const { me: user, isFetching: loading } = useMe()
  const mounted = useIsClient()

  const animationVariants = {
    initial: { opacity: 0, x: bottom ? 0 : 8, y: bottom ? -8 : 0 },
    animate: { opacity: 1, x: bottom ? 0 : 0, y: bottom ? 0 : 0 },
    transition: { duration: 0.5, ease: 'easeInOut' as const },
  }

  if (!mounted) {
    return (
      <div
        suppressHydrationWarning
        className={cn('flex items-center justify-end gap-2 h-full', className)}
      />
    )
  }

  return (
    <>
      <AnimatePresence mode="popLayout">
        {user ? (
          <motion.div
            {...(mounted ? animationVariants : {})}
            className={cn(
              'flex items-center justify-center gap-2',
              bottom && 'w-full',
            )}
          >
            <Button
              asChild
              variant="default"
              data-testid={TEST_ID.BUTTON.DASHBOARD}
              className={cn(
                'group rounded-2xl py-2.25 h-auto active:scale-[99.35%] gap-1!',
                bottom && 'w-full text-base py-4 h-12 lg:h-auto',
              )}
            >
              <Link href="/workspace" scroll={false}>
                {t('dashboard')}
                <Icon
                  name="ChevronRight"
                  className="size-4 translate-x-0.5 group-hover:translate-x-1 transition-transform fill-transparent"
                />
              </Link>
            </Button>
          </motion.div>
        ) : !loading ? (
          <motion.div
            {...(mounted ? animationVariants : {})}
            className={cn(
              'flex items-center justify-center gap-2 w-full',
              bottom && 'w-full grid xs:grid-cols-2 gap-4',
              className,
            )}
          >
            {[
              {
                variant: 'default',
                label: t('login'),
                href: '/auth/login',
                dataTestId: TEST_ID.BUTTON.LOGIN,
                className: !bottom ? 'max-md:hidden' : 'w-full',
              },
              {
                variant: 'primary',
                label: t('tryNow'),
                href: '/auth/register',
                dataTestId: TEST_ID.BUTTON.REGISTER,
                className: cn(
                  'relative after:content-[""] after:absolute after:inset-0 after:rounded-2xl after:outline-6 after:outline-transparent after:-z-10 after:animate-pulse-button hover:scale-105 hover:shadow-[0_0_20px_4px_oklch(from_var(--primary)_l_c_h_/_0.35)] transition-[transform,box-shadow] duration-200',
                  bottom && 'w-full',
                ),
              },
            ].map(({ label, href, variant, className, dataTestId }) => (
              <Button
                asChild
                key={`${href}-${variant}`}
                data-testid={dataTestId}
                variant={variant as ButtonVariants}
                className={cn(
                  'rounded-2xl py-2.25 h-auto active:scale-[99.35%]',
                  bottom && 'py-3.5 text-lg h-12 lg:h-auto',
                  className,
                )}
              >
                <Link href={href} scroll={false}>
                  {label}
                </Link>
              </Button>
            ))}
          </motion.div>
        ) : null}
      </AnimatePresence>

      <div className="hidden lg:flex items-center gap-2">
        <LanguageSwitch
          type="flag"
          align="end"
          classNames={{
            trigger: 'bg-input',
            content: 'bg-input p-0',
          }}
        />
      </div>
    </>
  )
}
