import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, waitFor, within } from 'storybook/test';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Drawer } from './drawer';

// O Root do vaul expõe props como união discriminada (snapPoints etc.), o que
// colapsa a inferência de args do Storybook para `never`. Tipo plano resolve.
type DrawerPlaygroundArgs = {
  direction?: 'top' | 'right' | 'bottom' | 'left';
  modal?: boolean;
  dismissible?: boolean;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  children?: React.ReactNode;
} & Pick<
  React.ComponentProps<typeof Drawer.Content>,
  'title' | 'showDivider' | 'rounded'
>;

const meta: Meta<DrawerPlaygroundArgs> = {
  title: 'UI/Drawer',
  component: Drawer,
  subcomponents: {
    'Drawer.Trigger': Drawer.Trigger,
    'Drawer.Content': Drawer.Content,
    'Drawer.Header': Drawer.Header,
    'Drawer.Footer': Drawer.Footer,
    'Drawer.Title': Drawer.Title,
    'Drawer.Description': Drawer.Description,
    'Drawer.Close': Drawer.Close,
  } as Meta<DrawerPlaygroundArgs>['subcomponents'],
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    direction: {
      control: 'select',
      options: ['top', 'right', 'bottom', 'left'],
      description: 'Lado da tela de onde o drawer desliza.',
      table: {
        category: 'Comportamento',
        type: { summary: "'top' | 'right' | 'bottom' | 'left'" },
        defaultValue: { summary: "'bottom'" },
      },
    },
    modal: {
      control: 'boolean',
      description:
        'Bloqueia interação com o restante da página enquanto aberto.',
      table: { category: 'Comportamento', defaultValue: { summary: 'true' } },
    },
    dismissible: {
      control: 'boolean',
      description:
        'Permite fechar arrastando ou clicando fora. Com `false`, só fecha programaticamente.',
      table: { category: 'Comportamento', defaultValue: { summary: 'true' } },
    },
    open: {
      control: false,
      description: 'Abre/fecha o drawer no modo controlado.',
      table: { category: 'Estado' },
    },
    defaultOpen: {
      control: false,
      description: 'Abre o drawer na montagem, no modo não controlado.',
      table: { category: 'Estado' },
    },
    onOpenChange: {
      control: false,
      description:
        'Callback disparado quando o drawer abre/fecha. Recebe `boolean`.',
      table: { category: 'Estado' },
    },
    title: {
      control: 'text',
      description:
        'Título acessível (`sr-only`) do painel — prop de `Drawer.Content`.',
      table: { category: 'Conteúdo', defaultValue: { summary: "'Title'" } },
    },
    showDivider: {
      control: 'boolean',
      description:
        'Exibe o "handle" de arraste no topo (apenas na direção bottom) — prop de `Drawer.Content`.',
      table: { category: 'Aparência', defaultValue: { summary: 'false' } },
    },
    rounded: {
      control: 'boolean',
      description:
        'Arredonda a borda do painel nas direções top/bottom — prop de `Drawer.Content`.',
      table: { category: 'Aparência', defaultValue: { summary: 'true' } },
    },
    children: {
      control: false,
      description:
        'Composição livre de `Drawer.Trigger`, `Drawer.Content`, `Drawer.Header`, `Drawer.Footer`, etc.',
      table: { category: 'Conteúdo' },
    },
  },
  args: {
    direction: 'bottom',
    modal: true,
    dismissible: true,
    title: 'Drawer Title',
    showDivider: true,
    rounded: true,
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  render: ({ title, showDivider, rounded, ...args }) => (
    <Drawer {...args}>
      <Drawer.Trigger asChild>
        <Button variant="outline">Open Drawer</Button>
      </Drawer.Trigger>
      <Drawer.Content title={title} showDivider={showDivider} rounded={rounded}>
        <div className="p-4 pb-8">
          <p className="text-sm text-muted-foreground">
            This is a basic drawer with content.
          </p>
        </div>
      </Drawer.Content>
    </Drawer>
  ),
  play: async ({ canvas, userEvent }) => {
    await userEvent.click(canvas.getByRole('button', { name: 'Open Drawer' }));

    // O drawer abre em portal no document.body.
    const body = within(document.body);
    const content = await body.findByText(
      'This is a basic drawer with content.',
    );
    await waitFor(() => expect(content).toBeVisible());
  },
};

