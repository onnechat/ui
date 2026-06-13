export function useInfiniteCustomQuery<TData = unknown>({
  queryKey: _queryKey,
  queryFn: _queryFn,
  enabled: _enabled = true,
  options: _options,
}: {
  queryKey: unknown[]
  queryFn: (params: { pageParam: number }) => Promise<TData[]>
  enabled?: boolean
  options?: Record<string, unknown>
}) {
  return {
    data: [] as TData[],
    fetchNextPage: () => {},
    hasNextPage: false,
    isFetchingNextPage: false,
    isLoading: false,
    isFetching: false,
  }
}
