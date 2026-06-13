export const COOKIES_KEYS = {
  WORKSPACE_SLUG: 'workspace-slug',
  LOCALE: 'locale',
  SIDEBAR_WIDTH: 'sidebar-width',
  SIDEBAR_STATE: 'sidebar-state',
} as const

export const COOKIES_TTL = {
  SIDEBAR_WIDTH: 365,
} as const

export const STORAGE_KEYS = {
  PWA_INSTALL_DISMISSED: 'pwa-install-dismissed',
} as const

export const defaultTTL = 365
