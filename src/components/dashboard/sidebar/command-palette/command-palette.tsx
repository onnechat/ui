'use client'

import { useCallback } from 'react'

import { useCalendarNavigation } from '@/hooks/use-calendar-navigation'

import type { SubNavigationTabItem } from '@/components/dashboard/sub-navigation-tabs'
import { Icon } from '@/components/icon'
import { Kbd } from '@/components/kbd'

import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'

import { type Menu, type MenuItem, resolveWorkspaceMenuHref } from '../data'

import { useSidebarCommandPalette } from './command-palette-context'

export type CommandPaletteEntry = {
  id: string
  group: string
  title: string
  icon: MenuItem['icon']
  href?: string
  external?: boolean
  onClick?: () => void
}

export function collectCommandEntries(
  menus: Menu[],
  slug: string,
  showWorkspace: boolean,
  groupFallback: string,
  settingsGroupLabel: string,
  settingsItems?: SubNavigationTabItem[],
): CommandPaletteEntry[] {
  const entries: CommandPaletteEntry[] = []

  for (const menu of menus) {
    const groupTitle = menu.title ?? ''

    const walk = (
      items: MenuItem[] | undefined,
      basePath: string | undefined,
    ) => {
      if (!items) return

      for (const item of items) {
        if (item.items && item.items.length > 0) {
          walk(item.items, basePath)
          continue
        }

        if (item.soon || item.disabled || item.loading) continue

        const group = groupTitle.trim() || groupFallback

        if (item.onClick) {
          entries.push({
            id: `${group}-${item.title}-action`,
            group,
            title: item.title,
            icon: item.icon,
            onClick: item.onClick,
          })
          continue
        }

        if (!item.url) continue

        const computedUrl = resolveWorkspaceMenuHref(
          item.url,
          basePath,
          showWorkspace,
          slug,
        )

        entries.push({
          id: `${group}-${item.title}`,
          group,
          title: item.title,
          icon: item.icon,
          href: computedUrl,
          external: item.external,
        })
      }
    }

    walk(menu.items, menu.basePath)
  }

  if (settingsItems && settingsItems.length > 0) {
    for (const item of settingsItems) {
      entries.push({
        id: `settings-${item.label}`,
        group: settingsGroupLabel,
        title: item.label,
        icon: item.icon,
        href: item.href,
      })
    }
  }

  return entries
}

type SidebarCommandPaletteProps = {
  menus: Menu[]
  bottomMenus: Menu[]
  slug: string
  showWorkspace: boolean
  settingsItems?: SubNavigationTabItem[]
}

export function SidebarCommandPalette({
  menus,
  bottomMenus,
  slug,
  showWorkspace,
  settingsItems,
}: SidebarCommandPaletteProps) {
  const router = { push: () => {}, replace: () => {}, back: () => {}, forward: () => {}, refresh: () => {}, prefetch: () => {} } as any;

  const { isOpen, setOpen } = useSidebarCommandPalette()
  const { isCalendarRoute, navigateToCalendar } = useCalendarNavigation()

  const mainEntries = collectCommandEntries(
    menus,
    slug,
    showWorkspace,
    'commandPalette.groupFallback',
    'commandPalette.settingsGroup',
    settingsItems,
  )

  const bottomEntries = collectCommandEntries(
    bottomMenus,
    slug,
    showWorkspace,
    'commandPalette.groupFallback',
    'commandPalette.settingsGroup',
  )

  const commandEntries = [...mainEntries, ...bottomEntries]

  const commandGroupsMap = new Map<string, CommandPaletteEntry[]>()

  for (const entry of commandEntries) {
    const list = commandGroupsMap.get(entry.group) ?? []
    list.push(entry)
    commandGroupsMap.set(entry.group, list)
  }

  const commandGroups = Array.from(commandGroupsMap.entries())

  const handleCommandSelect = useCallback(
    (entry: CommandPaletteEntry) => {
      setOpen(false)

      if (entry.onClick) {
        entry.onClick()
        return
      }

      if (!entry.href) return

      if (entry.href.includes('/calendar') && isCalendarRoute) {
        navigateToCalendar(true)
        return
      }

      if (entry.external) {
        window.open(entry.href, '_blank', 'noopener,noreferrer')
        return
      }

      router.push(entry.href)
    },
    [router, isCalendarRoute, navigateToCalendar, setOpen],
  )

  return (
    <CommandDialog
      open={isOpen}
      onOpenChange={setOpen}
      title={'commandPalette.title'}
      description={'commandPalette.description'}
      closeButtonClassName="size-8 -mt-0.5 hover:bg-card rounded-lg cursor-pointer"
      className="max-w-xl! **:data-[slot=command-input-wrapper]:border-b-4 **:data-[slot=command-input-wrapper]:border-card"
    >
      <CommandInput
        className="pr-9 placeholder:text-muted-foreground/50"
        placeholder={'commandPalette.searchPlaceholder'}
      />

      <CommandList>
        <CommandEmpty>{'commandPalette.empty'}</CommandEmpty>

        {commandGroups.map(([group, items]) => (
          <CommandGroup key={group} heading={group} className="pb-4">
            {items.map((entry) => {
              return (
                <CommandItem
                  key={entry.id}
                  className="cursor-pointer"
                  value={`${entry.title} ${group}`}
                  onSelect={() => handleCommandSelect(entry)}
                >
                  {entry.icon ? (
                    <Icon
                      name={entry.icon}
                      className="size-4 text-foreground"
                    />
                  ) : null}

                  <span className="text-muted-foreground">{entry.title}</span>
                </CommandItem>
              )
            })}
          </CommandGroup>
        ))}
      </CommandList>

      <div className="hidden lg:flex items-center justify-between px-4 py-2 text-xs text-muted-foreground border-t-4 border-card h-14">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1.5">
            <Kbd
              keys={['ArrowUp', 'ArrowDown']}
              kbdClassName="inline-flex items-center justify-center h-5 min-w-5 px-1.5 text-xxs font-mono rounded-md bg-card border"
            />

            <span>{'commandPalette.footerNavigate'}</span>
          </span>

          <span className="flex items-center gap-1.5">
            <Kbd
              keys={['Enter']}
              kbdClassName="inline-flex items-center justify-center h-5 min-w-5 px-1.5 text-xxs font-mono rounded-md bg-card border"
            />

            <span>{'commandPalette.footerSelect'}</span>
          </span>
        </div>

        <span className="flex items-center gap-1.5">
          <Kbd
            keys={['Escape']}
            kbdClassName="inline-flex items-center justify-center h-5 min-w-5 px-1.5 text-xxs font-mono rounded-md bg-card border"
          />

          <span>{'commandPalette.footerClose'}</span>
        </span>
      </div>
    </CommandDialog>
  )
}
