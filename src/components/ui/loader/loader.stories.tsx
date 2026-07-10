import type { Meta, StoryObj } from '@storybook/react-vite';

import { Loader } from './loader';

const meta: Meta<typeof Loader> = {
  title: 'UI/Loader',
  component: Loader,
  parameters: {
    layout: 'centered',
  },
  tags: ['ai-generated'],
  argTypes: {
    text: {
      control: 'text',
      description: 'Texto opcional exibido junto ao spinner.',
      table: { category: 'Conteúdo' },
    },
    variant: {
      control: 'select',
      options: ['default', 'screen', 'center', 'button', 'clean'],
      description:
        'Layout do loader: inline (default), tela cheia (screen), centralizado (center), compacto para botões (button) ou com padding (clean).',
      table: {
        category: 'Aparência',
        type: {
          summary: "'default' | 'screen' | 'center' | 'button' | 'clean'",
        },
        defaultValue: { summary: "'default'" },
      },
    },
    className: {
      control: 'text',
      description: 'Classes extras aplicadas ao container.',
      table: { category: 'Aparência' },
    },
    iconClassName: {
      control: 'text',
      description: 'Classes extras aplicadas ao ícone giratório.',
      table: { category: 'Aparência' },
    },
  },
  args: {
    text: 'Loading...',
    variant: 'default',
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Clean: Story = {
  args: { variant: 'clean', text: 'Please wait...' },
};

export const Button: Story = {
  args: { variant: 'button', text: '' },
};
