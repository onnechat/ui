import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, waitFor, within } from 'storybook/test';

import { Popover } from './popover';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

type PopoverPlaygroundArgs = React.ComponentProps<typeof Popover> &
  Pick<
    React.ComponentProps<typeof Popover.Content>,
    'side' | 'align' | 'sideOffset' | 'alignOffset' | 'showArrow'
  >;

const meta: Meta<PopoverPlaygroundArgs> = {
  title: 'UI/Popover',
  component: Popover,
  subcomponents: {
    'Popover.Trigger': Popover.Trigger,
    'Popover.Content': Popover.Content,
    'Popover.Anchor': Popover.Anchor,
  } as Meta<PopoverPlaygroundArgs>['subcomponents'],
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs', 'new'],
  argTypes: {
    side: {
      control: 'select',
      options: ['top', 'right', 'bottom', 'left'],
      description:
        'Lado do trigger onde o popover abre — prop de `Popover.Content`.',
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
        'Alinhamento em relação ao trigger — prop de `Popover.Content`.',
      table: {
        category: 'Aparência',
        type: { summary: "'start' | 'center' | 'end'" },
        defaultValue: { summary: "'center'" },
      },
    },
    sideOffset: {
      control: 'number',
      description:
        'Distância (px) entre o popover e o trigger — prop de `Popover.Content`.',
      table: { category: 'Aparência', defaultValue: { summary: '4' } },
    },
    alignOffset: {
      control: 'number',
      description:
        'Deslocamento (px) ao longo do eixo de alinhamento — prop de `Popover.Content`.',
      table: { category: 'Aparência' },
    },
    showArrow: {
      control: 'boolean',
      description:
        'Exibe a seta apontando para o trigger — prop de `Popover.Content`.',
      table: { category: 'Aparência', defaultValue: { summary: 'false' } },
    },
    modal: {
      control: 'boolean',
      description:
        "Bloqueia interação com o restante da página enquanto aberto. Também aceita `'trap-focus'`.",
      table: { category: 'Comportamento', defaultValue: { summary: 'false' } },
    },
    open: {
      control: false,
      description: 'Abre/fecha o popover no modo controlado.',
      table: { category: 'Estado' },
    },
    defaultOpen: {
      control: false,
      description: 'Abre o popover na montagem, no modo não controlado.',
      table: { category: 'Estado' },
    },
    onOpenChange: {
      control: false,
      description:
        'Callback disparado quando o popover abre/fecha. Recebe `(open, eventDetails)`.',
      table: { category: 'Estado' },
    },
    children: {
      control: false,
      description:
        'Composição livre de `Popover.Trigger`, `Popover.Content` e `Popover.Anchor`.',
      table: { category: 'Conteúdo' },
    },
  },
  args: {
    side: 'bottom',
    align: 'center',
    sideOffset: 4,
    showArrow: false,
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  render: ({ side, align, sideOffset, alignOffset, showArrow, ...args }) => (
    <Popover {...args}>
      <Popover.Trigger asChild>
        <Button variant="outline">Open Popover</Button>
      </Popover.Trigger>
      <Popover.Content
        className="w-64"
        side={side}
        align={align}
        sideOffset={sideOffset}
        alignOffset={alignOffset}
        showArrow={showArrow}
        aria-label="Popover Title"
      >
        <div className="grid gap-2">
          <h4 className="font-medium">Popover Title</h4>
          <p className="text-sm text-muted-foreground">
            This is a basic popover with some content.
          </p>
        </div>
      </Popover.Content>
    </Popover>
  ),
  play: async ({ canvas, userEvent }) => {
    await userEvent.click(canvas.getByRole('button', { name: 'Open Popover' }));

    // O popover abre em portal no document.body.
    const body = within(document.body);
    const title = await body.findByText('Popover Title');
    await waitFor(() => expect(title).toBeVisible());
  },
};

export const WithForm: Story = {
  render: () => (
    <Popover>
      <Popover.Trigger asChild>
        <Button variant="outline">Edit</Button>
      </Popover.Trigger>
      <Popover.Content className="w-72" aria-label="Edit dimensions">
        <div className="grid gap-3">
          <div className="grid gap-1">
            <Label htmlFor="width">Width</Label>
            <Input id="width" defaultValue="100%" />
          </div>
          <div className="grid gap-1">
            <Label htmlFor="height">Height</Label>
            <Input id="height" defaultValue="25px" />
          </div>
          <Button variant="primary" size="sm" className="w-full mt-2">
            Apply
          </Button>
        </div>
      </Popover.Content>
    </Popover>
  ),
};

export const WithArrow: Story = {
  render: () => (
    <Popover>
      <Popover.Trigger asChild>
        <Button variant="ghost">With Arrow</Button>
      </Popover.Trigger>
      <Popover.Content className="w-48" showArrow aria-label="Arrow example">
        <p className="text-sm text-muted-foreground">
          This popover has an arrow pointing to the trigger.
        </p>
      </Popover.Content>
    </Popover>
  ),
};
