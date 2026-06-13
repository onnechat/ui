import { useEffect, useState } from 'react'

export function useCustomQuery<TData = unknown>({
  queryKey: _queryKey,
  queryFn: _queryFn,
  enabled = true,
}: {
  queryKey: unknown[]
  queryFn: () => Promise<TData>
  enabled?: boolean
}) {
  const [data, setData] = useState<TData>()
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (!enabled) {
      setIsLoading(false)
      return
    }
    setIsLoading(true)
    _queryFn()
      .then(setData)
      .finally(() => setIsLoading(false))
  }, [enabled, _queryFn])

  return { data, isLoading, isFetching: isLoading }
}
