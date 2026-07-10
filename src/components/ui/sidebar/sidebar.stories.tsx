import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, waitFor } from 'storybook/test';

import { Sidebar } from './sidebar';
import { FillIconName, Icon } from '@/components/icon';

const meta: Meta<typeof Sidebar> = {
  title: 'UI/Sidebar',
  component: Sidebar,
  subcomponents: {
    'Sidebar.Provider': Sidebar.Provider,
    'Sidebar.Header': Sidebar.Header,
    'Sidebar.Content': Sidebar.Content,
    'Sidebar.Footer': Sidebar.Footer,
    'Sidebar.Group': Sidebar.Group,
    'Sidebar.GroupLabel': Sidebar.GroupLabel,
    'Sidebar.GroupContent': Sidebar.GroupContent,
    'Sidebar.GroupAction': Sidebar.GroupAction,
    'Sidebar.Menu': Sidebar.Menu,
    'Sidebar.MenuItem': Sidebar.MenuItem,
    'Sidebar.MenuButton': Sidebar.MenuButton,
    'Sidebar.MenuAction': Sidebar.MenuAction,
    'Sidebar.MenuBadge': Sidebar.MenuBadge,
    'Sidebar.MenuSkeleton': Sidebar.MenuSkeleton,
    'Sidebar.MenuSub': Sidebar.MenuSub,
    'Sidebar.MenuSubItem': Sidebar.MenuSubItem,
    'Sidebar.MenuSubButton': Sidebar.MenuSubButton,
    'Sidebar.Separator': Sidebar.Separator,
    'Sidebar.Input': Sidebar.Input,
    'Sidebar.Inset': Sidebar.Inset,
    'Sidebar.Rail': Sidebar.Rail,
    'Sidebar.Trigger': Sidebar.Trigger,
  } as Meta<typeof Sidebar>['subcomponents'],
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs', 'new'],
  decorators: [
    Story => (
      <Sidebar.Provider>
        <Story />
      </Sidebar.Provider>
    ),
  ],
  argTypes: {
    side: {
      control: 'inline-radio',
      options: ['left', 'right'],
      description: 'Lado da tela onde a sidebar fica ancorada.',
      table: {
        category: 'Aparência',
        type: { summary: "'left' | 'right'" },
        defaultValue: { summary: "'left'" },
      },
    },
    variant: {
      control: 'select',
      options: ['sidebar', 'floating', 'inset'],
      description:
        'Estilo do container: fixa (sidebar), flutuante (floating) ou com conteúdo recuado (inset).',
      table: {
        category: 'Aparência',
        type: { summary: "'sidebar' | 'floating' | 'inset'" },
        defaultValue: { summary: "'sidebar'" },
      },
    },
    collapsible: {
      control: 'select',
      options: ['offcanvas', 'icon', 'none'],
      description:
        'Como a sidebar colapsa: desliza para fora (offcanvas), reduz para ícones (icon) ou não colapsa (none).',
      table: {
        category: 'Comportamento',
        type: { summary: "'offcanvas' | 'icon' | 'none'" },
        defaultValue: { summary: "'offcanvas'" },
      },
    },
    children: {
      control: false,
      description:
        'Composição interna: `Sidebar.Header`, `Sidebar.Content`, `Sidebar.Footer`, etc.',
      table: { category: 'Conteúdo' },
    },
    className: {
      control: 'text',
      description: 'Classes extras aplicadas ao container da sidebar.',
      table: { category: 'Aparência' },
    },
  },
  args: {
    side: 'left',
    variant: 'sidebar',
    collapsible: 'offcanvas',
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

const NAV_ITEMS: { label: string; icon: FillIconName; active?: boolean }[] = [
  { label: 'Dashboard', icon: 'House' as const, active: true },
  { label: 'Analytics', icon: 'ChartColumn' as const },
  { label: 'Settings', icon: 'Gear' as const },
  { label: 'Users', icon: 'UserGroup' as const },
];

export const Playground: Story = {
  render: args => (
    <div className="flex flex-1 min-h-screen">
      <Sidebar {...args}>
        <Sidebar.Header>
          <div className="flex items-center gap-2 p-2">
            <Icon name="House" className="size-4" />
            <span className="font-semibold">Onne</span>
          </div>
        </Sidebar.Header>

        <Sidebar.Content>
          <Sidebar.Group>
            <Sidebar.GroupLabel>Menu</Sidebar.GroupLabel>
            <Sidebar.GroupContent>
              <Sidebar.Menu>
                {NAV_ITEMS.map(item => (
                  <Sidebar.MenuItem key={item.label}>
                    <Sidebar.MenuButton isActive={item.active}>
                      <Icon name={item.icon} className="size-4" />
                      <span>{item.label}</span>
                    </Sidebar.MenuButton>
                  </Sidebar.MenuItem>
                ))}
              </Sidebar.Menu>
            </Sidebar.GroupContent>
          </Sidebar.Group>
        </Sidebar.Content>

        <Sidebar.Footer>
          <div className="flex items-center gap-2 p-2 text-sm text-muted-foreground">
            <Icon name="User" className="size-4" />
            <span>admin@onne.com</span>
          </div>
        </Sidebar.Footer>
      </Sidebar>

      <Sidebar.Inset className="flex flex-1 w-full">
        <header className="flex items-center gap-2 border-b p-4">
          <Sidebar.Trigger />
          <h1 className="text-lg font-semibold">Dashboard</h1>
        </header>
        <main className="p-6">
          <p className="text-muted-foreground">Page content goes here.</p>
        </main>
      </Sidebar.Inset>
    </div>
  ),
  play: async ({ canvas, userEvent }) => {
    const sidebar = document.querySelector('[data-slot="sidebar"]');
    await expect(sidebar).toHaveAttribute('data-state', 'expanded');

    // O trigger alterna entre colapsada e expandida.
    const trigger = canvas.getByRole('button', { name: 'Expand sidebar' });
    await userEvent.click(trigger);
    await waitFor(() =>
      expect(sidebar).toHaveAttribute('data-state', 'collapsed'),
    );

    await userEvent.click(trigger);
    await waitFor(() =>
      expect(sidebar).toHaveAttribute('data-state', 'expanded'),
    );
  },
};
