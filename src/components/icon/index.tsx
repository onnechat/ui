import * as LucideIcons from 'lucide-react'
import { LucideProps } from 'lucide-react'

import { cn } from '@/lib/cn'

import customIcons from './custom-icons'

type IconNames = keyof typeof LucideIcons
type WithoutIconSuffix = Exclude<IconNames, `${string}Icon`>

export type IconType = WithoutIconSuffix | keyof typeof customIcons

interface IconProps extends LucideProps {
  name: IconType
}

export const Icon = ({ name, className, ...props }: IconProps) => {
  if (!name) return null

  if (name in customIcons) {
    const CustomIconComponent = customIcons[name as keyof typeof customIcons]
    return (
      <CustomIconComponent suppressHydrationWarning className={className} />
    )
  }

  const IconComponent = LucideIcons[
    name as keyof typeof LucideIcons
  ] as React.ComponentType<LucideProps>

  if (IconComponent) {
    return (
      <IconComponent
        {...props}
        suppressHydrationWarning
        className={cn('fill-current/25', className)}
      />
    )
  }

  return null
}
