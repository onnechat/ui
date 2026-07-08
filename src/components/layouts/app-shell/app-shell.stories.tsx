import type * as React from 'react'

import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect } from 'storybook/test'

import { Icon } from '@/components/icon'

import { Avatar } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { OnnebookLogo } from '@/components/ui/logo'
import { Sidebar } from '@/components/ui/sidebar'

import { AnnouncementBanner } from './announcement-banner'
import {
  AppShell,
  useLeftSidebarToggle,
  useRightSidebarToggle,
} from './app-shell'

const meta: Meta<typeof AppShell> = {
  title: 'Layouts/AppShell',
  component: AppShell,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: [
          'Esqueleto das dashboards: sidebars laterais redimensionáveis (inset), header sticky com efeito glass, navbar flutuante no mobile e área de conteúdo (`AppShell.Inset`) que reage às sidebars habilitadas.',
          '',
          '## Sidebars',
          '',
          'Nenhum lado é privilegiado — um produto pode não ter sidebar, ter só a esquerda, só a direita ou as duas. Cada lado é habilitado por uma prop no root (`leftSidebar` / `rightSidebar`, aceitam `boolean` ou `{ defaultOpen?: boolean }`) e renderizado pelo painel correspondente (`AppShell.LeftSidebar` / `AppShell.RightSidebar`). Os building blocks (`SidebarHeader`, `SidebarSection`, `SidebarContent`, `SidebarGroup`, `SidebarItem`, `SidebarFooter`) funcionam em qualquer um dos lados.',
          '',
          'O `AppShell.Header` renderiza automaticamente um toggle para cada lado habilitado — o da esquerda antes do título, o da direita depois das ações. Para posicionamento customizado existem `AppShell.LeftSidebarTrigger` e `AppShell.RightSidebarTrigger`.',
          '',
          '## Interações',
          '',
          '- **Atalhos**: `[` alterna a sidebar esquerda e `]` a direita (ignorados enquanto um campo editável está focado).',
          '- **Rail de resize**: arraste para redimensionar entre 16–20rem; clique alterna; duplo clique restaura a largura padrão (18rem na esquerda, 20rem na direita); arrastar além do limiar colapsa, e arrastar a partir do estado colapsado reabre.',
          '- **Persistência**: estado e largura de cada lado ficam em cookies próprios (`left-sidebar-state|width`, `right-sidebar-state|width`).',
          '',
          '## Mobile',
          '',
          'Abaixo do breakpoint `lg` as sidebars não existem — a navegação fica no `AppShell.Navbar` (flutuante, no rodapé) e o header mobile usa os slots `logo` e `user`.',
          '',
          '## Announcement',
          '',
          'O `AnnouncementBanner` define a variável global `--announcement-height`, que desloca o header e as sidebars para baixo do banner.',
        ].join('\n'),
      },
    },
  },
  argTypes: {
    leftSidebar: {
      control: 'boolean',
      description:
        'Habilita o estado da sidebar esquerda: painel, toggle automático no header, atalho `[` e cookies `left-sidebar-*`.',
      table: { type: { summary: 'boolean | { defaultOpen?: boolean }' } },
    },
    rightSidebar: {
      control: 'boolean',
      description:
        'Habilita o estado da sidebar direita: painel, toggle automático no header, atalho `]` e cookies `right-sidebar-*`.',
      table: { type: { summary: 'boolean | { defaultOpen?: boolean }' } },
    },
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

function DemoLeftSidebarContent() {
  return (
    <>
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
    </>
  )
}

function DemoRightSidebarContent() {
  return (
    <div className="flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto p-4">
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
    </div>
  )
}

function DemoHeader({ title = 'Visão Geral' }: { title?: string }) {
  return (
    <AppShell.Header
      logo={<OnnebookLogo variant="icon" />}
      leftSidebarToggleLabel="Alternar sidebar esquerda"
      rightSidebarToggleLabel="Alternar sidebar direita"
      title={<span className="truncate font-medium">{title}</span>}
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

type PlaygroundArgs = {
  leftSidebar: boolean
  rightSidebar: boolean
  loading: boolean
  announcement: boolean
  title: string
}

/**
 * Monte a combinação que quiser pelos controls: cada região do shell liga e
 * desliga de forma independente. Experimente também os atalhos `[`/`]` e o
 * arraste nos rails para sentir o comportamento das sidebars.
 */
export const Playground: StoryObj<PlaygroundArgs> = {
  args: {
    leftSidebar: true,
    rightSidebar: true,
    loading: false,
    announcement: false,
    title: 'Visão Geral',
  },
  argTypes: {
    leftSidebar: {
      control: 'boolean',
      description:
        'Habilita a sidebar esquerda (painel, toggle no header e atalho `[`).',
    },
    rightSidebar: {
      control: 'boolean',
      description:
        'Habilita a sidebar direita (painel, toggle no header e atalho `]`).',
    },
    loading: {
      control: 'boolean',
      description: 'Overlay de carregamento do `AppShell.Inset`.',
    },
    announcement: {
      control: 'boolean',
      description:
        'Mostra o `AnnouncementBanner` acima do shell (desloca header e sidebars).',
    },
    title: {
      control: 'text',
      description: 'Título exibido no `AppShell.Header`.',
    },
  },
  parameters: {
    docs: {
      description: {
        story:
          'Playground interativo — use os controls para combinar sidebars, overlay de loading, banner de announcement e título do header.',
      },
    },
  },
  render: (args) => (
    <>
      {args.announcement && (
        <AnnouncementBanner
          type="NEW"
          typeLabel="Novidade"
          message="O novo painel de relatórios já está disponível para todos os estabelecimentos."
        />
      )}

      <div
        className={
          args.announcement ? 'contents' : 'contents [--announcement-height:0px]'
        }
      >
        <AppShell leftSidebar={args.leftSidebar} rightSidebar={args.rightSidebar}>
          {args.leftSidebar && (
            <AppShell.LeftSidebar>
              <DemoLeftSidebarContent />
            </AppShell.LeftSidebar>
          )}

          <DemoNavbar />

          <AppShell.Inset loading={args.loading}>
            <DemoHeader title={args.title} />
            <DemoContent />
          </AppShell.Inset>

          {args.rightSidebar && (
            <AppShell.RightSidebar>
              <DemoRightSidebarContent />
            </AppShell.RightSidebar>
          )}
        </AppShell>
      </div>
    </>
  ),
}

/**
 * O cenário clássico de dashboard: só a sidebar esquerda, com navegação,
 * busca e usuário. O toggle aparece automaticamente no header.
 */
export const LeftSidebarOnly: StoryObj<typeof meta> = {
  decorators: [withoutAnnouncement],
  parameters: {
    docs: {
      description: {
        story:
          'Só a sidebar esquerda (`<AppShell leftSidebar>`). O header mostra apenas o toggle esquerdo.',
      },
    },
  },
  render: () => (
    <AppShell leftSidebar>
      <AppShell.LeftSidebar>
        <DemoLeftSidebarContent />
      </AppShell.LeftSidebar>

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

/**
 * Produto sem sidebar esquerda: só o painel de contexto à direita. Nenhum
 * toggle esquerdo aparece e o chrome do shell (margens, cantos do inset)
 * reage apenas ao painel direito.
 */
export const RightSidebarOnly: StoryObj<typeof meta> = {
  decorators: [withoutAnnouncement],
  parameters: {
    docs: {
      description: {
        story:
          'Só a sidebar direita (`<AppShell rightSidebar>`). O header mostra apenas o toggle direito, na ponta oposta.',
      },
    },
  },
  render: () => (
    <AppShell rightSidebar>
      <DemoNavbar />

      <AppShell.Inset>
        <DemoHeader title="Calendário" />
        <DemoContent />
      </AppShell.Inset>

      <AppShell.RightSidebar>
        <DemoRightSidebarContent />
      </AppShell.RightSidebar>
    </AppShell>
  ),
}

/**
 * As duas sidebars juntas, cada uma com estado, atalho e toggle próprios —
 * o layout de páginas densas (ex.: calendário com painel de filtros).
 */
export const BothSidebars: StoryObj<typeof meta> = {
  decorators: [withoutAnnouncement],
  parameters: {
    docs: {
      description: {
        story:
          'As duas sidebars (`<AppShell leftSidebar rightSidebar>`). Um toggle para cada lado no header; `[` e `]` alternam cada uma de forma independente.',
      },
    },
  },
  render: () => (
    <AppShell leftSidebar rightSidebar>
      <AppShell.LeftSidebar>
        <DemoLeftSidebarContent />
      </AppShell.LeftSidebar>

      <AppShell.Inset>
        <DemoHeader title="Calendário" />
        <DemoContent />
      </AppShell.Inset>

      <AppShell.RightSidebar>
        <DemoRightSidebarContent />
      </AppShell.RightSidebar>
    </AppShell>
  ),
}

function DemoTriggersContent() {
  const toggleLeftSidebar = useLeftSidebarToggle()
  const toggleRightSidebar = useRightSidebarToggle()

  return (
    <main className="flex flex-1 flex-col gap-4 p-4">
      <section className="flex flex-col gap-3 rounded-2xl bg-card p-4">
        <span className="text-sm font-medium">Triggers prontos</span>

        <p className="text-sm text-muted-foreground">
          <code>AppShell.LeftSidebarTrigger</code> e{' '}
          <code>AppShell.RightSidebarTrigger</code> em qualquer posição — mesmo
          ícone e tooltip dos toggles automáticos do header.
        </p>

        <div className="flex items-center gap-2">
          <AppShell.LeftSidebarTrigger label="Alternar sidebar esquerda" />
          <AppShell.RightSidebarTrigger label="Alternar sidebar direita" />
        </div>
      </section>

      <section className="flex flex-col gap-3 rounded-2xl bg-card p-4">
        <span className="text-sm font-medium">Ícone customizado</span>

        <p className="text-sm text-muted-foreground">
          A prop <code>icon</code> aceita o nome de um ícone, um nó qualquer ou
          uma função do estado da sidebar (<code>expanded</code>/
          <code>collapsed</code>).
        </p>

        <div className="flex items-center gap-2">
          <AppShell.LeftSidebarTrigger
            label="Alternar sidebar esquerda"
            icon={(state) => (
              <Icon
                name={
                  state === 'expanded' ? 'ArrowLeftToLine' : 'ArrowRightFromLine'
                }
                className="size-4"
              />
            )}
          />
          <AppShell.RightSidebarTrigger
            label="Alternar sidebar direita"
            icon={(state) => (
              <Icon
                name={
                  state === 'expanded' ? 'ArrowRightToLine' : 'ArrowLeftFromLine'
                }
                className="size-4"
              />
            )}
          />
        </div>
      </section>

      <section className="flex flex-col gap-3 rounded-2xl bg-card p-4">
        <span className="text-sm font-medium">Só a função de toggle</span>

        <p className="text-sm text-muted-foreground">
          <code>useLeftSidebarToggle()</code> e{' '}
          <code>useRightSidebarToggle()</code> devolvem apenas a função de
          toggle, para ligar qualquer elemento seu às sidebars.
        </p>

        <div className="flex flex-wrap items-center gap-2">
          <Button size="sm" variant="secondary" onClick={toggleLeftSidebar}>
            Alternar esquerda
          </Button>
          <Button size="sm" variant="secondary" onClick={toggleRightSidebar}>
            Alternar direita
          </Button>
        </div>
      </section>
    </main>
  )
}

/**
 * Triggers das sidebars fora do header: os componentes prontos (com ícone
 * customizável) e os hooks que expõem só a função de toggle de cada lado.
 */
export const SidebarTriggers: StoryObj<typeof meta> = {
  decorators: [withoutAnnouncement],
  parameters: {
    docs: {
      description: {
        story:
          'Triggers em posições customizadas. `AppShell.LeftSidebarTrigger`/`AppShell.RightSidebarTrigger` são botões prontos (a prop `icon` troca o ícone padrão — nome, nó ou função do estado). Para elementos totalmente próprios, `useLeftSidebarToggle()`/`useRightSidebarToggle()` devolvem só a função de toggle de cada lado.',
      },
    },
  },
  render: () => (
    <AppShell leftSidebar rightSidebar>
      <AppShell.LeftSidebar>
        <DemoLeftSidebarContent />
      </AppShell.LeftSidebar>

      <AppShell.Inset>
        <DemoHeader title="Sidebar triggers" />
        <DemoTriggersContent />
      </AppShell.Inset>

      <AppShell.RightSidebar>
        <DemoRightSidebarContent />
      </AppShell.RightSidebar>
    </AppShell>
  ),
  play: async ({ canvas }) => {
    await expect(canvas.getByText('Triggers prontos')).toBeInTheDocument()
    await expect(canvas.getByText('Alternar esquerda')).toBeInTheDocument()
  },
}

/**
 * Sem nenhuma sidebar: o shell vira header + conteúdo + navbar mobile, sem
 * margens nem cantos arredondados no inset.
 */
export const WithoutSidebars: StoryObj<typeof meta> = {
  decorators: [withoutAnnouncement],
  parameters: {
    docs: {
      description: {
        story:
          'Nenhuma sidebar habilitada (`<AppShell>`). O inset ocupa a viewport inteira e o header não mostra toggle algum.',
      },
    },
  },
  render: () => (
    <AppShell>
      <DemoNavbar />

      <AppShell.Inset>
        <DemoHeader />
        <DemoContent />
      </AppShell.Inset>
    </AppShell>
  ),
}

/**
 * O `AnnouncementBanner` define `--announcement-height` e o shell inteiro
 * (header sticky, sidebars fixas) desliza para baixo do banner.
 */
export const WithAnnouncement: StoryObj<typeof meta> = {
  parameters: {
    docs: {
      description: {
        story:
          'Banner de announcement acima do shell — header e sidebars respeitam `--announcement-height`.',
      },
    },
  },
  render: () => (
    <>
      <AnnouncementBanner
        type="NEW"
        typeLabel="Novidade"
        message="O novo painel de relatórios já está disponível para todos os estabelecimentos."
      />

      <AppShell leftSidebar>
        <AppShell.LeftSidebar>
          <DemoLeftSidebarContent />
        </AppShell.LeftSidebar>

        <DemoNavbar />

        <AppShell.Inset>
          <DemoHeader />
          <DemoContent />
        </AppShell.Inset>
      </AppShell>
    </>
  ),
}

/**
 * `loading` no `AppShell.Inset` cobre o conteúdo com um overlay enquanto o
 * shell (sidebar, navbar) permanece interativo.
 */
export const Loading: StoryObj<typeof meta> = {
  decorators: [withoutAnnouncement],
  parameters: {
    docs: {
      description: {
        story:
          'Overlay de carregamento no inset — o conteúdo fica montado porém oculto, e a sidebar continua utilizável.',
      },
    },
  },
  render: () => (
    <AppShell leftSidebar>
      <AppShell.LeftSidebar>
        <DemoLeftSidebarContent />
      </AppShell.LeftSidebar>

      <AppShell.Inset loading>
        <DemoHeader />
        <DemoContent />
      </AppShell.Inset>
    </AppShell>
  ),
}
