import * as NucleoFill from 'nucleo-ui-fill-18'
import * as NucleoDuo from 'nucleo-ui-fill-duo-18'

import { BrandIcon } from './brand'
import customIcons from './custom-icons'
import { buildNucleoRegistry, type NucleoExportToName } from './nucleo-registry'
import { SocialIcon } from './social'

export const fillIcons = buildNucleoRegistry(NucleoFill, 'Fill18')
export const duoIcons = buildNucleoRegistry(NucleoDuo, 'FillDuo18')

export const iconVariants = {
  fill: fillIcons,
  duo: duoIcons,
  brand: BrandIcon,
  social: SocialIcon,
  custom: customIcons,
} as const

export type IconVariant = keyof typeof iconVariants

type NucleoFillExports = keyof typeof NucleoFill
type NucleoDuoExports = keyof typeof NucleoDuo

export type FillIconName = NucleoExportToName<
  Extract<NucleoFillExports, `Icon${string}Fill18`>,
  'Fill18'
>

export type DuoIconName = NucleoExportToName<
  Extract<NucleoDuoExports, `Icon${string}FillDuo18`>,
  'FillDuo18'
>

export type BrandIconName = keyof typeof BrandIcon
export type SocialIconName = keyof typeof SocialIcon
export type CustomIconName = keyof typeof customIcons
