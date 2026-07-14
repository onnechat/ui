import * as React from 'react';

import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, waitFor } from 'storybook/test';

import { Icon } from '@/components/icon';

import { Avatar } from '@/components/ui/avatar';
import { Bubble } from '@/components/ui/bubble';
import { Button } from '@/components/ui/button';
import { Chat } from '@/components/blocks/chat';
import { Kbd } from '@/components/ui/kbd';
import { OnnebookLogo } from '@/components/ui/logo';
import { Marker } from '@/components/ui/marker';
import { Message } from '@/components/ui/message';
import { MessageScroller } from '@/components/ui/message-scroller';
import { Sidebar } from '@/components/ui/sidebar';

import { AnnouncementBanner } from './announcement-banner';
import {
  AppShell,
  useLeftSidebarToggle,
  useRightSidebarToggle,
} from './app-shell';

/**
 * TODO(a11y): violações dos próprios componentes (não das stories), presentes
 * em toda story que renderiza o conteúdo demo das sidebars — corrigir nos
 * componentes e remover este override:
 * - `color-contrast`: `AppShell.Copyright` e o título do
 *   `AppShell.SidebarGroup` usam `text-muted-foreground/50`, e o fallback do
 *   `Avatar` usa `bg-primary`/`text-primary-foreground` — abaixo de 4.5:1;
 * - em `WithAnnouncement` e no Playground com `announcement` ligado somam-se
 *   as violações do `AnnouncementBanner` (ver
 *   `announcement-banner.stories.tsx`).
 */
const componentA11yTodo = { a11y: { test: 'todo' as const } };

