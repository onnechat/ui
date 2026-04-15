'use client'

import React, { useState } from 'react'

import {
  getSocialProfileHref,
  SOCIAL_PROFILES,
  type SocialPlatformId,
} from '@/config/social'

import { cn } from '@/lib/cn'
import { env } from '@/lib/env'

import { useCustomQuery } from '@/hooks/use-custom-query'

import { Card } from '@/components/card'
import { Icon } from '@/components/icon'
import { LanguageSwitch } from '@/components/language-switch'
import { Logo } from '@/components/logo'
import { ThemeSwitch } from '@/components/theme-switch'

import { SocialIcon } from './icon/social'

const SOCIAL_ICONS: Record<
  SocialPlatformId,
  (props: { className?: string }) => React.ReactNode
> = {
  instagram: SocialIcon.Instagram,
  facebook: SocialIcon.Facebook,
  youtube: SocialIcon.YouTube,
  x: SocialIcon.X,
  linkedin: SocialIcon.LinkedIn,
}

import { LeadForm } from '@/app/(website)/(www)/_components/lead-capture/form'

const STALE_AND_GC_TIME = 604800 * 1000 // 7 days (ms)

/**
 * Cloudflare "Email Address Obfuscation" rewrites `mailto:` to
 * `/cdn-cgi/l/email-protection`, which SEO crawlers report as broken (often 404).
 *
 * These markers tell Cloudflare to leave the following link unchanged.
 *
 * @see https://developers.cloudflare.com/waf/tools/scrape-shield/email-address-obfuscation/#disable-obfuscation-for-specific-content
 */
function CloudflareEmailOffStart() {
  return (
    <span
      aria-hidden
      className="hidden"
      dangerouslySetInnerHTML={{ __html: '<!--email_off-->' }}
    />
  )
}

function CloudflareEmailOffEnd() {
  return (
    <span
      aria-hidden
      className="hidden"
      dangerouslySetInnerHTML={{ __html: '<!--/email_off-->' }}
    />
  )
}

