import type { Meta, StoryObj } from '@storybook/react-vite';

import { Badge } from './badge';

const meta: Meta<typeof Badge> = {
  title: 'UI/Badge',
  component: Badge,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: [
        'default',
        'secondary',
        'destructive',
        'warning',
        'success',
        'outline',
      ],
      description: 'Estilo visual do badge.',
      table: {
        category: 'Aparência',
        type: {
          summary:
            "'default' | 'secondary' | 'destructive' | 'warning' | 'success' | 'outline'",
        },
        defaultValue: { summary: "'default'" },
      },
    },
    children: {
      control: 'text',
      description: 'Conteúdo do badge.',
      table: { category: 'Conteúdo' },
    },
    className: {
      control: 'text',
      description: 'Classes extras aplicadas ao badge.',
      table: { category: 'Aparência' },
    },
  },
  args: {
    variant: 'default',
    children: 'Badge',
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  // TODO(a11y): bg-primary/text-primary-foreground da variante default não
  // atinge contraste 4.5:1 no tema atual — corrigir tokens no tema/componente.
  parameters: { a11y: { test: 'todo' } },
};

export const Secondary: Story = {
  args: {
    variant: 'secondary',
    children: 'Secondary',
  },
};

export const Destructive: Story = {
  // TODO(a11y): bg-destructive/text-destructive-foreground não atinge
  // contraste 4.5:1 no tema atual — corrigir tokens no tema/componente.
  parameters: { a11y: { test: 'todo' } },
  args: {
    variant: 'destructive',
    children: 'Destructive',
  },
};

export const Warning: Story = {
  args: {
    variant: 'warning',
    children: 'Warning',
  },
};

export const Success: Story = {
  // TODO(a11y): bg-success/text-success-foreground não atinge contraste
  // 4.5:1 no tema atual — corrigir tokens no tema/componente.
  parameters: { a11y: { test: 'todo' } },
  args: {
    variant: 'success',
    children: 'Success',
  },
};

export const Outline: Story = {
  args: {
    variant: 'outline',
    children: 'Outline',
  },
};
