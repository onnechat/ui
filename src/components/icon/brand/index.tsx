import type { SVGProps } from 'react'

import { Stripe } from './stripe'

export const BrandIcon = {
  Stripe,
}

export type BrandIconProps = {
  original?: boolean
} & SVGProps<SVGSVGElement>
