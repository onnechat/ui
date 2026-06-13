import React, { useEffect, useState } from 'react'

import { cn } from '@/lib/cn'

import { useIsMobile } from '@/hooks/use-mobile'

import { Input } from '../input'

export const BrandDomainInput = React.forwardRef<
  HTMLInputElement,
  React.ComponentProps<'input'>
>(function BrandDomainInput(props, ref) {
  const isMobile = useIsMobile()
  const [prefix, setPrefix] = useState('')

  useEffect(() => {
    setPrefix(isMobile ? '@' : `${'onne.chat'}/@`)
  }, [isMobile])

  return (
    <div className="flex w-full">
      <div
        className={cn(
          'flex items-center justify-center px-3 py-2 text-muted-foreground text-sm whitespace-nowrap select-none',
          'bg-accent h-12 w-fit rounded-xl rounded-r-none',
          isMobile && 'aspect-square size-12',
        )}
      >
        {prefix}
      </div>

      <Input
        type="text"
        ref={ref}
        {...props}
        className={cn('rounded-l-none!', props.className)}
        containerClassName="rounded-l-none!"
      />
    </div>
  )
})
