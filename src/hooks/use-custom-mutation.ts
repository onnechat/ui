export function useCustomMutation<TData = unknown>({
  mutationFn: _mutationFn,
  onSuccess: _onSuccess,
}: {
  mutationFn: () => Promise<TData>
  onSuccess?: (data: TData) => void
}) {
  return {
    isPending: false,
    mutate: () => {},
  }
}
