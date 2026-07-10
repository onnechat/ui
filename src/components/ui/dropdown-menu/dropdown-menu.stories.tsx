import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, waitFor, within } from 'storybook/test';

import { Button } from '@/components/ui/button';
import { Icon } from '@/components/icon';
import { DropdownMenu } from './dropdown-menu';

type DropdownMenuPlaygroundArgs = React.ComponentProps<typeof DropdownMenu> &
  Pick<
    React.ComponentProps<typeof DropdownMenu.Content>,
    'side' | 'align' | 'sideOffset' | 'rounded'
  >;

const meta: Meta<DropdownMenuPlaygroundArgs> = {
  title: 'UI/DropdownMenu',
  component: DropdownMenu,
  subcomponents: {
    'DropdownMenu.Trigger': DropdownMenu.Trigger,
    'DropdownMenu.Content': DropdownMenu.Content,
    'DropdownMenu.Group': DropdownMenu.Group,
    'DropdownMenu.Item': DropdownMenu.Item,
    'DropdownMenu.CheckboxItem': DropdownMenu.CheckboxItem,
    'DropdownMenu.RadioGroup': DropdownMenu.RadioGroup,
    'DropdownMenu.RadioItem': DropdownMenu.RadioItem,
    'DropdownMenu.Label': DropdownMenu.Label,
    'DropdownMenu.Separator': DropdownMenu.Separator,
    'DropdownMenu.Shortcut': DropdownMenu.Shortcut,
    'DropdownMenu.Sub': DropdownMenu.Sub,
    'DropdownMenu.SubTrigger': DropdownMenu.SubTrigger,
    'DropdownMenu.SubContent': DropdownMenu.SubContent,
  } as Meta<DropdownMenuPlaygroundArgs>['subcomponents'],
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    side: {
      control: 'select',
      options: ['top', 'right', 'bottom', 'left'],
      description:
        'Lado do trigger onde o menu abre — prop de `DropdownMenu.Content`.',
      table: {
        category: 'Aparência',
        type: { summary: "'top' | 'right' | 'bottom' | 'left'" },
        defaultValue: { summary: "'bottom'" },
      },
    },
    align: {
      control: 'inline-radio',
      options: ['start', 'center', 'end'],
      description:
        'Alinhamento em relação ao trigger — prop de `DropdownMenu.Content`.',
      table: {
        category: 'Aparência',
        type: { summary: "'start' | 'center' | 'end'" },
        defaultValue: { summary: "'start'" },
      },
    },
    sideOffset: {
      control: 'number',
      description:
        'Distância (px) entre o menu e o trigger — prop de `DropdownMenu.Content`.',
      table: { category: 'Aparência', defaultValue: { summary: '4' } },
    },
    rounded: {
      control: 'boolean',
      description:
        'Arredonda o popup e os itens das extremidades (edge-to-edge) — prop de `DropdownMenu.Content`.',
      table: { category: 'Aparência', defaultValue: { summary: 'true' } },
    },
    modal: {
      control: 'boolean',
      description:
        'Bloqueia interação com o restante da página enquanto aberto.',
      table: { category: 'Comportamento', defaultValue: { summary: 'true' } },
    },
    disabled: {
      control: 'boolean',
      description: 'Desabilita a abertura do menu.',
      table: { category: 'Comportamento', defaultValue: { summary: 'false' } },
    },
    open: {
      control: false,
      description: 'Abre/fecha o menu no modo controlado.',
      table: { category: 'Estado' },
    },
    defaultOpen: {
      control: false,
      description: 'Abre o menu na montagem, no modo não controlado.',
      table: { category: 'Estado' },
    },
    onOpenChange: {
      control: false,
      description:
        'Callback disparado quando o menu abre/fecha. Recebe `boolean`.',
      table: { category: 'Estado' },
    },
    children: {
      control: false,
      description:
        'Composição livre de `DropdownMenu.Trigger`, `DropdownMenu.Content`, itens, grupos, submenus, etc. No mobile o conteúdo abre como Drawer.',
      table: { category: 'Conteúdo' },
    },
  },
  args: {
    side: 'bottom',
    align: 'start',
    sideOffset: 4,
    rounded: true,
    modal: true,
    disabled: false,
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  render: ({ side, align, sideOffset, rounded, ...args }) => (
    <DropdownMenu {...args}>
      <DropdownMenu.Trigger asChild>
        <Button variant="outline">Open Menu</Button>
      </DropdownMenu.Trigger>
      <DropdownMenu.Content
        side={side}
        align={align}
        sideOffset={sideOffset}
        rounded={rounded}
        className="w-44"
      >
        <DropdownMenu.Item>
          <Icon name="User" className="size-4" />
          Profile
        </DropdownMenu.Item>
        <DropdownMenu.Item>
          <Icon name="Gear" className="size-4" />
          Settings
        </DropdownMenu.Item>
        <DropdownMenu.Separator />
        <DropdownMenu.Item>
          <Icon name="CircleLogout" className="size-4" />
          Log out
        </DropdownMenu.Item>
      </DropdownMenu.Content>
    </DropdownMenu>
  ),
  play: async ({ canvas, userEvent }) => {
    await userEvent.click(canvas.getByRole('button', { name: 'Open Menu' }));

    // O menu abre em portal no document.body.
    const body = within(document.body);
    const item = await body.findByRole('menuitem', { name: 'Profile' });
    await waitFor(() => expect(item).toBeVisible());
  },
};