const meta: Meta<typeof AppShell> = {
  title: 'Layouts/AppShell',
  component: AppShell,
  subcomponents: {
    'AppShell.LeftSidebar': AppShell.LeftSidebar,
    'AppShell.RightSidebar': AppShell.RightSidebar,
    'AppShell.LeftSidebarTrigger': AppShell.LeftSidebarTrigger,
    'AppShell.RightSidebarTrigger': AppShell.RightSidebarTrigger,
    'AppShell.SidebarHeader': AppShell.SidebarHeader,
    'AppShell.SidebarSection': AppShell.SidebarSection,
    'AppShell.SidebarContent': AppShell.SidebarContent,
    'AppShell.SidebarGroup': AppShell.SidebarGroup,
    'AppShell.SidebarItem': AppShell.SidebarItem,
    'AppShell.SidebarFooter': AppShell.SidebarFooter,
    'AppShell.CommandButton': AppShell.CommandButton,
    'AppShell.Copyright': AppShell.Copyright,
    'AppShell.Header': AppShell.Header,
    'AppShell.Navbar': AppShell.Navbar,
    'AppShell.NavbarItem': AppShell.NavbarItem,
    'AppShell.Inset': AppShell.Inset,
  } as Meta<typeof AppShell>['subcomponents'],
  parameters: {
    layout: 'fullscreen',
    // The shell only shows its sidebars above the `lg` breakpoint (below it the
    // layout is mobile). Storybook's preview iframe is often narrower than that
    // once the nav + addons panels take their space, so force a desktop-width
    // viewport by default — otherwise every story renders as mobile.
    viewport: {
      options: {
        desktop: {
          name: 'Desktop',
          styles: { width: '1440px', height: '900px' },
        },
      },
    },
    docs: {
      // Fullscreen shell layouts rendered inline on the docs page stretch to
      // their content's full height (no scroll). An iframe with a fixed
      // height gives every preview a real viewport: compact, and the page
      // scroll works inside it.
      story: { inline: false, height: '640px' },
      description: {
        component: [
          'Esqueleto das dashboards: sidebars laterais redimensionáveis (inset), header sticky com efeito glass, navbar flutuante no mobile e área de conteúdo (`AppShell.Inset`) que reage às sidebars habilitadas.',
          '',
          '## Sidebars',
          '',
          'Nenhum lado é privilegiado — um produto pode não ter sidebar, ter só a esquerda, só a direita ou as duas. Cada lado é habilitado por uma prop no root (`leftSidebar` / `rightSidebar`, aceitam `boolean` ou `{ defaultOpen?: boolean }`) e renderizado pelo painel correspondente (`AppShell.LeftSidebar` / `AppShell.RightSidebar`). Os building blocks (`SidebarHeader`, `SidebarSection`, `SidebarContent`, `SidebarGroup`, `SidebarItem`, `SidebarFooter`) funcionam em qualquer um dos lados.',
          '',
          'O `AppShell.Header` renderiza automaticamente um toggle para cada lado habilitado — o da esquerda antes do título, o da direita depois das ações. Os slots `leftSidebarTrigger`/`rightSidebarTrigger` do header substituem esse padrão (passe um nó, ex. `<AppShell.LeftSidebarTrigger icon="…" />`) ou o removem (passe `null`). Para posicionamento customizado fora do header existem `AppShell.LeftSidebarTrigger` e `AppShell.RightSidebarTrigger`, e os hooks `useLeftSidebarToggle`/`useRightSidebarToggle` expõem só a função de toggle.',
          '',
          '## Interações',
          '',
          '- **Atalhos**: `[` alterna a sidebar esquerda e `]` a direita (ignorados enquanto um campo editável está focado).',
          '- **Rail de resize**: arraste para redimensionar entre 16–20rem; clique alterna; duplo clique restaura a largura padrão (18rem na esquerda, 20rem na direita); arrastar além do limiar colapsa, e arrastar a partir do estado colapsado reabre.',
          '- **Persistência**: estado e largura de cada lado ficam em cookies próprios (`left-sidebar-state|width`, `right-sidebar-state|width`).',
          '',
          '## Inset',
          '',
          'O `AppShell.Inset` é o painel arredondado do conteúdo. Os slots `top`, `bottom`, `left` e `right` fixam faixas/colunas ao redor do painel, sobre o fundo do shell (estilo Linear), emoldurando os quatro lados da página. No desktop o painel rola o próprio conteúdo entre esses encaixes — os cantos arredondados ficam sempre visíveis (nada de faixa cortando quadrado no scroll); no mobile as faixas viram sticky e o scroll é o da página (full-bleed, sem cantos). Os slots `left`/`right` são o análogo horizontal de `top`/`bottom`: colunas fixas de altura cheia para uma segunda coluna que não é sidebar (lista de conversas, filtros, detalhes) — ver a story `ChatLayout`.',
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
        'Habilita o estado da sidebar esquerda: painel, toggle automático no header, atalho `[` e cookies `left-sidebar-*`. Aceita um objeto para começar fechada (`defaultOpen`) e limitar a largura do resize (`maxWidth`, em px).',
      table: {
        category: 'Comportamento',
        type: {
          summary: 'boolean | { defaultOpen?: boolean; maxWidth?: number }',
        },
        defaultValue: { summary: 'false' },
      },
    },
    rightSidebar: {
      control: 'boolean',
      description:
        'Habilita o estado da sidebar direita: painel, toggle automático no header, atalho `]` e cookies `right-sidebar-*`. Aceita um objeto para começar fechada (`defaultOpen`) e limitar a largura do resize (`maxWidth`, em px).',
      table: {
        category: 'Comportamento',
        type: {
          summary: 'boolean | { defaultOpen?: boolean; maxWidth?: number }',
        },
        defaultValue: { summary: 'false' },
      },
    },
    className: {
      control: 'text',
      description: 'Classes extras aplicadas ao container raiz do shell.',
      table: { category: 'Aparência' },
    },
  },
  globals: {
    viewport: { value: 'desktop', isRotated: false },
  },
  // The `viewport` above forces the CANVAS preview to 1440px, so every story
  // renders desktop there. The autodocs page, however, embeds each story in a
  // ~1000px docs column that the viewport can't widen — below the `lg`
  // breakpoint, so the shell would always render as mobile on the docs page.
  // Opt this component out of autodocs (it's globally on in preview.ts) so
  // clicking it lands on the full-width canvas instead of the misleading docs.
  tags: ['!autodocs'],
};

export default meta;

function DemoWorkspaceSwitcher() {
  return (
    <Sidebar.Menu>
      <Sidebar.MenuItem>
        <Sidebar.MenuButton
          size="lg"
          className="[&>svg]:size-5 cursor-pointer h-12 group-data-[collapsible=icon]:mx-auto group-data-[collapsible=icon]:size-9! group-data-[collapsible=icon]:justify-center"
        >
          <Avatar className="relative flex shrink-0 overflow-hidden size-8 rounded-lg border">
            <Avatar.Fallback name="Acme Barbearia" />
          </Avatar>

          <div className="grid flex-1 min-w-0 text-left leading-tight group-data-[collapsible=icon]:hidden">
            <span className="text-sm truncate font-medium">Acme Barbearia</span>

            <span className="truncate text-xs text-muted-foreground -mt-0.5">
              @acme-barbearia
            </span>
          </div>

          <Icon
            name="CaretExpandY"
            className="ml-auto shrink-0 size-5 text-muted-foreground group-data-[collapsible=icon]:hidden"
          />
        </Sidebar.MenuButton>
      </Sidebar.MenuItem>
    </Sidebar.Menu>
  );
}

function DemoUser() {
  return (
    <Sidebar.MenuButton
      size="lg"
      className="cursor-pointer h-12 group-data-[collapsible=icon]:mx-auto group-data-[collapsible=icon]:size-9! group-data-[collapsible=icon]:justify-center"
    >
      <Avatar className="relative flex shrink-0 overflow-hidden lg:min-w-8 lg:min-h-8 aspect-square border">
        <Avatar.Fallback name="User Example" />
      </Avatar>

      <div className="hidden lg:grid flex-1 min-w-0 text-left leading-tight group-data-[collapsible=icon]:!hidden">
        <span className="text-sm truncate font-medium">User Example</span>

        <span className="truncate text-xs text-muted-foreground -mt-0.5">
          user@example.com
        </span>
      </div>
    </Sidebar.MenuButton>
  );
}

function DemoLeftSidebarContent() {
  return (
    <>
      <AppShell.SidebarHeader>
        <a
          href="#"
          className="outline-none focus-visible:border-ring focus-visible:ring-ring focus-visible:ring-2 active:scale-[99.35%] active:grayscale transition-[scale,filter] rounded-md p-2"
        >
          {/* Full wordmark when expanded; icon-only once collapsed to the rail. */}
          <OnnebookLogo className="group-data-[collapsible=icon]:hidden" />
          <OnnebookLogo
            variant="icon"
            className="hidden group-data-[collapsible=icon]:block"
          />
        </a>

        <Button
          size="icon-sm"
          variant="ghost"
          aria-label="Notificações"
          className="group-data-[collapsible=icon]:hidden"
        >
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
  );
}

function DemoRightSidebarContent() {
  return (
    <div className="flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto p-4">
      <div className="shrink-0 w-full h-12 rounded-xl bg-sidebar-accent" />

      <div className="flex min-w-0 flex-col gap-3">
        <div className="flex items-center justify-between gap-2">
          <span className="text-sm font-medium">Filtros</span>

          <Button
            size="icon"
            variant="ghost"
            aria-label="Recolher filtros"
            className="size-8 shrink-0"
          >
            <Icon name="ChevronDown" className="size-4 rotate-180" />
          </Button>
        </div>

        <div className="h-24 rounded-xl bg-sidebar-accent" />
        <div className="h-24 rounded-xl bg-sidebar-accent" />
      </div>
    </div>
  );
}

function DemoHeader({
  title = 'Visão Geral',
  leftSidebarTrigger,
  rightSidebarTrigger,
}: {
  title?: string;
  leftSidebarTrigger?: React.ReactNode;
  rightSidebarTrigger?: React.ReactNode;
}) {
  return (
    <AppShell.Header
      logo={<OnnebookLogo variant="icon" />}
      leftSidebarToggleLabel="Alternar sidebar esquerda"
      rightSidebarToggleLabel="Alternar sidebar direita"
      leftSidebarTrigger={leftSidebarTrigger}
      rightSidebarTrigger={rightSidebarTrigger}
      title={<span className="truncate font-medium">{title}</span>}
      user={
        <Avatar className="size-10 rounded-2xl border lg:hidden">
          <Avatar.Fallback name="User Example" />
        </Avatar>
      }
    />
  );
}

function DemoNavbar() {
  return (
    <AppShell.Navbar>
      <AppShell.NavbarItem icon="House6" href="#" active />
      <AppShell.NavbarItem icon="Calendar" href="#" />
      <AppShell.NavbarItem icon="Stack2" href="#" />
    </AppShell.Navbar>
  );
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
  );
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
  );
}

