import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, waitFor, within } from 'storybook/test';

import { Sheet } from './sheet';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

type SheetPlaygroundArgs = React.ComponentProps<typeof Sheet> &
  Pick<React.ComponentProps<typeof Sheet.Content>, 'side'>;

const meta: Meta<SheetPlaygroundArgs> = {
  title: 'UI/Sheet',
  component: Sheet,
  subcomponents: {
    'Sheet.Trigger': Sheet.Trigger,
    'Sheet.Content': Sheet.Content,
    'Sheet.Header': Sheet.Header,
    'Sheet.Footer': Sheet.Footer,
    'Sheet.Title': Sheet.Title,
    'Sheet.Description': Sheet.Description,
    'Sheet.Close': Sheet.Close,
  } as Meta<SheetPlaygroundArgs>['subcomponents'],
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs', 'new'],
  argTypes: {
    side: {
      control: 'select',
      options: ['top', 'right', 'bottom', 'left'],
      description:
        'Lado da tela de onde o painel desliza — prop de `Sheet.Content`.',
      table: {
        category: 'Aparência',
        type: { summary: "'top' | 'right' | 'bottom' | 'left'" },
        defaultValue: { summary: "'right'" },
      },
    },
    modal: {
      control: 'boolean',
      description:
        "Bloqueia interação com o restante da página enquanto aberto. Também aceita `'trap-focus'` para prender só o foco.",
      table: { category: 'Comportamento', defaultValue: { summary: 'true' } },
    },
    open: {
      control: false,
      description: 'Abre/fecha o sheet no modo controlado.',
      table: { category: 'Estado' },
    },
    defaultOpen: {
      control: false,
      description: 'Abre o sheet na montagem, no modo não controlado.',
      table: { category: 'Estado' },
    },
    onOpenChange: {
      control: false,
      description:
        'Callback disparado quando o sheet abre/fecha. Recebe `(open, eventDetails)`.',
      table: { category: 'Estado' },
    },
    children: {
      control: false,
      description:
        'Composição livre de `Sheet.Trigger`, `Sheet.Content`, `Sheet.Header`, `Sheet.Footer`, etc.',
      table: { category: 'Conteúdo' },
    },
  },
  args: {
    side: 'right',
    modal: true,
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  render: ({ side, ...args }) => (
    <Sheet {...args}>
      <Sheet.Trigger asChild>
        <Button variant="outline">Open Sheet</Button>
      </Sheet.Trigger>
      <Sheet.Content side={side}>
        <Sheet.Header>
          <Sheet.Title>Sheet Title</Sheet.Title>
          <Sheet.Description>
            This is a sheet that slides in from the {side}.
          </Sheet.Description>
        </Sheet.Header>
        <div className="flex-1 px-4">
          <p className="text-sm text-muted-foreground">
            Sheet content goes here.
          </p>
        </div>
        <Sheet.Footer>
          <Sheet.Close asChild>
            <Button variant="outline">Cancel</Button>
          </Sheet.Close>
          <Sheet.Close asChild>
            <Button>Save</Button>
          </Sheet.Close>
        </Sheet.Footer>
      </Sheet.Content>
    </Sheet>
  ),
  play: async ({ canvas, userEvent }) => {
    await userEvent.click(canvas.getByRole('button', { name: 'Open Sheet' }));

    // O sheet abre em portal no document.body.
    const body = within(document.body);
    const title = await body.findByRole('heading', { name: 'Sheet Title' });
    await waitFor(() => expect(title).toBeVisible());
  },
};

export const Left: Story = {
  render: () => (
    <Sheet>
      <Sheet.Trigger asChild>
        <Button variant="outline">Open Sheet (Left)</Button>
      </Sheet.Trigger>
      <Sheet.Content side="left">
        <Sheet.Header>
          <Sheet.Title>Navigation</Sheet.Title>
        </Sheet.Header>
        <div className="flex flex-col gap-1 px-4">
          {['Home', 'Products', 'About', 'Contact'].map(label => (
            <Sheet.Close key={label} asChild>
              <Button variant="ghost" className="justify-start">
                {label}
              </Button>
            </Sheet.Close>
          ))}
        </div>
      </Sheet.Content>
    </Sheet>
  ),
};

export const Top: Story = {
  render: () => (
    <Sheet>
      <Sheet.Trigger asChild>
        <Button variant="outline">Open Sheet (Top)</Button>
      </Sheet.Trigger>
      <Sheet.Content side="top">
        <Sheet.Header>
          <Sheet.Title>Notifications</Sheet.Title>
          <Sheet.Description>You have 3 new notifications.</Sheet.Description>
        </Sheet.Header>
      </Sheet.Content>
    </Sheet>
  ),
};

export const Bottom: Story = {
  render: () => (
    <Sheet>
      <Sheet.Trigger asChild>
        <Button variant="outline">Open Sheet (Bottom)</Button>
      </Sheet.Trigger>
      <Sheet.Content side="bottom">
        <Sheet.Header>
          <Sheet.Title>Quick Actions</Sheet.Title>
        </Sheet.Header>
        <div className="flex gap-2 px-4">
          <Button variant="primary" className="flex-1">
            Share
          </Button>
          <Button variant="outline" className="flex-1">
            Download
          </Button>
        </div>
      </Sheet.Content>
    </Sheet>
  ),
};

export const WithForm: Story = {
  render: () => (
    <Sheet>
      <Sheet.Trigger asChild>
        <Button variant="outline">Edit Profile</Button>
      </Sheet.Trigger>
      <Sheet.Content side="right">
        <Sheet.Header>
          <Sheet.Title>Edit Profile</Sheet.Title>
          <Sheet.Description>
            Make changes to your profile. Click save when done.
          </Sheet.Description>
        </Sheet.Header>
        <div className="flex flex-col gap-4 px-4">
          <Input placeholder="Name" />
          <Input placeholder="Email" type="email" />
        </div>
        <Sheet.Footer>
          <Sheet.Close asChild>
            <Button variant="outline">Cancel</Button>
          </Sheet.Close>
          <Button variant="primary">Save</Button>
        </Sheet.Footer>
      </Sheet.Content>
    </Sheet>
  ),
};