export const WithShortcuts: Story = {
  render: () => (
    <DropdownMenu>
      <DropdownMenu.Trigger asChild>
        <Button variant="outline">Edit</Button>
      </DropdownMenu.Trigger>
      <DropdownMenu.Content className="w-48">
        <DropdownMenu.Item>
          <Icon name="Undo" className="size-4" />
          Undo
          <DropdownMenu.Shortcut>⌘Z</DropdownMenu.Shortcut>
        </DropdownMenu.Item>
        <DropdownMenu.Item>
          <Icon name="Redo" className="size-4" />
          Redo
          <DropdownMenu.Shortcut>⌘⇧Z</DropdownMenu.Shortcut>
        </DropdownMenu.Item>
        <DropdownMenu.Separator />
        <DropdownMenu.Item>
          <Icon name="Clipboard" className="size-4" />
          Copy
          <DropdownMenu.Shortcut>⌘C</DropdownMenu.Shortcut>
        </DropdownMenu.Item>
        <DropdownMenu.Item>
          <Icon name="Scissors" className="size-4" />
          Cut
          <DropdownMenu.Shortcut>⌘X</DropdownMenu.Shortcut>
        </DropdownMenu.Item>
        <DropdownMenu.Item>
          <Icon name="ClipboardCheck" className="size-4" />
          Paste
          <DropdownMenu.Shortcut>⌘V</DropdownMenu.Shortcut>
        </DropdownMenu.Item>
      </DropdownMenu.Content>
    </DropdownMenu>
  ),
};

export const Destructive: Story = {
  render: () => (
    <DropdownMenu>
      <DropdownMenu.Trigger asChild>
        <Button variant="outline">Actions</Button>
      </DropdownMenu.Trigger>
      <DropdownMenu.Content className="w-48">
        <DropdownMenu.Group>
          <DropdownMenu.Label>Danger Zone</DropdownMenu.Label>
        </DropdownMenu.Group>
        <DropdownMenu.Separator />
        <DropdownMenu.Item variant="destructive">
          <Icon name="Trash" className="size-4" />
          Delete
        </DropdownMenu.Item>
        <DropdownMenu.Item variant="destructive">
          <Icon name="Bomb" className="size-4" />
          Destroy
        </DropdownMenu.Item>
      </DropdownMenu.Content>
    </DropdownMenu>
  ),
};

export const Checkboxes: Story = {
  render: function CheckboxStory() {
    const [showStatus, setShowStatus] = React.useState(true);
    const [showBar, setShowBar] = React.useState(false);

    return (
      <DropdownMenu>
        <DropdownMenu.Trigger asChild>
          <Button variant="outline">View</Button>
        </DropdownMenu.Trigger>
        <DropdownMenu.Content className="w-48">
          <DropdownMenu.Group>
            <DropdownMenu.Label>Appearance</DropdownMenu.Label>
          </DropdownMenu.Group>
          <DropdownMenu.Separator />
          <DropdownMenu.CheckboxItem
            checked={showStatus}
            onCheckedChange={setShowStatus}
          >
            Status Bar
          </DropdownMenu.CheckboxItem>
          <DropdownMenu.CheckboxItem
            checked={showBar}
            onCheckedChange={setShowBar}
          >
            Sidebar
          </DropdownMenu.CheckboxItem>
          <DropdownMenu.CheckboxItem checked disabled>
            Activity Bar
          </DropdownMenu.CheckboxItem>
        </DropdownMenu.Content>
      </DropdownMenu>
    );
  },
};

