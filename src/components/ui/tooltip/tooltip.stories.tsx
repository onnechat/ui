import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';

import { Tooltip } from './tooltip';
import { Button } from '@/components/ui/button';

type TooltipPlaygroundArgs = React.ComponentProps<typeof Tooltip> &
  Pick<
    React.ComponentProps<typeof Tooltip.Content>,
    'side' | 'align' | 'sideOffset' | 'className'
  >;

const meta: Meta<TooltipPlaygroundArgs> = {
  title: 'UI/Tooltip',
  component: Tooltip,
  subcomponents: {
    'Tooltip.Provider': Tooltip.Provider,
    'Tooltip.Trigger': Tooltip.Trigger,
    'Tooltip.Content': Tooltip.Content,
  } as Meta<TooltipPlaygroundArgs>['subcomponents'],
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    side: {
      control: 'select',
      options: ['top', 'right', 'bottom', 'left'],
      description:
        'Lado do trigger onde o tooltip abre — prop de `Tooltip.Content`.',
      table: {
        category: 'Aparência',
        type: { summary: "'top' | 'right' | 'bottom' | 'left'" },
        defaultValue: { summary: "'top'" },
      },
    },
    align: {
      control: 'inline-radio',
      options: ['start', 'center', 'end'],
      description:
        'Alinhamento em relação ao trigger — prop de `Tooltip.Content`.',
      table: {
        category: 'Aparência',
        type: { summary: "'start' | 'center' | 'end'" },
        defaultValue: { summary: "'center'" },
      },
    },
    sideOffset: {
      control: 'number',
      description:
        'Distância (px) entre o tooltip e o trigger — prop de `Tooltip.Content`.',
      table: { category: 'Aparência', defaultValue: { summary: '0' } },
    },
    className: {
      control: 'text',
      description:
        'Classes extras do `Tooltip.Content`. Classes `bg-*`/`text-*` recolorem o balão e a seta; `border*`/`shadow-*` viram `drop-shadow` para acompanhar a seta.',
      table: { category: 'Aparência' },
    },
    disabled: {
      control: 'boolean',
      description: 'Impede o tooltip de abrir.',
      table: { category: 'Comportamento', defaultValue: { summary: 'false' } },
    },
    open: {
      control: false,
      description: 'Abre/fecha o tooltip no modo controlado.',
      table: { category: 'Estado' },
    },
    defaultOpen: {
      control: false,
      description: 'Abre o tooltip na montagem, no modo não controlado.',
      table: { category: 'Estado' },
    },
    onOpenChange: {
      control: false,
      description:
        'Callback disparado quando o tooltip abre/fecha. Recebe `(open, eventDetails)`.',
      table: { category: 'Estado' },
    },
    children: {
      control: false,
      description: 'Composição de `Tooltip.Trigger` e `Tooltip.Content`.',
      table: { category: 'Conteúdo' },
    },
  },
  args: {
    side: 'top',
    align: 'center',
    sideOffset: 0,
    disabled: false,
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  render: ({ side, align, sideOffset, className, ...args }) => (
    <Tooltip {...args}>
      <Tooltip.Trigger asChild>
        <Button variant="outline">Hover me</Button>
      </Tooltip.Trigger>
      <Tooltip.Content
        side={side}
        align={align}
        sideOffset={sideOffset}
        className={className}
      >
        This is a tooltip
      </Tooltip.Content>
    </Tooltip>
  ),
};

export const Positions: Story = {
  render: () => (
    <div className="flex flex-wrap gap-2">
      <Tooltip>
        <Tooltip.Trigger asChild>
          <Button variant="outline" size="sm">
            Top
          </Button>
        </Tooltip.Trigger>
        <Tooltip.Content side="top">Tooltip on top</Tooltip.Content>
      </Tooltip>
      <Tooltip>
        <Tooltip.Trigger asChild>
          <Button variant="outline" size="sm">
            Bottom
          </Button>
        </Tooltip.Trigger>
        <Tooltip.Content side="bottom">Tooltip on bottom</Tooltip.Content>
      </Tooltip>
      <Tooltip>
        <Tooltip.Trigger asChild>
          <Button variant="outline" size="sm">
            Left
          </Button>
        </Tooltip.Trigger>
        <Tooltip.Content side="left">Tooltip on left</Tooltip.Content>
      </Tooltip>
      <Tooltip>
        <Tooltip.Trigger asChild>
          <Button variant="outline" size="sm">
            Right
          </Button>
        </Tooltip.Trigger>
        <Tooltip.Content side="right">Tooltip on right</Tooltip.Content>
      </Tooltip>
    </div>
  ),
};