export const Footer = () => {

  const [ctaSubmitted, setCtaSubmitted] = useState(false)

  const {
    data: uptime = { status: 'UP' as const },
    isLoading: isLoadingUptime,
  } = useCustomQuery({
    queryKey: ['uptime'],
    queryFn: () => fetch('/api/uptime').then((res) => res.json()),
    options: {
      staleTime: STALE_AND_GC_TIME,
      gcTime: STALE_AND_GC_TIME,
    },
  })

  const links: {
    title: string
    basePath?: string
    links: {
      label: string
      href: string
      external?: boolean
      /**
       * Avoid CF rewriting mailto → /cdn-cgi/l/email-protection (SEO 404 noise).
       *
       * @see https://developers.cloudflare.com/waf/tools/scrape-shield/email-address-obfuscation/#disable-obfuscation-for-specific-content
       */
      cloudflareEmailOff?: boolean
    }[]
  }[] = [
    {
      title: 'sections.brand.title',
      links: [
        {
          label: 'sections.brand.links.holding', {
            holding: env.holding.name,
          },
          href: env.holding.domain.url,
        },
        {
          label: 'sections.brand.links.we', {
            brand: env.brand.name,
          },
          href: env.domain.url,
        },
      ],
    },
    {
      title: 'sections.support.title',
      links: [
        {
          label: 'sections.support.links.whatsapp',
          href: `https://wa.me/${env.phone.whatsapp}`,
          external: true,
        },
        {
          label: 'sections.support.links.email',
          href: `mailto:${env.email.internal}`,
          external: true,
          cloudflareEmailOff: true,
        },
      ],
    },
    {
      title: 'sections.product.title',
      links: [
        ...(env.node.development ? [{ label: 'SEO', href: '/dev/seo' }] : []),
        { label: 'sections.product.links.find', href: '/find' },
        { label: 'sections.product.links.features', href: '/#features' },
        { label: 'sections.product.links.pricing', href: '/#pricing' },
        { label: 'sections.product.links.status', href: '/status' },
        { label: 'sections.product.links.blog', href: '/blog' },
        { label: 'sections.product.links.faq', href: '/#faq' },
        {
          label: 'sections.product.links.changelog',
          href: '/changelog',
        },
      ],
    },
    {
      title: 'sections.useCases.title',
      links: [
        {
          label: 'sections.useCases.links.barbershops',
          href: '/find?type=BARBERSHOP',
        },
        {
          label: 'sections.useCases.links.beautySalons',
          href: '/find?type=BEAUTY_SALON',
        },
        {
          label: 'sections.useCases.links.clinics',
          href: '/find?type=DENTAL_CLINIC',
        },
        {
          label: 'sections.useCases.links.petShops',
          href: '/find?type=PET_SHOP',
        },
        {
          label: 'sections.useCases.links.freelancers',
          href: '/find?type=FREELANCER',
        },
      ],
    },
    {
      title: 'sections.legal.title',
      basePath: '/legal',
      links: [
        { label: 'sections.legal.links.terms', href: '/terms' },
        { label: 'sections.legal.links.privacy', href: '/privacy' },
        { label: 'sections.legal.links.cookies', href: '/cookies' },
      ],
    },
  ]

  const social = SOCIAL_PROFILES.map((profile) => ({
    label: profile.label,
    href: getSocialProfileHref(profile),
    Icon: SOCIAL_ICONS[profile.id],
  }))

  return (
    <footer className="relative w-full bg-background border-t border-foreground/5">
      <div className="max-w-container mx-auto p-4 sm:p-8 pt-8 sm:pt-12 lg:border-x border-dashed border-foreground/5">
        <Card>
          <Card.Content className="relative grid md:grid-cols-2 gap-0 p-0 overflow-hidden min-h-96">
            <div className="absolute inset-0 pointer-events-none z-0 bg-[linear-gradient(to_bottom_right,color-mix(in_srgb,var(--primary)_15%,transparent)_0%,transparent_35%)]" />

            <div className="flex flex-col justify-center gap-6 md:gap-8 p-4 sm:p-8 lg:p-12 xl:p-16 z-1">
              <Logo
                variant="icon"
                classNames={{ icon: { container: 'size-8' } }}
              />

              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-title tracking-tighter leading-tight chroma-title text-balance">
                {'title'}
              </h2>

              <p className="text-muted-foreground text-balance">
                {'description'}
              </p>

              <div className="flex flex-col items-start gap-4 animate-fade-in">
                {[
                  {
                    icon: 'CheckCheck' as const,
                    label: 'noCreditCard',
                  },
                  {
                    icon: 'CheckCheck' as const,
                    label: 'noCommitment',
                  },
                ].map((item) => (
                  <div
                    key={`${item.icon}-${item.label}`}
                    className="flex items-center gap-3"
                  >
                    <Icon name={item.icon} className="size-4 text-success" />

                    <p className="text-foreground text-sm">{item.label}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex items-center md:justify-center p-4 sm:p-8 lg:p-12 xl:p-16 border-foreground/10 z-1">
              {ctaSubmitted ? (
                <div className="flex items-center gap-3 text-success text-sm font-medium max-md:w-full">
                  <Icon name="CheckCircle" className="size-5 shrink-0" />
                  <span>{'formSuccess'}</span>
                </div>
              ) : (
                <div className="flex flex-col gap-6 md:gap-8 max-md:w-full">
                  <p className="text-base sm:text-lg font-title tracking-tight leading-snug text-balance md:max-w-sm">
                    {'formTitle'}
                  </p>

                  <LeadForm
                    method="cta_section"
                    onSuccess={() => setCtaSubmitted(true)}
                  />

                  <a
                    href="/auth/register"
                    className="text-sm text-foreground hover:text-primary font-semibold w-fit hover:underline underline-offset-8 decoration-primary transition-colors"
                  >
                    {'button'} →
                  </a>
                </div>
              )}
            </div>
          </Card.Content>
        </Card>
      </div>

      <div className="grid gap-8 sm:gap-16 max-w-container mx-auto p-4 py-8 sm:p-8 sm:py-16 lg:border-x border-t border-dashed border-foreground/5">
        <div className="grid md:grid-cols-3 gap-8 sm:gap-16 md:mb-8">
          <div className="flex flex-col items-start gap-8">
            <a
              href="/"
              prefetch={false}
              className="w-fit outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] active:scale-[99.35%] active:grayscale transition-all rounded-md"
            >
              <Logo />
            </a>

            <p className="text-muted-foreground text-sm leading-relaxed text-balance">
              {'description'}
            </p>

            <div className="flex items-center gap-4 max-sm:mb-4">
              {social.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={item.label}
                  className="flex items-center gap-2 text-muted-foreground/75 hover:text-foreground hover:underline underline-offset-8 decoration-primary outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] rounded-sm"
                >
                  {item.Icon({ className: 'size-4 text-current' })}
                </a>
              ))}
            </div>
          </div>

          <nav
            className="columns-1 xs:columns-2 xl:columns-4 gap-x-4 gap-y-16 sm:gap-8 col-span-2 items-start space-y-8"
            aria-labelledby="footer-site-map-heading"
          >
            <h2 id="footer-site-map-heading" className="sr-only">
              {'navigationHeading'}
            </h2>

            {links.map(({ title, links, basePath }) => (
              <div key={title} className="break-inside-avoid space-y-4">
                <h3 className="text-foreground text-sm uppercase font-normal">
                  {title}
                </h3>

                <ul className="space-y-2">
                  {links
                    .sort((a, b) => {
                      if (a.label.length < b.label.length) return -1
                      if (a.label.length > b.label.length) return 1
                      return 0
                    })
                    .map((link) => {
                      const href = `${basePath || ''}${link.href}` as string
                      const isExternal =
                        link.external || href.startsWith('http')

                      return (
                        <li key={link.label} className="group/footer-link">
                          {link.cloudflareEmailOff && (
                            <CloudflareEmailOffStart />
                          )}

                          <a
                            href={href}
                            prefetch={false}
                            target={isExternal ? '_blank' : undefined}
                            rel={isExternal ? 'noopener noreferrer' : undefined}
                            className="text-sm text-muted-foreground hover:text-foreground hover:underline underline-offset-8 decoration-primary outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] rounded-sm flex items-center gap-2"
                          >
                            {link.label}

                            {isExternal && (
                              <Icon
                                name="ExternalLink"
                                className="size-3 shrink-0 opacity-50 group-hover/footer-link:chroma-title group-hover/footer-link:translate-x-1 transition-all"
                              />
                            )}
                          </a>

                          {link.cloudflareEmailOff && <CloudflareEmailOffEnd />}
                        </li>
                      )
                    })}
                </ul>
              </div>
            ))}
          </nav>
        </div>

        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-8 md:gap-4">
          <div className="flex flex-col-reverse gap-4">
            <span className="text-sm text-muted-foreground">
              {'copyright', {
                year: new Date(.getFullYear(),
                brand: env.brand.name,
              })}
            </span>

            <a
              href="/status"
              prefetch={false}
              className="flex items-center gap-2"
              style={
                {
                  '--color': isLoadingUptime
                    ? 'var(--color-muted-foreground)'
                    : uptime.status === 'DOWN'
                      ? 'var(--color-destructive)'
                      : uptime.status === 'ERROR'
                        ? 'var(--color-warning)'
                        : uptime.status === 'UP' && 'var(--color-success)',
                } as React.CSSProperties
              }
            >
              <div
                className={cn(
                  'group/status relative size-2 rounded-full bg-(--color) text-(--color)',
                  isLoadingUptime && 'animate-pulse',
                )}
              >
                <div className="absolute inset-0 rounded-full animate-ping duration-500 ease-in-out bg-(--color) text-(--color)" />
              </div>

              <span
                className={cn(
                  'text-sm text-(--color)',
                  isLoadingUptime && 'animate-pulse',
                )}
              >
                {isLoadingUptime
                  ? 'checking'
                  : `statuses.${uptime.status}`}
                .
              </span>
            </a>
          </div>

          <div className="flex items-center gap-2">
            <ThemeSwitch
              align="end"
              type="icon"
              classNames={{
                trigger: 'bg-input',
                content: 'bg-input p-0',
              }}
            />

            <LanguageSwitch
              align="end"
              type="flag"
              classNames={{
                trigger: 'bg-input',
                content: 'bg-input p-0',
              }}
            />
          </div>
        </div>
      </div>
    </footer>
  )
}
