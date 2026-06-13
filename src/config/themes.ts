export const THEMES = [
  { id: 'light' },
  { id: 'dark' },
  { id: 'system' },
] as const

export const TOGGLEABLE_THEMES = [
  { id: 'light' },
  { id: 'dark' },
] as const

export const LISTABLE_THEMES = [
  { id: 'light', icon: 'Sun', labelKey: 'theme.light' },
  { id: 'dark', icon: 'Moon', labelKey: 'theme.dark' },
  { id: 'system', icon: 'Monitor', labelKey: 'theme.system' },
] as const

export function themeIdToSonnerTheme(themeId: string): 'light' | 'dark' | 'system' {
  return themeId as 'light' | 'dark' | 'system'
}
