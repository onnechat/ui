import type * as React from 'react'

import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect } from 'storybook/test'

import { Icon } from '@/components/icon'

import { Avatar } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { OnnebookLogo } from '@/components/ui/logo'
import { Sidebar } from '@/components/ui/sidebar'

import { AnnouncementBanner } from './announcement-banner'
import { AppShell } from './app-shell'

const meta: Meta<typeof AppShell> = {
  title: 'Layouts/AppShell',
  component: AppShell,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
}

export default meta

function DemoWorkspaceSwitcher() {
  return (
    <Sidebar.Menu>
      <Sidebar.MenuButton
        size="lg"
        className="[&>svg]:size-5 cursor-pointer h-12"
      >
        <Avatar className="relative flex shrink-0 overflow-hidden size-8 rounded-lg border">
          <Avatar.Fallback name="Acme Barbearia" />
        </Avatar>

        <div className="grid flex-1 min-w-0 text-left leading-tight">
          <span className="text-sm truncate font-medium">Acme Barbearia</span>

          <span className="truncate text-xs text-muted-foreground -mt-0.5">
            @acme-barbearia
          </span>
        </div>

        <Icon
          name="CaretExpandY"
          className="ml-auto shrink-0 size-5 text-muted-foreground"
        />
      </Sidebar.MenuButton>
    </Sidebar.Menu>
  )
}

function DemoUser() {
  return (
    <Sidebar.MenuButton size="lg" className="cursor-pointer h-12">
      <Avatar className="relative flex shrink-0 overflow-hidden lg:min-w-8 lg:min-h-8 aspect-square border">
        <Avatar.Fallback name="User Example" />
      </Avatar>

      <div className="hidden lg:grid flex-1 min-w-0 text-left leading-tight">
        <span className="text-sm truncate font-medium">User Example</span>

        <span className="truncate text-xs text-muted-foreground -mt-0.5">
          user@example.com
        </span>
      </div>
    </Sidebar.MenuButton>
  )
}

function DemoSidebar() {
  return (
    <AppShell.Sidebar>
      <AppShell.SidebarHeader>
        <a
          href="#"
          className="outline-none focus-visible:border-ring focus-visible:ring-ring focus-visible:ring-2 active:scale-[99.35%] active:grayscale transition-[scale,filter] rounded-md p-2"
        >
          <OnnebookLogo />
        </a>

        <Button size="icon-sm" variant="ghost" aria-label="Notificações">
          <Icon name="Bell" className="size-4 text-muted-foreground" />
        </Button>
      </AppShell.SidebarHeader>

      <div className="flex min-h-0 flex-1 flex-col">
        <AppShell.SidebarSection>
          <DemoWorkspaceSwitcher />
        </AppShell.SidebarSection>

        <AppShell.SidebarSection>
          <AppShell.CommandButton>Pesquisar…</AppShell.CommandButton>
        </AppShell.SidebarSection>

        <AppShell.SidebarContent>
          <AppShell.SidebarGroup title="Geral">
            <AppShell.SidebarItem
              icon="House6"
              title="Visão Geral"
              href="#"
              active
            />
            <AppShell.SidebarItem icon="Calendar" title="Calendário" href="#" />
            <AppShell.SidebarItem
              icon="ChartActivity2"
              title="Relatórios"
              href="#"
              items={[
                { icon: 'Tag2', title: 'Vendas', href: '#' },
                { icon: 'Users', title: 'Clientes', href: '#' },
              ]}
            />
          </AppShell.SidebarGroup>

          <AppShell.SidebarGroup title="Gestão">
            <AppShell.SidebarItem icon="Users" title="Equipe" href="#" />
            <AppShell.SidebarItem
              icon="BagShopping2"
              title="Produtos"
              href="#"
              soon
            />
            <AppShell.SidebarItem
              icon="ShareUpRight"
              title="Página pública"
              href="#"
              external
            />
          </AppShell.SidebarGroup>
        </AppShell.SidebarContent>

        <AppShell.SidebarSection>
          <AppShell.SidebarGroup title="Outros">
            <AppShell.SidebarItem
              icon="GridSparkle"
              title="Marketplace"
              href="#"
            />
          </AppShell.SidebarGroup>
        </AppShell.SidebarSection>

        <AppShell.SidebarFooter>
          <AppShell.Copyright>
            &copy; {new Date().getFullYear()} Onne — 1.0.0
          </AppShell.Copyright>

          <DemoUser />
        </AppShell.SidebarFooter>
      </div>
    </AppShell.Sidebar>
  )
}