export const RadioGroup: Story = {
  render: function RadioStory() {
    const [position, setPosition] = React.useState('bottom');

    return (
      <DropdownMenu>
        <DropdownMenu.Trigger asChild>
          <Button variant="outline">Position</Button>
        </DropdownMenu.Trigger>
        <DropdownMenu.Content className="w-44">
          <DropdownMenu.Group>
            <DropdownMenu.Label>Panel Position</DropdownMenu.Label>
          </DropdownMenu.Group>
          <DropdownMenu.Separator />
          <DropdownMenu.RadioGroup value={position} onValueChange={setPosition}>
            <DropdownMenu.RadioItem value="top">Top</DropdownMenu.RadioItem>
            <DropdownMenu.RadioItem value="bottom">
              Bottom
            </DropdownMenu.RadioItem>
            <DropdownMenu.RadioItem value="left">Left</DropdownMenu.RadioItem>
            <DropdownMenu.RadioItem value="right">Right</DropdownMenu.RadioItem>
          </DropdownMenu.RadioGroup>
        </DropdownMenu.Content>
      </DropdownMenu>
    );
  },
};

export const Submenu: Story = {
  render: () => (
    <DropdownMenu>
      <DropdownMenu.Trigger asChild>
        <Button variant="outline">Share</Button>
      </DropdownMenu.Trigger>
      <DropdownMenu.Content className="w-48">
        <DropdownMenu.Item>
          <Icon name="Link" className="size-4" />
          Copy link
        </DropdownMenu.Item>
        <DropdownMenu.Sub>
          <DropdownMenu.SubTrigger>
            <Icon name="Nodes" className="size-4" />
            Share via
          </DropdownMenu.SubTrigger>
          <DropdownMenu.Portal>
            <DropdownMenu.SubContent className="w-40">
              <DropdownMenu.Item>
                <Icon name="Envelope" className="size-4" />
                Email
              </DropdownMenu.Item>
              <DropdownMenu.Item>
                <Icon name="Message" className="size-4" />
                Message
              </DropdownMenu.Item>
              <DropdownMenu.Separator />
              <DropdownMenu.Item>
                <Icon name="Sitemap" className="size-4" />
                More...
              </DropdownMenu.Item>
            </DropdownMenu.SubContent>
          </DropdownMenu.Portal>
        </DropdownMenu.Sub>
        <DropdownMenu.Separator />
        <DropdownMenu.Item>
          <Icon name="Bookmark" className="size-4" />
          Save
          <DropdownMenu.Shortcut>⌘S</DropdownMenu.Shortcut>
        </DropdownMenu.Item>
      </DropdownMenu.Content>
    </DropdownMenu>
  ),
};

export const DisabledItems: Story = {
  render: () => (
    <DropdownMenu>
      <DropdownMenu.Trigger asChild>
        <Button variant="outline">Options</Button>
      </DropdownMenu.Trigger>
      <DropdownMenu.Content className="w-44">
        <DropdownMenu.Item>
          <Icon name="Eye" className="size-4" />
          View
        </DropdownMenu.Item>
        <DropdownMenu.Item disabled>
          <Icon name="Pencil" className="size-4" />
          Edit
        </DropdownMenu.Item>
        <DropdownMenu.Item disabled>
          <Icon name="Trash" className="size-4" />
          Delete
        </DropdownMenu.Item>
        <DropdownMenu.Separator />
        <DropdownMenu.Item>
          <Icon name="Nodes" className="size-4" />
          Share
        </DropdownMenu.Item>
      </DropdownMenu.Content>
    </DropdownMenu>
  ),
};

export const WithPortal: Story = {
  render: () => (
    <DropdownMenu>
      <DropdownMenu.Trigger asChild>
        <Button variant="outline">Portal</Button>
      </DropdownMenu.Trigger>
      <DropdownMenu.Portal>
        <DropdownMenu.Content className="w-48">
          <DropdownMenu.Item>
            <Icon name="User" className="size-4" />
            Profile
          </DropdownMenu.Item>
          <DropdownMenu.Item>
            <Icon name="Gear" className="size-4" />
            Settings
          </DropdownMenu.Item>
          <DropdownMenu.Item>
            <Icon name="CircleLogout" className="size-4" />
            Log out
          </DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu>
  ),
};
