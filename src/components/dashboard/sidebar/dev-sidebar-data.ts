import type { Menu } from './data'

/**
 * Dev-only navigation. Keep labels in plain English — do not add keys under messages/.
 */
export const DEV_SIDEBAR_MENUS: Menu[] = [
  {
    id: 'dev-tools',
    title: 'Tools',
    items: [
      { title: 'Overview', icon: 'HouseDashboard', url: '/dev' },
      { title: 'SEO tester', icon: 'Magnifier', url: '/dev/seo' },
      { title: 'Toast playground', icon: 'Bell', url: '/dev/toast' },
    ],
  },
]
