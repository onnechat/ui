import type { SVGProps } from 'react'

import { Apple } from './apple'
import { Discord } from './discord'
import { Facebook } from './facebook'
import { Google } from './google'
import { Instagram } from './instagram'
import { LinkedIn } from './linkedin'
import { Messenger } from './messenger'
import { WhatsApp } from './whatsapp'
import { XformerlyTwitter } from './x'
import { YouTube } from './youtube'

export const SocialIcon = {
  Apple,
  Google,
  WhatsApp,
  Facebook,
  Instagram,
  Messenger,
  LinkedIn,
  X: XformerlyTwitter,
  YouTube,
  Discord,
}

export type SocialIconProps = {
  original?: boolean
} & SVGProps<SVGSVGElement>
