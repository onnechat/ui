import { useSyncExternalStore } from 'react'

/**
 * True after client hydration; false on the server. Prefer over useEffect(() => setMounted(true)).
 *
 * @see https://react.dev/reference/react/useSyncExternalStore
 */
const subscribe = () => () => {}

export function useIsClient() {
  return useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  )
}
