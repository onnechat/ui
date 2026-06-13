export function useRoles() {
  return {
    has: (_role: string) => false,
    isLoading: false,
    isAdmin: false,
  }
}
