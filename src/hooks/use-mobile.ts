import * as React from 'react'

function subscribeMatchMedia(query: string, onStoreChange: () => void) {
  const mql = window.matchMedia(query)
  mql.addEventListener('change', onStoreChange)
  return () => mql.removeEventListener('change', onStoreChange)
}

/**
 * Starts as `false` on server and first client paint so SSR + hydration match.
 * Subscribes to `matchMedia` via useSyncExternalStore (avoids Sidebar Sheet vs div mismatch).
 */
export function useIsMobile({ breakpoint = 1024 } = {}) {
  const query = `(max-width: ${breakpoint - 1}px)`

  return React.useSyncExternalStore(
    React.useCallback(
      (onStoreChange) => subscribeMatchMedia(query, onStoreChange),
      [query],
    ),
    () => window.matchMedia(query).matches,
    () => false,
  )
}
