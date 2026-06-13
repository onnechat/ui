import Cookies from 'js-cookie'

import { COOKIES_KEYS } from '@/constants/keys'

import { IconType } from '@/components/icon'

type MenuItem = {
  title: string
  icon: IconType
  url?: string
  disabled?: boolean
  loading?: boolean
  soon?: boolean
  onClick?: () => void
  external?: boolean
  items?: MenuItem[]
}

type Menu = {
  id?: string
  title?: string
  paths?: string[]
  basePath?: string
  url?: string
  items?: MenuItem[]
}

function getSidebarMenu(t: (key: string) => string): Menu[] {
  return [
    {
      id: 'general',
      title: t('sections.general'),
      items: [
        {
          title: t('items.overview'),
          icon: 'House',
          url: '/',
        },
        {
          title: t('items.calendar'),
          icon: 'Calendar',
          url: '/calendar',
        },
      ],
    },
    {
      id: 'workspace',
      title: t('sections.workspace'),
      items: [
        {
          title: t('items.contacts'),
          icon: 'AddressBook',
          url: '/contacts',
        },
        {
          title: t('items.services'),
          icon: 'Box',
          url: '/services',
        },
        {
          title: t('items.professionals'),
          icon: 'IdBadge',
          url: '/professionals',
        },
        // {
        //   title: 'Usuários',
        //   icon: 'Users',
        //   url: '/users',
        //   soon: true,
        // },
        // {
        //   title: t('items.channels'),
        //   icon: 'MessageCircle',
        //   url: '/channels',
        // },
      ],
    },
    // {
    //   title: 'Detalhamentos',
    //   items: [
    //     {
    //       title: 'Relatórios',
    //       icon: 'ChartBar',
    //       url: '/reports',
    //       soon: true,
    //       items: [
    //         {
    //           title: 'Faturamento',
    //           icon: 'DollarSign',
    //           url: '/reports/billing',
    //         },
    //         {
    //           title: 'Agendamentos',
    //           icon: 'CalendarDays',
    //           url: '/reports/bookings',
    //         },
    //         {
    //           title: 'Serviços',
    //           icon: 'Box',
    //           url: '/reports/services',
    //         },
    //       ],
    //     },
    //   ],
    // },
  ]
}

function getInternalMenus(slug?: string): Menu[] {
  const workspaceSlug = slug ?? Cookies.get(COOKIES_KEYS.WORKSPACE_SLUG)

  return [
    {
      title: 'General',
      items: [
        {
          title: 'Home',
          icon: 'House',
          url: '/admin',
        },
      ],
    },
    {
      title: 'User',
      items: [
        {
          title: 'Workspace',
          icon: 'ApartmentBuilding',
          url: workspaceSlug
            ? `/workspace/${workspaceSlug}`
            : '/workspace?select=1',
        },
        {
          title: 'Onboarding',
          icon: 'StepsIndicator',
          url: '/onboarding/welcome',
        },
      ],
    },
  ]
}

/**
 * Resolves sidebar / command-palette hrefs for workspace-scoped menus.
 * When there is no workspace slug (e.g. user is on /user/* without a cookie),
 * workspace routes cannot be built — send the user to workspace selection.
 */
export function resolveWorkspaceMenuHref(
  itemUrl: string,
  basePath: string | undefined,
  showWorkspace: boolean,
  slug: string,
): string {
  let computedUrl = basePath ? `${basePath}${itemUrl}` : itemUrl

  if (computedUrl !== '/' && computedUrl.endsWith('/')) {
    computedUrl = computedUrl.slice(0, -1)
  }

  if (!computedUrl.startsWith('/')) {
    return computedUrl
  }

  if (showWorkspace && slug) {
    return `/workspace/${slug}${computedUrl}`
  }

  if (showWorkspace && !slug) {
    return '/workspace?select=1'
  }

  return computedUrl
}

export { getInternalMenus, getSidebarMenu }
export type { Menu, MenuItem }