/**
 * The left sidebar's open/collapsed state persists in a cookie SHARED by every
 * AppShell story, so expanding it in another story would leak in and hide this
 * one's icon rail. Clear it during render — before the shell reads it in its
 * layout effect — so `defaultOpen: false` (the icon rail) always wins on open.
 */
function withLeftSidebarReset(Story: React.ComponentType) {
  React.useState(() => {
    if (typeof document !== 'undefined') {
      document.cookie = 'left-sidebar-state=; path=/; max-age=0';
    }
    return null;
  });

  return <Story />;
}

type TriggerMode = 'automático' | 'customizado' | 'oculto';

type PlaygroundArgs = {
  leftSidebar: boolean;
  rightSidebar: boolean;
  header: boolean;
  title: string;
  leftTrigger: TriggerMode;
  rightTrigger: TriggerMode;
  insetTop: boolean;
  insetBottom: boolean;
  insetLeft: boolean;
  insetRight: boolean;
  tallContent: boolean;
  loading: boolean;
  navbar: boolean;
  announcement: boolean;
};

function resolveTriggerSlot(
  mode: TriggerMode,
  side: 'left' | 'right',
): React.ReactNode {
  if (mode === 'oculto') return null;
  if (mode === 'automático') return undefined;

  const Trigger =
    side === 'left'
      ? AppShell.LeftSidebarTrigger
      : AppShell.RightSidebarTrigger;

  return (
    <Trigger
      label={side === 'left' ? 'Alternar navegação' : 'Alternar painel'}
      icon={state => (
        <Icon
          name={
            side === 'left'
              ? state === 'expanded'
                ? 'ArrowLeftToLine'
                : 'ArrowRightFromLine'
              : state === 'expanded'
                ? 'ArrowRightToLine'
                : 'ArrowLeftFromLine'
          }
          className="size-4"
        />
      )}
    />
  );
}

/**
 * Todos os recursos do shell em um só lugar: monte a combinação que quiser
 * pelos controls — sidebars, header e seus triggers, faixas fixas do inset,
 * navbar mobile, loading e announcement. Experimente também os atalhos
 * `[`/`]` e o arraste nos rails.
 */
export const Playground: StoryObj<PlaygroundArgs> = {
  args: {
    leftSidebar: true,
    rightSidebar: true,
    header: true,
    title: 'Visão Geral',
    leftTrigger: 'automático',
    rightTrigger: 'automático',
    insetTop: false,
    insetBottom: false,
    insetLeft: false,
    insetRight: false,
    tallContent: false,
    loading: false,
    navbar: true,
    announcement: false,
  },
  argTypes: {
    leftSidebar: {
      control: 'boolean',
      description:
        'Habilita a sidebar esquerda (painel, toggle no header e atalho `[`).',
      table: { category: 'Sidebars' },
    },
    rightSidebar: {
      control: 'boolean',
      description:
        'Habilita a sidebar direita (painel, toggle no header e atalho `]`).',
      table: { category: 'Sidebars' },
    },
    header: {
      control: 'boolean',
      description: 'Renderiza o `AppShell.Header` no topo do inset.',
      table: { category: 'Header' },
    },
    title: {
      control: 'text',
      description: 'Título exibido no `AppShell.Header`.',
      table: { category: 'Header' },
    },
    leftTrigger: {
      control: 'radio',
      options: ['automático', 'customizado', 'oculto'],
      description:
        'Slot `leftSidebarTrigger` do header: automático, substituído por um trigger com ícone próprio, ou removido (`null`).',
      table: { category: 'Header' },
    },
    rightTrigger: {
      control: 'radio',
      options: ['automático', 'customizado', 'oculto'],
      description:
        'Slot `rightSidebarTrigger` do header: automático, substituído por um trigger com ícone próprio, ou removido (`null`).',
      table: { category: 'Header' },
    },
    insetTop: {
      control: 'boolean',
      description:
        'Slot `top` do inset — banner de trial fixo acima do painel.',
      table: { category: 'Inset' },
    },
    insetBottom: {
      control: 'boolean',
      description:
        'Slot `bottom` do inset — barra da assistente fixa abaixo do painel (no mobile cede ao navbar).',
      table: { category: 'Inset' },
    },
    insetLeft: {
      control: 'boolean',
      description:
        'Slot `left` do inset — coluna fixa ladeando o painel à esquerda (ex.: lista/segmentos). Só desktop.',
      table: { category: 'Inset' },
    },
    insetRight: {
      control: 'boolean',
      description:
        'Slot `right` do inset — coluna fixa ladeando o painel à direita (ex.: resumo/detalhes). Só desktop.',
      table: { category: 'Inset' },
    },
    tallContent: {
      control: 'boolean',
      description:
        'Conteúdo longo para testar o scroll da página com as faixas fixas.',
      table: { category: 'Inset' },
    },
    loading: {
      control: 'boolean',
      description: 'Overlay de carregamento do `AppShell.Inset`.',
      table: { category: 'Inset' },
    },
    navbar: {
      control: 'boolean',
      description:
        'Renderiza o `AppShell.Navbar` (flutuante, visível só abaixo de `lg`).',
      table: { category: 'Shell' },
    },
    announcement: {
      control: 'boolean',
      description:
        'Mostra o `AnnouncementBanner` acima do shell (desloca header e sidebars).',
      table: { category: 'Shell' },
    },
  },
  parameters: {
    ...componentA11yTodo,
    docs: {
      description: {
        story:
          'Playground interativo com todos os recursos do shell: sidebars por lado, header com slots de trigger (automático/customizado/oculto), encaixes fixos do inset nos quatro lados (`top`/`bottom`/`left`/`right`), conteúdo longo para sentir o scroll, navbar mobile, loading e announcement — tudo combinável pelos controls.',
      },
    },
  },
  render: args => (
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
          args.announcement
            ? 'contents'
            : 'contents [--announcement-height:0px]'
        }
      >
        <AppShell
          leftSidebar={args.leftSidebar}
          rightSidebar={args.rightSidebar}
        >
          {args.leftSidebar && (
            <AppShell.LeftSidebar>
              <DemoLeftSidebarContent />
            </AppShell.LeftSidebar>
          )}

          {args.navbar && <DemoNavbar />}

          <AppShell.Inset
            loading={args.loading}
            top={args.insetTop ? <DemoTrialBanner /> : undefined}
            bottom={args.insetBottom ? <DemoAssistantBar /> : undefined}
            left={args.insetLeft ? <DemoInsetLeft /> : undefined}
            right={args.insetRight ? <DemoInsetRight /> : undefined}
          >
            {args.header && (
              <DemoHeader
                title={args.title}
                leftSidebarTrigger={resolveTriggerSlot(
                  args.leftTrigger,
                  'left',
                )}
                rightSidebarTrigger={resolveTriggerSlot(
                  args.rightTrigger,
                  'right',
                )}
              />
            )}
            {args.tallContent ? <DemoTallContent /> : <DemoContent />}
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
  play: async ({ canvas, canvasElement, userEvent }) => {
    const sidebar = canvasElement.querySelector<HTMLElement>(
      '[data-slot="sidebar"][data-side="left"]',
    );

    await expect(sidebar).not.toBeNull();

    // O estado inicial vem de cookie (persistência entre visitas), então o
    // teste alterna a partir do estado atual em vez de assumir 'expanded'.
    const initialState = sidebar!.getAttribute('data-state');
    const toggledState = initialState === 'expanded' ? 'collapsed' : 'expanded';

    const toggle = await canvas.findByRole('button', {
      name: 'Alternar sidebar esquerda',
    });

    await userEvent.click(toggle);
    await waitFor(() =>
      expect(sidebar).toHaveAttribute('data-state', toggledState),
    );

    // Volta ao estado inicial para não vazar o cookie para outras stories.
    await userEvent.click(toggle);
    await waitFor(() =>
      expect(sidebar).toHaveAttribute('data-state', initialState!),
    );
  },
};