function DemoHeader() {
  return (
    <AppShell.Header
      logo={<OnnebookLogo variant="icon" />}
      sidebarToggleLabel="Alternar sidebar"
      title={<span className="truncate font-medium">Visão Geral</span>}
      actions={
        <Button size="sm" variant="secondary">
          <Icon name="Plus" className="size-4" />
          Novo agendamento
        </Button>
      }
      user={
        <Avatar className="size-10 rounded-2xl border lg:hidden">
          <Avatar.Fallback name="User Example" />
        </Avatar>
      }
    />
  )
}

function DemoNavbar() {
  return (
    <AppShell.Navbar>
      <AppShell.NavbarItem icon="House6" href="#" active />
      <AppShell.NavbarItem icon="Calendar" href="#" />
      <AppShell.NavbarItem icon="Stack2" href="#" />
    </AppShell.Navbar>
  )
}

function DemoContent() {
  return (
    <main className="flex flex-1 flex-col gap-4 p-4">
      <div className="grid gap-4 md:grid-cols-3">
        <div className="h-32 rounded-2xl bg-card" />
        <div className="h-32 rounded-2xl bg-card" />
        <div className="h-32 rounded-2xl bg-card" />
      </div>
      <div className="min-h-64 flex-1 rounded-2xl bg-card" />
    </main>
  )
}

/**
 * The announcement banner sets the global `--announcement-height` variable.
 * Wrapping banner-less stories with a local `0px` override shields them from
 * the variable leaking across stories on the autodocs page (CSS variables
 * resolve from the nearest ancestor, so the local value wins).
 */
function withoutAnnouncement(Story: React.ComponentType) {
  return (
    <div className="contents [--announcement-height:0px]">
      <Story />
    </div>
  )
}

export const Default: StoryObj<typeof meta> = {
  decorators: [withoutAnnouncement],
  render: () => (
    <AppShell>
      <DemoSidebar />
      <DemoNavbar />

      <AppShell.Inset>
        <DemoHeader />
        <DemoContent />
      </AppShell.Inset>
    </AppShell>
  ),
  play: async ({ canvas }) => {
    await expect(canvas.getAllByText('Visão Geral').length).toBeGreaterThan(0)
    await expect(canvas.getByText('Pesquisar…')).toBeInTheDocument()
  },
}

export const WithAnnouncement: StoryObj<typeof meta> = {
  render: () => (
    <>
      <AnnouncementBanner
        type="NEW"
        typeLabel="Novidade"
        message="O novo painel de relatórios já está disponível para todos os estabelecimentos."
      />

      <AppShell>
        <DemoSidebar />
        <DemoNavbar />

        <AppShell.Inset>
          <DemoHeader />
          <DemoContent />
        </AppShell.Inset>
      </AppShell>
    </>
  ),
}

export const Loading: StoryObj<typeof meta> = {
  decorators: [withoutAnnouncement],
  render: () => (
    <AppShell>
      <DemoSidebar />

      <AppShell.Inset loading>
        <DemoHeader />
        <DemoContent />
      </AppShell.Inset>
    </AppShell>
  ),
}

export const WithRightSidebar: StoryObj<typeof meta> = {
  decorators: [withoutAnnouncement],
  render: () => (
    <AppShell.RightSidebarProvider>
      <AppShell>
        <DemoSidebar />

        <AppShell.Inset>
          <AppShell.Header
            logo={<OnnebookLogo variant="icon" />}
            sidebarToggleLabel="Alternar sidebar"
            title={<span className="truncate font-medium">Calendário</span>}
            actions={
              <AppShell.RightSidebarTrigger label="Alternar painel de contexto" />
            }
          />
          <DemoContent />
        </AppShell.Inset>

        <AppShell.RightSidebar>
          <div className="shrink-0 w-full h-12 rounded-xl bg-sidebar-accent" />

          <div className="flex min-w-0 flex-col gap-3">
            <div className="flex items-center justify-between gap-2">
              <span className="text-sm font-medium">Filtros</span>

              <Button size="icon" variant="ghost" className="size-8 shrink-0">
                <Icon name="ChevronDown" className="size-4 rotate-180" />
              </Button>
            </div>

            <div className="h-24 rounded-xl bg-sidebar-accent" />
            <div className="h-24 rounded-xl bg-sidebar-accent" />
          </div>
        </AppShell.RightSidebar>
      </AppShell>
    </AppShell.RightSidebarProvider>
  ),
}
