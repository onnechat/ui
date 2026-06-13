export function extractWorkspaceSlugFromPathname(pathname: string): string | null {
  const match = pathname.match(/^\/workspace\/([^/]+)/)
  return match ? match[1] : null
}