/**
 * O cenário clássico de dashboard: só a sidebar esquerda, com navegação,
 * busca e usuário. O toggle aparece automaticamente no header.
 */
export const LeftSidebarOnly: StoryObj<typeof meta> = {
  decorators: [withoutAnnouncement],
  parameters: {
    ...componentA11yTodo,
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
    await expect(canvas.getAllByText('Visão Geral').length).toBeGreaterThan(0);
    await expect(canvas.getByText('Pesquisar…')).toBeInTheDocument();
  },
};

/**
 * Modo **icon-rail**: em vez de sumir, a sidebar colapsa para uma coluna
 * estreita só de ícones (os labels viram `title` nativo no hover). Ative com
 * `leftSidebar={{ collapsible: 'icon' }}`. Aqui começa colapsada — use o toggle
 * do header (ou a tecla `[`) para expandir.
 */
export const IconRail: StoryObj<typeof meta> = {
  decorators: [withoutAnnouncement],
  parameters: {
    ...componentA11yTodo,
    docs: {
      description: {
        story:
          'Sidebar que colapsa para um rail de ícones (`collapsible: "icon"`) em vez de off-canvas. O rail mantém ícones + tooltips; expandir traz os labels de volta.',
      },
    },
  },
  render: () => (
    <AppShell leftSidebar={{ collapsible: 'icon', defaultOpen: false }}>
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
};

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
};

/**
 * As duas sidebars juntas, cada uma com estado, atalho e toggle próprios —
 * o layout de páginas densas (ex.: calendário com painel de filtros).
 */
