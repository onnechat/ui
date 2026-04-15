'use client'

import { useCallback, useEffect, useState } from 'react'

import Link from 'next/link'
import { useTranslations } from 'next-intl'

import { AnimatePresence, motion } from 'motion/react'

import { useIsMobile } from '@/hooks/use-mobile'

import { ANIMATION } from '@/constants/animations'

import { Icon } from '@/components/icon'
import { LanguageSwitch } from '@/components/language-switch'
import { Logo } from '@/components/logo'

import { Button } from '@/components/ui/button'

import { HeaderActions } from './actions'

export const Header = () => {
  const t = useTranslations('header.menu')
  const tAccessibility = useTranslations('accessibility')

  const isMobile = useIsMobile()

  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const handleToggleMenu = useCallback((state?: boolean) => {
    setIsMenuOpen((prev) => state ?? !prev)
  }, [])

  const menu = [
    {
      label: t('home'),
      href: '/',
    },
    {
      label: t('find'),
      href: '/find',
    },
    {
      label: t('blog'),
      href: '/blog',
    },
    {
      label: t('features'),
      href: '/#how',
      prefetch: false as const,
    },
    {
      label: t('pricing'),
      href: '/#pricing',
      prefetch: false as const,
    },
    {
      label: t('faq'),
      href: '/#faq',
      prefetch: false as const,
    },
  ]

  useEffect(() => {
    if (typeof window === 'undefined') return

    if (isMenuOpen) document.body.style.overflow = 'hidden'
    else document.body.style.overflow = 'revert-layer'
  }, [isMenuOpen])

  useEffect(() => {
    if (!isMobile && isMenuOpen) {
      handleToggleMenu(false)
    }
  }, [isMobile, isMenuOpen, handleToggleMenu])

  return (
    <>
      <header className="[--header-height:4rem] sm:[--header-height:5rem] ">
        <div className="fixed top-(--announcement-height,0px) w-full flex items-center justify-between overflow-hidden z-50 border-b border-foreground/5 bg-background">
          <div className="flex items-center justify-between gap-4 sm:gap-6 w-full max-w-container mx-auto p-4 sm:px-8 lg:border-x border-dashed border-foreground/5 h-(--header-height) overflow-hidden">
            <Link
              href="/"
              className="flex items-center justify-center outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] active:scale-[99.35%] active:grayscale transition-all rounded-md h-10"
            >
              <Logo classNames={{ text: 'hidden xs:block' }} />
            </Link>

            <nav className="hidden lg:flex min-w-fit h-10 items-center justify-center gap-1 mt-1">
              {menu.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  prefetch={item.prefetch}
                  className="text-sm hover:underline underline-offset-8 decoration-primary transition-colors active:scale-[99.35%] p-2 h-10"
                >
                  {item.label}
                </Link>
              ))}
            </nav>

            <div className="flex flex-1 items-center justify-end gap-2 h-10">
              <HeaderActions className="flex items-center justify-end gap-2 h-full" />

              <Button
                size="icon"
                variant="outline"
                className="lg:hidden bg-input"
                onClick={() => handleToggleMenu()}
                aria-label={
                  isMenuOpen
                    ? tAccessibility('menu.close')
                    : tAccessibility('menu.open')
                }
              >
                <Icon name={isMenuOpen ? 'X' : 'Menu'} className="size-4" />
              </Button>
            </div>
          </div>
        </div>

        <div className="w-full h-(--header-height)" />
      </header>

      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{
              duration: ANIMATION.DURATION_FLOAT,
              ease: 'easeInOut',
            }}
            className="fixed inset-0 z-40 glass-background-overlay mt-[calc(4rem+1px)] sm:mt-[calc(5rem+1px)] sm:p-4 flex flex-col"
          >
            <div className="flex flex-col gap-2 py-2">
              {menu
                // .sort((a, b) => a.label.length - b.label.length)
                .map((item) => (
                  <Button
                    asChild
                    variant="ghost"
                    key={item.label}
                    onClick={() => handleToggleMenu(false)}
                    className="text-lg xs:text-xl sm:text-2xl text-left text-muted-foreground hover:text-foreground transition-colors active:scale-[99.35%] rounded-2xl px-4 py-3! h-fit items-start justify-start hover:bg-transparent! font-normal"
                  >
                    <Link href={item.href} prefetch={item.prefetch}>
                      {item.label}
                    </Link>
                  </Button>
                ))}
            </div>

            <div className="w-full p-4 mt-auto flex flex-col gap-4">
              <LanguageSwitch
                type="default"
                align="start"
                className="w-full"
                classNames={{
                  trigger:
                    'w-full justify-between rounded-2xl px-4 h-12 text-lg',
                }}
              />

              <HeaderActions bottom={true} className="w-full" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
