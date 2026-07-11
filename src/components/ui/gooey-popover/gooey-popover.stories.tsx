import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';

import { MotionPopover } from './motion-popover';
import { Button } from '@/components/ui/button';

type MotionPopoverArgs = React.ComponentProps<typeof MotionPopover>;

const meta: Meta<MotionPopoverArgs> = {
  title: 'UI/MotionPopover',
  component: MotionPopover,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs', 'new'],
  argTypes: {
    trigger: {
      control: 'inline-radio',
      options: ['click', 'hover'],
      description: 'Como o popover é acionado.',
      table: {
        category: 'Comportamento',
        type: { summary: "'click' | 'hover'" },
        defaultValue: { summary: "'click'" },
      },
    },
    side: {
      control: 'inline-radio',
      options: ['top', 'bottom'],
      description: 'Lado do trigger de onde o painel "escorre".',
      table: {
        category: 'Aparência',
        type: { summary: "'top' | 'bottom'" },
        defaultValue: { summary: "'bottom'" },
      },
    },
    align: {
      control: 'inline-radio',
      options: ['start', 'center', 'end'],
      description: 'Alinhamento ao longo da borda do trigger.',
      table: {
        category: 'Aparência',
        type: { summary: "'start' | 'center' | 'end'" },
        defaultValue: { summary: "'center'" },
      },
    },
    sideOffset: {
      control: { type: 'range', min: 0, max: 40, step: 1 },
      description:
        'Distância entre trigger e painel (px) — o comprimento do "pescoço" gooey.',
      table: { category: 'Aparência', defaultValue: { summary: '14' } },
    },
    panelRadius: {
      control: { type: 'range', min: 0, max: 32, step: 1 },
      description: 'Raio dos cantos do painel aberto (px).',
      table: { category: 'Aparência', defaultValue: { summary: '16' } },
    },
    gooStrength: {
      control: { type: 'range', min: 0, max: 16, step: 1 },
      description:
        'Intensidade do blur que alimenta o filtro goo — maior derrete mais.',
      table: { category: 'Aparência', defaultValue: { summary: '8' } },
    },
    children: {
      control: false,
      description:
        'Composição de `MotionPopover.Trigger` e `MotionPopover.Content`.',
      table: { category: 'Conteúdo' },
    },
  },
  args: {
    trigger: 'click',
    side: 'bottom',
    align: 'center',
    sideOffset: 14,
    panelRadius: 16,
    gooStrength: 8,
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  render: args => (
    <MotionPopover {...args}>
      <MotionPopover.Trigger>
        <Button variant="outline">Open Popover</Button>
      </MotionPopover.Trigger>
      <MotionPopover.Content>
        <div className="grid gap-2">
          <h4 className="font-medium">Gooey Popover</h4>
          <p className="text-sm text-muted-foreground">
            O painel escorre do trigger com um efeito líquido — filtro goo +
            clip-path que interpola do trigger até o painel.
          </p>
        </div>
      </MotionPopover.Content>
    </MotionPopover>
  ),
};

export const OnHover: Story = {
  args: { trigger: 'hover' },
  render: args => (
    <MotionPopover {...args}>
      <MotionPopover.Trigger>
        <Button variant="outline">Hover me</Button>
      </MotionPopover.Trigger>
      <MotionPopover.Content>
        <p className="text-sm">Abre no hover/focus, fecha ao sair.</p>
      </MotionPopover.Content>
    </MotionPopover>
  ),
};

export const Above: Story = {
  args: { side: 'top' },
  render: args => (
    <MotionPopover {...args}>
      <MotionPopover.Trigger>
        <Button variant="outline">Opens upward</Button>
      </MotionPopover.Trigger>
      <MotionPopover.Content>
        <p className="text-sm">Escorre para cima a partir do trigger.</p>
      </MotionPopover.Content>
    </MotionPopover>
  ),
};
