'use client'

import * as React from 'react'

import { cn } from '@/lib/cn'

const MAX_IMAGE_CACHE = 500
const imageCache = new Set<string>()

function cacheImage(src: string) {
  if (imageCache.size >= MAX_IMAGE_CACHE) {
    const first = imageCache.values().next().value
    if (first) imageCache.delete(first)
  }

  imageCache.add(src)
}

type Status = 'loading' | 'loaded' | 'error'

interface AvatarCtx {
  status: Status
  onStatus: React.Dispatch<React.SetStateAction<Status>>
}

const AvatarCtx = React.createContext<AvatarCtx>({
  status: 'loading',
  onStatus: () => {},
})

function AvatarRoot({ className, ...props }: React.ComponentProps<'span'>) {
  const [status, onStatus] = React.useState<Status>('loading')
  const ctx = React.useMemo(() => ({ status, onStatus }), [status])

  return (
    <AvatarCtx.Provider value={ctx}>
      <span
        data-slot="avatar"
        className={cn(
          'relative flex size-8 shrink-0 overflow-hidden rounded-lg',
          className,
        )}
        {...props}
      />
    </AvatarCtx.Provider>
  )
}

function AvatarImage({
  src,
  className,
  ...props
}: React.ComponentProps<'img'>) {
  const { onStatus } = React.useContext(AvatarCtx)
  const srcStr = typeof src === 'string' && src.length > 0 ? src : undefined

  // Runs synchronously before the browser paints — if the src is already
  // cached, we set status to 'loaded' immediately so AvatarFallback never
  // renders on screen, eliminating all flicker on path changes.
  React.useLayoutEffect(() => {
    onStatus(!srcStr ? 'error' : imageCache.has(srcStr) ? 'loaded' : 'loading')
  }, [srcStr, onStatus])

  if (!srcStr) return null

  return (
    <img
      data-slot="avatar-image"
      src={srcStr}
      alt=""
      className={cn(
        'absolute inset-0 size-full object-cover pointer-events-none select-none',
        className,
      )}
      onLoad={() => {
        cacheImage(srcStr)
        onStatus('loaded')
      }}
      onError={() => onStatus('error')}
      {...props}
    />
  )
}

function AvatarFallback({
  name,
  children,
  className,
  ...props
}: React.ComponentProps<'span'> & { name?: string }) {
  const { status } = React.useContext(AvatarCtx)
  if (status === 'loaded') return null

  const initials =
    name && name.length > 0
      ? name
          .split(' ')
          .map((n) => n.charAt(0))
          .slice(0, 2)
          .join('')
          .toUpperCase()
      : '?'

  return (
    <span
      data-slot="avatar-fallback"
      className={cn(
        'absolute inset-0 flex size-full items-center justify-center bg-primary text-primary-foreground rounded-none select-none pointer-events-none',
        className,
      )}
      {...props}
    >
      {children ?? initials}
    </span>
  )
}

const Avatar = Object.assign(AvatarRoot, { Image: AvatarImage, Fallback: AvatarFallback })
export { Avatar }
