export function useWorkspace(_slug: string) {
  return {
    workspace: null,
    isFetching: false,
    isLoading: false,
  }
}