export const WithHeaderAndFooter: Story = {
  render: () => (
    <Drawer>
      <Drawer.Trigger asChild>
        <Button variant="outline">Edit Profile</Button>
      </Drawer.Trigger>
      <Drawer.Content title="Edit Profile" showDivider>
        <Drawer.Header>
          <Drawer.Title>Edit Profile</Drawer.Title>
          <Drawer.Description>
            Make changes to your profile here. Click save when done.
          </Drawer.Description>
        </Drawer.Header>
        <div className="flex flex-col gap-4 p-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Name</label>
            <Input placeholder="Your name" defaultValue="John Doe" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Email</label>
            <Input placeholder="Your email" defaultValue="john@example.com" />
          </div>
        </div>
        <Drawer.Footer>
          <Button variant="primary">Save changes</Button>
          <Drawer.Close asChild>
            <Button variant="outline">Cancel</Button>
          </Drawer.Close>
        </Drawer.Footer>
      </Drawer.Content>
    </Drawer>
  ),
};

export const TopDirection: Story = {
  render: () => (
    <Drawer direction="top">
      <Drawer.Trigger asChild>
        <Button variant="outline">Open Top</Button>
      </Drawer.Trigger>
      <Drawer.Content title="Top Drawer">
        <div className="p-4 pb-8">
          <p className="text-sm text-muted-foreground">
            This drawer slides in from the top.
          </p>
        </div>
      </Drawer.Content>
    </Drawer>
  ),
};

export const LeftDirection: Story = {
  render: () => (
    <Drawer direction="left">
      <Drawer.Trigger asChild>
        <Button variant="outline">Open Left</Button>
      </Drawer.Trigger>
      <Drawer.Content title="Left Drawer">
        <Drawer.Header>
          <Drawer.Title>Navigation</Drawer.Title>
        </Drawer.Header>
        <div className="flex flex-col gap-2 p-4">
          {['Home', 'Search', 'Settings', 'Profile'].map(item => (
            <button
              key={item}
              className="flex items-center gap-3 rounded-lg p-3 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground"
            >
              {item}
            </button>
          ))}
        </div>
      </Drawer.Content>
    </Drawer>
  ),
};

export const RightDirection: Story = {
  render: () => (
    <Drawer direction="right">
      <Drawer.Trigger asChild>
        <Button variant="outline">Open Right</Button>
      </Drawer.Trigger>
      <Drawer.Content title="Right Drawer">
        <Drawer.Header>
          <Drawer.Title>Details</Drawer.Title>
          <Drawer.Description>
            Additional information about the selected item.
          </Drawer.Description>
        </Drawer.Header>
        <div className="space-y-3 p-4">
          {['Created', 'Modified', 'Size', 'Owner'].map(field => (
            <div key={field} className="flex justify-between text-sm">
              <span className="text-muted-foreground">{field}</span>
              <span className="font-medium">—</span>
            </div>
          ))}
        </div>
      </Drawer.Content>
    </Drawer>
  ),
};

export const Confirmation: Story = {
  // TODO(a11y): o Button variant="destructive" (branco sobre --destructive)
  // tem contraste 3.8 < 4.5 — cor definida no tema/componente Button, não na story.
  parameters: { a11y: { test: 'todo' } },
  render: () => (
    <Drawer>
      <Drawer.Trigger asChild>
        <Button variant="destructive">Delete Account</Button>
      </Drawer.Trigger>
      <Drawer.Content title="Delete Account" showDivider>
        <Drawer.Header>
          <Drawer.Title>Are you absolutely sure?</Drawer.Title>
          <Drawer.Description>
            This action cannot be undone. This will permanently delete your
            account and remove your data from our servers.
          </Drawer.Description>
        </Drawer.Header>
        <Drawer.Footer>
          <Button variant="destructive">Yes, delete my account</Button>
          <Drawer.Close asChild>
            <Button variant="outline">Cancel</Button>
          </Drawer.Close>
        </Drawer.Footer>
      </Drawer.Content>
    </Drawer>
  ),
};