export const Alignments: Story = {
  render: () => (
    <div className="flex flex-wrap gap-2">
      <Tooltip>
        <Tooltip.Trigger asChild>
          <Button variant="outline" size="sm">
            Start
          </Button>
        </Tooltip.Trigger>
        <Tooltip.Content side="bottom" align="start">
          Aligned start
        </Tooltip.Content>
      </Tooltip>
      <Tooltip>
        <Tooltip.Trigger asChild>
          <Button variant="outline" size="sm">
            Center
          </Button>
        </Tooltip.Trigger>
        <Tooltip.Content side="bottom" align="center">
          Aligned center
        </Tooltip.Content>
      </Tooltip>
      <Tooltip>
        <Tooltip.Trigger asChild>
          <Button variant="outline" size="sm">
            End
          </Button>
        </Tooltip.Trigger>
        <Tooltip.Content side="bottom" align="end">
          Aligned end
        </Tooltip.Content>
      </Tooltip>
    </div>
  ),
};

export const CustomColors: Story = {
  // TODO(a11y): o Button variant="destructive" (branco sobre --destructive)
  // tem contraste 3.8 < 4.5 — cor definida no tema/componente Button, não na story.
  parameters: { a11y: { test: 'todo' } },
  render: () => (
    <div className="flex flex-wrap gap-2">
      <Tooltip>
        <Tooltip.Trigger asChild>
          <Button variant="destructive" size="sm">
            Danger
          </Button>
        </Tooltip.Trigger>
        <Tooltip.Content className="bg-destructive text-destructive-foreground">
          This action is irreversible
        </Tooltip.Content>
      </Tooltip>
      <Tooltip>
        <Tooltip.Trigger asChild>
          <Button variant="outline" size="sm">
            Success
          </Button>
        </Tooltip.Trigger>
        <Tooltip.Content className="bg-success text-success-foreground">
          All checks passed
        </Tooltip.Content>
      </Tooltip>
      <Tooltip>
        <Tooltip.Trigger asChild>
          <Button variant="secondary" size="sm">
            Card
          </Button>
        </Tooltip.Trigger>
        <Tooltip.Content className="bg-popover text-popover-foreground border border-border shadow-md">
          Card-styled tooltip
        </Tooltip.Content>
      </Tooltip>
    </div>
  ),
};

export const LongContent: Story = {
  render: () => (
    <Tooltip>
      <Tooltip.Trigger asChild>
        <Button variant="outline">Info</Button>
      </Tooltip.Trigger>
      <Tooltip.Content className="max-w-64">
        This is a longer tooltip that demonstrates how content wraps when it
        exceeds reasonable width constraints.
      </Tooltip.Content>
    </Tooltip>
  ),
};

export const RichContent: Story = {
  render: () => (
    <Tooltip>
      <Tooltip.Trigger asChild>
        <Button variant="secondary" size="sm">
          ?
        </Button>
      </Tooltip.Trigger>
      <Tooltip.Content className="flex flex-col gap-1 max-w-48">
        <span className="font-semibold">Keyboard shortcut</span>
        <span className="text-xs opacity-80">
          Press Cmd+K to open the command palette.
        </span>
      </Tooltip.Content>
    </Tooltip>
  ),
};

export const DisabledTrigger: Story = {
  render: () => (
    <Tooltip>
      <Tooltip.Trigger asChild>
        <span className="inline-block cursor-default" tabIndex={0}>
          <Button disabled>Disabled button</Button>
        </span>
      </Tooltip.Trigger>
      <Tooltip.Content>Complete the form above to enable</Tooltip.Content>
    </Tooltip>
  ),
};
