'use client'

import { createPortal } from 'react-dom'

import { useIsClient } from '@/hooks/use-is-client'

import { Skeleton } from '@/components/ui/skeleton'

import { SectionTitle } from './section-title'

function hasRenderableTitle(
  title?: string | string[],
): title is string | string[] {
  if (title == null) return false

  if (Array.isArray(title)) {
    return title.some((p) => String(p ?? '').trim() !== '')
  }

  return String(title).trim() !== ''
}

const titlePlaceholder = (
  <Skeleton
    className="h-7 w-36 max-w-[min(100%,12rem)] shrink-0 rounded-md"
    aria-hidden
  />
)

/** Separate component so each portal gets its own fiber tree (never reuse one element in two portals). */
function HeaderTitleBody({
  title,
  children,
}: {
  title?: string | string[]
  children?: React.ReactNode
}) {
  if (hasRenderableTitle(title)) {
    return <SectionTitle title={title} />
  }
  if (children != null) {
    return <>{children}</>
  }
  return titlePlaceholder
}

export const HeaderTitle = ({
  title,
  children,
}: {
  title?: string | string[]
  children?: React.ReactNode
}) => {
  const mounted = useIsClient()

  if (!mounted) {
    return <span aria-hidden suppressHydrationWarning />
  }

  const mobileTarget = document.getElementById('header-title-portal-mobile')
  const desktopTarget = document.getElementById('header-title-portal-desktop')

  return (
    <>
      {mobileTarget &&
        createPortal(
          <HeaderTitleBody title={title}>{children}</HeaderTitleBody>,
          mobileTarget,
        )}
      {desktopTarget &&
        createPortal(
          <HeaderTitleBody title={title}>{children}</HeaderTitleBody>,
          desktopTarget,
        )}
    </>
  )
}