export const BothSidebars: StoryObj<typeof meta> = {
  decorators: [withoutAnnouncement],
  parameters: {
    ...componentA11yTodo,
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
};

function DemoTriggersContent() {
  const toggleLeftSidebar = useLeftSidebarToggle();
  const toggleRightSidebar = useRightSidebarToggle();

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
            icon={state => (
              <Icon
                name={
                  state === 'expanded'
                    ? 'ArrowLeftToLine'
                    : 'ArrowRightFromLine'
                }
                className="size-4"
              />
            )}
          />
          <AppShell.RightSidebarTrigger
            label="Alternar sidebar direita"
            icon={state => (
              <Icon
                name={
                  state === 'expanded'
                    ? 'ArrowRightToLine'
                    : 'ArrowLeftFromLine'
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
  );
}

/**
 * Triggers das sidebars fora do header: os componentes prontos (com ícone
 * customizável) e os hooks que expõem só a função de toggle de cada lado.
 */
export const SidebarTriggers: StoryObj<typeof meta> = {
  decorators: [withoutAnnouncement],
  parameters: {
    ...componentA11yTodo,
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
    await expect(canvas.getByText('Triggers prontos')).toBeInTheDocument();
    await expect(canvas.getByText('Alternar esquerda')).toBeInTheDocument();
  },
};

/**
 * Os slots `leftSidebarTrigger`/`rightSidebarTrigger` do header controlam os
 * toggles automáticos: `null` remove (a sidebar continua funcionando via
 * atalho/rail/triggers próprios) e um nó substitui pelo seu.
 */
export const HeaderTriggerSlots: StoryObj<typeof meta> = {
  decorators: [withoutAnnouncement],
  parameters: {
    ...componentA11yTodo,
    docs: {
      description: {
        story:
          'Header com `leftSidebarTrigger={null}` (toggle esquerdo removido — a sidebar segue operável pelo atalho `[` e pelo rail) e `rightSidebarTrigger` substituído por um trigger com ícone customizado.',
      },
    },
  },
  render: () => (
    <AppShell leftSidebar rightSidebar>
      <AppShell.LeftSidebar>
        <DemoLeftSidebarContent />
      </AppShell.LeftSidebar>

      <AppShell.Inset>
        <AppShell.Header
          logo={<OnnebookLogo variant="icon" />}
          title={
            <span className="truncate font-medium">Header trigger slots</span>
          }
          leftSidebarTrigger={null}
          rightSidebarTrigger={
            <AppShell.RightSidebarTrigger
              label="Alternar painel de filtros"
              icon={state => (
                <Icon
                  name={state === 'expanded' ? 'Eye' : 'Gear'}
                  className="size-4"
                />
              )}
            />
          }
          user={
            <Avatar className="size-10 rounded-2xl border lg:hidden">
              <Avatar.Fallback name="User Example" />
            </Avatar>
          }
        />
        <DemoContent />
      </AppShell.Inset>

      <AppShell.RightSidebar>
        <DemoRightSidebarContent />
      </AppShell.RightSidebar>
    </AppShell>
  ),
};

function DemoTallContent() {
  return (
    <main className="flex flex-1 flex-col gap-4 p-4">
      <div className="grid gap-4 md:grid-cols-3">
        <div className="h-32 rounded-2xl bg-card" />
        <div className="h-32 rounded-2xl bg-card" />
        <div className="h-32 rounded-2xl bg-card" />
      </div>
      {Array.from({ length: 8 }).map((_, index) => (
        <div key={index} className="h-40 shrink-0 rounded-2xl bg-card" />
      ))}
    </main>
  );
}

function DemoTrialBanner() {
  return (
    <div className="flex min-h-12 flex-wrap items-center justify-center gap-x-3 gap-y-1 px-4 py-2">
      <p className="text-sm text-muted-foreground">
        <Icon name="Clock" className="mr-1.5 inline size-3.5 align-[-2px]" />
        Seu período de teste termina em{' '}
        <strong className="font-medium text-foreground">5 dias</strong>.
      </p>
      <Button size="sm" variant="primary">
        Fazer upgrade
      </Button>
    </div>
  );
}

function DemoAssistantBar() {
  return (
    <div className="flex items-center justify-between gap-4 px-4 py-2">
      <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
        <Icon name="ArrowRotate" className="size-3.5" />
        Sincronizado agora há pouco
      </p>

      <div className="flex items-center gap-1">
        <Button size="sm" variant="ghost">
          <Icon name="Sparkle" className="size-4" />
          Perguntar à assistente
          <Kbd keys={['Mod', 'K']} className="ml-1" />
        </Button>
        <Button size="icon-sm" variant="ghost" aria-label="Conversas recentes">
          <Icon name="Message" className="size-4" />
        </Button>
      </div>
    </div>
  );
}

function DemoInsetLeft() {
  return (
    <div className="flex h-full w-60 flex-col gap-1 overflow-y-auto p-3">
      <span className="px-2 pb-1 text-xs font-medium uppercase text-muted-foreground/60">
        Segmentos
      </span>
      {['Todos os clientes', 'Novos este mês', 'Recorrentes', 'Inativos'].map(
        (label, i) => (
          <button
            key={label}
            type="button"
            data-active={i === 0}
            className="flex items-center gap-2 rounded-lg px-2 py-2 text-left text-sm text-muted-foreground transition-colors hover:bg-sidebar-accent data-[active=true]:bg-sidebar-accent data-[active=true]:text-foreground"
          >
            <Icon name="Users" className="size-4 shrink-0" />
            <span className="truncate">{label}</span>
          </button>
        ),
      )}
    </div>
  );
}

function DemoInsetRight() {
  return (
    <div className="flex h-full w-72 flex-col gap-3 overflow-y-auto p-4">
      <span className="text-xs font-medium uppercase text-muted-foreground/60">
        Resumo
      </span>
      {['Total', 'Ativos', 'Ticket médio'].map(label => (
        <div key={label} className="flex flex-col gap-1 rounded-xl bg-card p-3">
          <span className="text-xs text-muted-foreground">{label}</span>
          <span className="text-lg font-semibold">—</span>
        </div>
      ))}
    </div>
  );
}

/**
 * Slot `top` do `AppShell.Inset`: faixa fixa acima do painel, sobre o fundo
 * do shell — aqui um aviso de fim de período de teste, o caso clássico de
 * SaaS. A página rola normalmente; a faixa nunca se move.
 */
export const InsetPinnedTop: StoryObj<typeof meta> = {
  decorators: [withoutAnnouncement],
  parameters: {
    ...componentA11yTodo,
    docs: {
      description: {
        story:
          'Só o slot `top`: um banner de cobrança/trial fixo acima do painel ("Seu período de teste termina em 5 dias" + upgrade). Serve igualmente para avisos de incidente ou modo de manutenção. Role a página — o painel desliza por baixo, o header gruda sob o banner e o banner não se move.',
      },
    },
  },
  render: () => (
    <AppShell leftSidebar>
      <AppShell.LeftSidebar>
        <DemoLeftSidebarContent />
      </AppShell.LeftSidebar>

      <AppShell.Inset top={<DemoTrialBanner />}>
        <DemoHeader title="Visão Geral" />
        <DemoTallContent />
      </AppShell.Inset>
    </AppShell>
  ),
};

/**
 * Slot `bottom` do `AppShell.Inset`: barra fixa abaixo do painel, sobre o
 * fundo do shell — o padrão do Linear, aqui como barra da assistente com
 * status de sincronização. A página rola; a barra fica fixa no rodapé.
 */
export const InsetPinnedBottom: StoryObj<typeof meta> = {
  decorators: [withoutAnnouncement],
  parameters: {
    ...componentA11yTodo,
    docs: {
      description: {
        story:
          'Só o slot `bottom`: a barra da assistente fixa sob o painel (status de sincronização à esquerda, "Perguntar à assistente" com atalho à direita), como o "Ask Linear" do Linear. Outros usos reais: player de áudio, ações de seleção em massa, status de conexão.',
      },
    },
  },
  render: () => (
    <AppShell leftSidebar rightSidebar>
      <AppShell.LeftSidebar>
        <DemoLeftSidebarContent />
      </AppShell.LeftSidebar>

      <AppShell.Inset bottom={<DemoAssistantBar />}>
        <DemoHeader title="Calendário" />
        <DemoTallContent />
      </AppShell.Inset>

      <AppShell.RightSidebar>
        <DemoRightSidebarContent />
      </AppShell.RightSidebar>
    </AppShell>
  ),
};

/**
 * Os dois slots do `AppShell.Inset` juntos: impersonation de suporte no topo
 * e a barra da assistente embaixo — o painel desliza no meio, as faixas nunca
 * se movem.
 */
export const InsetPinnedSlots: StoryObj<typeof meta> = {
  decorators: [withoutAnnouncement],
  parameters: {
    ...componentA11yTodo,
    docs: {
      description: {
        story:
          '`top` e `bottom` juntos: no topo a faixa de impersonation ("Você está visualizando como…", padrão de painéis de suporte/admin) e embaixo a barra da assistente. O scroll é o da página — as duas faixas ficam fixas na tela e o painel central desliza entre elas. Com as duas sidebars, o shell oferece encaixes nos quatro lados da página.',
      },
    },
  },
  render: () => (
    <AppShell leftSidebar rightSidebar>
      <AppShell.LeftSidebar>
        <DemoLeftSidebarContent />
      </AppShell.LeftSidebar>

      <AppShell.Inset
        top={
          <div className="flex min-h-9 flex-wrap items-center justify-center gap-x-2 gap-y-1 px-4 py-1.5 text-xs text-muted-foreground">
            <Icon name="Eye" className="size-3.5" />
            Você está visualizando como{' '}
            <strong className="font-medium text-foreground">
              Acme Barbearia
            </strong>
            <Button
              size="sm"
              variant="outline"
              className="ml-1 h-6 px-2 text-xs"
            >
              Sair da visualização
            </Button>
          </div>
        }
        bottom={<DemoAssistantBar />}
      >
        <DemoHeader title="Visão Geral" />
        <DemoTallContent />
      </AppShell.Inset>

      <AppShell.RightSidebar>
        <DemoRightSidebarContent />
      </AppShell.RightSidebar>
    </AppShell>
  ),
};

/**
 * `left` e `right` são o análogo horizontal de `top`/`bottom`: colunas
 * fixas de altura cheia que ladeiam o painel, sobre o fundo do shell. Servem
 * para uma segunda coluna que NÃO é uma sidebar (uma lista, um painel de
 * filtros, detalhes) sem precisar aninhar outra sidebar. O painel continua
 * rolando o próprio conteúdo entre elas, com os cantos sempre arredondados.
 */
export const LateralInsets: StoryObj<typeof meta> = {
  decorators: [withoutAnnouncement],
  parameters: {
    ...componentA11yTodo,
    docs: {
      description: {
        story:
          'Encaixes `left`/`right`: colunas fixas ladeando o painel. Aqui a esquerda lista segmentos e a direita mostra um resumo — o painel central rola sozinho entre elas.',
      },
    },
  },
  render: () => (
    <AppShell leftSidebar>
      <AppShell.LeftSidebar>
        <DemoLeftSidebarContent />
      </AppShell.LeftSidebar>

      <AppShell.Inset
        left={
          <div className="flex h-full w-64 flex-col gap-1 overflow-y-auto p-3">
            <span className="px-2 pb-1 text-xs font-medium uppercase text-muted-foreground/60">
              Segmentos
            </span>
            {[
              'Todos os clientes',
              'Novos este mês',
              'Recorrentes',
              'Inativos',
              'Aniversariantes',
            ].map((label, i) => (
              <button
                key={label}
                type="button"
                data-active={i === 0}
                className="flex items-center gap-2 rounded-lg px-2 py-2 text-left text-sm text-muted-foreground transition-colors hover:bg-sidebar-accent data-[active=true]:bg-sidebar-accent data-[active=true]:text-foreground"
              >
                <Icon name="Users" className="size-4 shrink-0" />
                <span className="truncate">{label}</span>
              </button>
            ))}
          </div>
        }
        right={
          <div className="flex h-full w-72 flex-col gap-3 overflow-y-auto p-4">
            <span className="text-xs font-medium uppercase text-muted-foreground/60">
              Resumo
            </span>
            {['Total', 'Ativos', 'Ticket médio'].map(label => (
              <div
                key={label}
                className="flex flex-col gap-1 rounded-xl bg-card p-3"
              >
                <span className="text-xs text-muted-foreground">{label}</span>
                <span className="text-lg font-semibold">—</span>
              </div>
            ))}
          </div>
        }
      >
        <DemoHeader title="Clientes" />
        <DemoTallContent />
      </AppShell.Inset>
    </AppShell>
  ),
};

/* ---------------------------------------------------------------------------
 * ChatLayout — um exemplo real de composição: uma tela de mensagens montada
 * SÓ com componentes da lib. O `left` inset é a lista de conversas (uma
 * segunda coluna que não é sidebar), o painel é o bloco `Chat` (thread) e a
 * sidebar direita são os detalhes do contato.
 * ------------------------------------------------------------------------- */

type DemoConversation = {
  id: string;
  name: string;
  initials: string;
  preview: string;
  time: string;
  unread?: number;
};

const DEMO_CONVERSATIONS: DemoConversation[] = [
  {
    id: 'marina',
    name: 'Marina Lopes',
    initials: 'ML',
    preview: 'Perfeito. Qualquer ajuste é só falar.',
    time: '09:32',
  },
  {
    id: 'diego',
    name: 'Diego Ramos',
    initials: 'DR',
    preview: 'Você: mando o orçamento ainda hoje 👍',
    time: '09:04',
  },
  {
    id: 'equipe',
    name: 'Equipe Atendimento',
    initials: 'EA',
    preview: 'Bruno: alguém consegue cobrir o balcão?',
    time: 'Ontem',
    unread: 3,
  },
  {
    id: 'clara',
    name: 'Clara Nunes',
    initials: 'CN',
    preview: 'Obrigada pelo atendimento de hoje!',
    time: 'Ontem',
  },
  {
    id: 'fornecedor',
    name: 'Distribuidora Sul',
    initials: 'DS',
    preview: 'Pedido #4821 saiu para entrega.',
    time: 'Ter',
  },
];

function DemoConversationList({ activeId }: { activeId: string }) {
  return (
    <div className="flex h-full w-80 flex-col overflow-hidden">
      <div className="flex shrink-0 items-center justify-between gap-2 px-4 pt-4 pb-2">
        <span className="text-base font-semibold">Conversas</span>
        <Button variant="ghost" size="icon-sm" aria-label="Nova conversa">
          <Icon name="PenNib" className="size-4" />
        </Button>
      </div>

      <div className="shrink-0 px-4 pb-2">
        <div className="flex h-9 items-center gap-2 rounded-lg bg-muted px-2.5 text-sm text-muted-foreground">
          <Icon name="Magnifier" className="size-4 shrink-0" />
          <span className="truncate">Pesquisar…</span>
        </div>
      </div>

      <div className="flex min-h-0 flex-1 flex-col gap-0.5 overflow-y-auto px-2 pb-3">
        {DEMO_CONVERSATIONS.map(conversation => (
          <button
            key={conversation.id}
            type="button"
            data-active={conversation.id === activeId}
            className="flex items-center gap-3 rounded-xl px-2 py-2.5 text-left transition-colors hover:bg-sidebar-accent data-[active=true]:bg-sidebar-accent"
          >
            <Avatar className="size-10 shrink-0">
              <Avatar.Fallback className="bg-card text-card-foreground text-sm">
                {conversation.initials}
              </Avatar.Fallback>
            </Avatar>

            <div className="flex min-w-0 flex-1 flex-col">
              <div className="flex items-baseline justify-between gap-2">
                <span className="truncate text-sm font-medium">
                  {conversation.name}
                </span>
                <span className="shrink-0 text-xs text-muted-foreground">
                  {conversation.time}
                </span>
              </div>
              <div className="flex items-center justify-between gap-2">
                <span className="truncate text-xs text-muted-foreground">
                  {conversation.preview}
                </span>
                {conversation.unread ? (
                  <span className="flex size-4.5 shrink-0 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-semibold text-primary-foreground">
                    {conversation.unread}
                  </span>
                ) : null}
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

function DemoContactDetails() {
  return (
    <div className="flex h-full w-full flex-col gap-5 overflow-y-auto p-5">
      <div className="flex flex-col items-center gap-2 text-center">
        <Avatar className="size-20">
          <Avatar.Fallback className="bg-card text-card-foreground text-xl">
            ML
          </Avatar.Fallback>
        </Avatar>
        <div className="flex flex-col">
          <span className="text-base font-semibold">Marina Lopes</span>
          <span className="text-xs text-muted-foreground">online</span>
        </div>
        <div className="mt-1 flex gap-1.5">
          <Button variant="outline" size="icon-sm" aria-label="Ligar">
            <Icon name="Phone" className="size-4" />
          </Button>
          <Button variant="outline" size="icon-sm" aria-label="Vídeo">
            <Icon name="Video" className="size-4" />
          </Button>
          <Button variant="outline" size="icon-sm" aria-label="Silenciar">
            <Icon name="BellSlash" className="size-4" />
          </Button>
        </div>
      </div>

      <div className="flex flex-col gap-1">
        <span className="px-1 text-xs font-medium uppercase text-muted-foreground/60">
          Informações
        </span>
        {[
          { icon: 'Envelope' as const, label: 'marina@exemplo.com' },
          { icon: 'Phone' as const, label: '+55 11 90000-0000' },
          { icon: 'MapPin' as const, label: 'São Paulo, SP' },
        ].map(row => (
          <div
            key={row.label}
            className="flex items-center gap-3 rounded-lg px-1 py-2 text-sm"
          >
            <Icon
              name={row.icon}
              className="size-4 shrink-0 text-muted-foreground"
            />
            <span className="truncate">{row.label}</span>
          </div>
        ))}
      </div>

      <div className="flex flex-col gap-2">
        <span className="px-1 text-xs font-medium uppercase text-muted-foreground/60">
          Arquivos
        </span>
        <div className="grid grid-cols-3 gap-2">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="aspect-square rounded-lg bg-muted" />
          ))}
        </div>
      </div>
    </div>
  );
}

type DemoChatMsg = { id: string; role: 'me' | 'them'; text: string };

type DemoChatGroup = {
  id: string;
  role: 'me' | 'them';
  messages: DemoChatMsg[];
};

function groupChatMessages(messages: DemoChatMsg[]): DemoChatGroup[] {
  const groups: DemoChatGroup[] = [];
  for (const message of messages) {
    const last = groups[groups.length - 1];
    if (last && last.role === message.role) last.messages.push(message);
    else
      groups.push({ id: message.id, role: message.role, messages: [message] });
  }
  return groups;
}

const DEMO_CHAT_REPLIES = [
  'Boa, faz sentido! Vou ajustar por aqui.',
  'Perfeito, obrigada! 🙌',
  'Fechou! Qualquer coisa a gente se fala.',
];

/**
 * Corpo do exemplo de chat, parametrizado por `locked` — as duas stories
 * abaixo (alternável e travada) reusam o mesmo layout.
 */
function ChatLayoutDemo({ locked = false }: { locked?: boolean }) {
  const [messages, setMessages] = React.useState<DemoChatMsg[]>([
    { id: 'd0', role: 'them', text: 'Oi! Conseguiu ver a proposta?' },
    { id: 'd1', role: 'me', text: 'Consegui sim, tô revisando agora.' },
    { id: 'd2', role: 'them', text: 'Perfeito. Qualquer ajuste é só falar.' },
  ]);
  const [typing, setTyping] = React.useState(false);
  const idRef = React.useRef(3);
  const replyRef = React.useRef(0);

  const send = (text: string) => {
    setMessages(prev => [
      ...prev,
      { id: `m${idRef.current++}`, role: 'me', text },
    ]);
    setTyping(true);
    window.setTimeout(() => {
      const reply =
        DEMO_CHAT_REPLIES[replyRef.current % DEMO_CHAT_REPLIES.length];
      replyRef.current += 1;
      setTyping(false);
      setMessages(prev => [
        ...prev,
        { id: `t${idRef.current++}`, role: 'them', text: reply },
      ]);
    }, 1600);
  };

  const groups = groupChatMessages(messages);
  const themAvatar = (
    <Avatar className="size-7">
      <Avatar.Fallback className="bg-card text-card-foreground text-xs">
        ML
      </Avatar.Fallback>
    </Avatar>
  );

  return (
    <AppShell
      leftSidebar={{ collapsible: 'icon', defaultOpen: false, locked }}
      rightSidebar={{ defaultOpen: true, locked }}
    >
      <AppShell.LeftSidebar>
        <DemoLeftSidebarContent />
      </AppShell.LeftSidebar>

      <AppShell.Inset left={<DemoConversationList activeId="marina" />}>
        <Chat
          autoScroll
          className="h-full max-w-none rounded-none border-0 bg-transparent shadow-none"
        >
          <Chat.Header>
            <Chat.Identity
              title="Marina Lopes"
              subtitle="online"
              avatar={
                <Avatar>
                  <Avatar.Fallback className="bg-card text-card-foreground">
                    ML
                  </Avatar.Fallback>
                </Avatar>
              }
            />
            <Chat.HeaderActions>
              <AppShell.RightSidebarTrigger
                icon="SidebarToggle"
                className="scale-x-[-1]"
              />
            </Chat.HeaderActions>
          </Chat.Header>

          <Chat.Body>
            <Marker>
              <Marker.Icon>
                <Icon name="ShieldCheck" />
              </Marker.Icon>
              <Marker.Content>
                As mensagens desta conversa são protegidas
              </Marker.Content>
            </Marker>

            <Marker variant="separator">
              <Marker.Content>Hoje</Marker.Content>
            </Marker>

            {groups.map(group => {
              const isMe = group.role === 'me';
              return (
                <MessageScroller.Item
                  key={group.id}
                  messageId={group.id}
                  scrollAnchor={isMe}
                >
                  <Message align={isMe ? 'end' : 'start'}>
                    {!isMe && <Message.Avatar>{themAvatar}</Message.Avatar>}
                    <Message.Content>
                      <Message.Group>
                        {group.messages.map(message => (
                          <Bubble
                            key={message.id}
                            variant={isMe ? 'outgoing' : 'incoming'}
                          >
                            <Bubble.Content>{message.text}</Bubble.Content>
                          </Bubble>
                        ))}
                      </Message.Group>
                    </Message.Content>
                  </Message>
                </MessageScroller.Item>
              );
            })}
          </Chat.Body>

          {typing && <Chat.Typing>Marina está digitando</Chat.Typing>}

          <Chat.Composer
            onSend={send}
            actions={
              <Button variant="ghost" size="icon-sm" aria-label="Anexar">
                <Icon name="Plus" />
              </Button>
            }
          />
        </Chat>
      </AppShell.Inset>

      <AppShell.RightSidebar>
        <DemoContactDetails />
      </AppShell.RightSidebar>
    </AppShell>
  );
}

/**
 * Exemplo de composição real: uma tela de mensagens montada só com componentes
 * da lib. O `left` inset lista as conversas, o painel é o bloco `Chat` (a
 * thread ativa) e a sidebar direita traz os detalhes do contato — a sidebar
 * esquerda vira um icon rail (navegação principal). Aqui o rail é alternável:
 * o toggle e o atalho `[` colapsam/expandem.
 */
export const ChatLayout: StoryObj<typeof meta> = {
  decorators: [withoutAnnouncement, withLeftSidebarReset],
  parameters: {
    ...componentA11yTodo,
    docs: {
      description: {
        story:
          'Um app de mensagens montado com o AppShell: icon rail (nav) + `left` inset (lista de conversas) + painel (bloco `Chat`) + sidebar direita (detalhes do contato). O painel rola só a thread; a lista e os detalhes ficam fixos. O rail alterna normalmente.',
      },
    },
  },
  render: () => <ChatLayoutDemo />,
};

/**
 * Mesma tela, mas com as sidebars **travadas** (`locked: true`): o rail fica
 * fixo em ícones e o painel de contato sempre aberto — sem toggle no header,
 * sem clique no rail, sem resize e sem os atalhos `[`/`]`. É o modo para uma
 * navegação que nunca deve mudar de forma.
 */
export const ChatLayoutLocked: StoryObj<typeof meta> = {
  decorators: [withoutAnnouncement],
  parameters: {
    ...componentA11yTodo,
    docs: {
      description: {
        story:
          'Variante travada do `ChatLayout` — `leftSidebar`/`rightSidebar` com `locked: true`. A sidebar esquerda fica permanentemente em icon rail e a direita sempre aberta; toggle, rail, resize e atalhos `[`/`]` ficam desativados.',
      },
    },
  },
  render: () => <ChatLayoutDemo locked />,
};

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
};

/**
 * O `AnnouncementBanner` define `--announcement-height` e o shell inteiro
 * (header sticky, sidebars fixas) desliza para baixo do banner.
 */
export const WithAnnouncement: StoryObj<typeof meta> = {
  parameters: {
    ...componentA11yTodo,
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
};

/**
 * `loading` no `AppShell.Inset` cobre o conteúdo com um overlay enquanto o
 * shell (sidebar, navbar) permanece interativo.
 */
export const Loading: StoryObj<typeof meta> = {
  decorators: [withoutAnnouncement],
  parameters: {
    ...componentA11yTodo,
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
};
