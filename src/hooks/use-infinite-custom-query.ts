import { useInfiniteQuery } from '@tanstack/react-query'
import { useMemo } from 'react'

export function useInfiniteCustomQuery<TData = unknown>({
  queryKey,
  queryFn,
  enabled = true,
  options,
}: {
  queryKey: unknown[]
  queryFn: (params: { pageParam: unknown }) => Promise<TData[]>
  enabled?: boolean
  options?: Record<string, unknown>
}) {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isFetching,
  } = useInfiniteQuery<TData[]>({
    queryKey,
    queryFn: ({ pageParam }) => queryFn({ pageParam }),
    initialPageParam: undefined,
    getNextPageParam: (lastPage) =>
      lastPage.length > 0 ? lastPage.length : undefined,
    enabled,
    ...options,
  })

  const flatData = useMemo(
    () => data?.pages.flat() ?? [],
    [data?.pages],
  )

  return {
    data: flatData,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isFetching,
  }
}
