import type { IconProps as NucleoIconProps } from 'nucleo-ui-fill-18'

import type { ComponentType } from 'react'

import type { BrandIconProps } from './brand'
import customIcons from './custom-icons'
import type { SocialIconProps } from './social'
import {
  type BrandIconName,
  type CustomIconName,
  type DuoIconName,
  type FillIconName,
  fillIcons,
  type IconVariant,
  iconVariants,
  type SocialIconName,
} from './variants'

export type {
  BrandIconName,
  CustomIconName,
  DuoIconName,
  FillIconName,
  IconVariant,
  SocialIconName,
} from './variants'

/** @deprecated Use `FillIconName` or variant-specific names */
export type IconType = FillIconName | CustomIconName

/** SVG props shared by all icon variants (excludes `name` and `variant`). */
export type IconSharedProps = Omit<NucleoIconProps, 'name' | 'variant'>

export type ThemeIcon =
  | FillIconName
  | CustomIconName
  | { variant: 'brand'; name: BrandIconName }

type FillVariantProps = {
  variant?: 'fill'
  name: FillIconName | CustomIconName
} & NucleoIconProps

type DuoVariantProps = {
  variant: 'duo'
  name: DuoIconName
} & NucleoIconProps

type BrandVariantProps = {
  variant: 'brand'
  name: BrandIconName
} & BrandIconProps

type SocialVariantProps = {
  variant: 'social'
  name: SocialIconName
} & SocialIconProps

type CustomVariantProps = {
  variant: 'custom'
  name: CustomIconName
} & NucleoIconProps

export type IconProps =
  | FillVariantProps
  | DuoVariantProps
  | BrandVariantProps
  | SocialVariantProps
  | CustomVariantProps

function resolveIconComponent(
  variant: IconVariant,
  name: string,
): ComponentType<NucleoIconProps> | null {
  if (variant === 'fill') {
    return (
      fillIcons[name as FillIconName] ??
      customIcons[name as CustomIconName] ??
      null
    )
  }

  const registry = iconVariants[variant]
  const component = registry[name as keyof typeof registry]

  return (component as ComponentType<NucleoIconProps>) ?? null
}

export function resolveThemeIcon(icon: ThemeIcon | IconType): IconProps {
  if (typeof icon === 'string') {
    return { name: icon }
  }

  return icon
}

export const Icon = (props: IconProps) => {
  const { name, variant, ...rest } = props

  if (!name) return null
  const resolvedVariant: IconVariant =
    variant ?? (name in customIcons ? 'custom' : 'fill')

  const IconComponent = resolveIconComponent(resolvedVariant, name)
  if (!IconComponent) return null

  return <IconComponent suppressHydrationWarning {...rest} />
}
