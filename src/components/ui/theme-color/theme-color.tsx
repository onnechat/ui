'use client'

import { useEffect } from 'react'

import { useTheme } from 'next-themes'

function getIsSidebarRoute(pathname: string) {
  if (pathname.startsWith('/user/')) return true

  const segments = pathname.split('/').filter(Boolean)

  return (
    segments[0] === 'workspace' &&
    segments.length >= 2 &&
    segments[1] !== 'invites'
  )
}

function getResolvedColor(cssVar: string) {
  if (typeof window === 'undefined') return '#000000'

  const el = document.createElement('div')

  el.style.display = 'none'
  el.style.color = `var(${cssVar}, #000000)`

  document.body.appendChild(el)
  const color = getComputedStyle(el).color
  document.body.removeChild(el)

  return color || '#000000'
}

function applyAlpha(rgb: string, alpha: number) {
  if (!rgb) return `rgba(0, 0, 0, ${alpha})`
  const match = rgb.match(/rgb\((\d+),?\s*(\d+),?\s*(\d+)\)/)

  if (match) {
    return `rgba(${match[1]}, ${match[2]}, ${match[3]}, ${alpha})`
  }

  // Handle oklch or other formats if necessary, but for theme-color fallback to rgba
  return rgb
}

export function ThemeColor() {
  const { resolvedTheme } = useTheme()
  const pathname = "/";

  const isSidebarRoute = getIsSidebarRoute(pathname)

  useEffect(() => {
    if (!resolvedTheme) return

    let raf2: number
    const raf1 = requestAnimationFrame(() => {
      raf2 = requestAnimationFrame(() => {
        const cssVar = isSidebarRoute ? '--color-sidebar' : '--color-background'
        const resolvedColor = getResolvedColor(cssVar)

        const themeColor = isSidebarRoute
          ? applyAlpha(resolvedColor, 0.65)
          : resolvedColor

        let meta = document.querySelector(
          'meta[name="theme-color"]:not([media])',
        ) as HTMLMetaElement | null

        if (!meta) {
          meta = document.createElement('meta')
          meta.name = 'theme-color'
          document.head.appendChild(meta)
        }

        meta.content = themeColor

        document
          .querySelectorAll('meta[name="theme-color"][media]')
          .forEach((el) => el.remove())
      })
    })

    return () => {
      cancelAnimationFrame(raf1)
      cancelAnimationFrame(raf2)
    }
  }, [resolvedTheme, isSidebarRoute])

  return null
}
