import React, { useEffect, useState } from 'react'

import { cn } from '@/lib/cn'

import { useIsMobile } from '@/hooks/use-mobile'

import { Input } from '@/components/ui/input'

type BrandDomainInputProps = Omit<React.ComponentProps<'input'>, 'size'> & {
  size?: 'sm' | 'default' | 'lg'
}

const brandDomainPrefixSizes = {
  sm: { box: 'h-8 px-3 text-sm', square: 'size-8' },
  default: { box: 'h-10 px-3 text-sm', square: 'size-10' },
  lg: { box: 'h-12 px-4 text-base', square: 'size-12' },
} as const

export const BrandDomainInput = React.forwardRef<
  HTMLInputElement,
  BrandDomainInputProps
>(function BrandDomainInput({ size, className, ...props }, ref) {
  const isMobile = useIsMobile()
  const [prefix, setPrefix] = useState('')
  const prefixSize = brandDomainPrefixSizes[size ?? 'default']

  useEffect(() => {
    setPrefix(isMobile ? '@' : `${'onne.chat'}/@`)
  }, [isMobile])

  return (
    <div className="flex w-full">
      <div
        className={cn(
          'flex items-center justify-center py-2 text-muted-foreground whitespace-nowrap select-none',
          'bg-accent w-fit rounded-xl rounded-r-none',
          prefixSize.box,
          isMobile && cn('aspect-square', prefixSize.square),
        )}
      >
        {prefix}
      </div>

      <Input
        type="text"
        ref={ref}
        size={size}
        {...props}
        className={cn('rounded-l-none!', className)}
      />
    </div>
  )
})
