import type { Meta, StoryObj } from '@storybook/react-vite';

import { TextShimmer } from './shimmer-text';

const meta: Meta<typeof TextShimmer> = {
  title: 'UI/TextShimmer',
  component: TextShimmer,
  parameters: {
    layout: 'centered',
  },
  tags: ['ai-generated'],
  argTypes: {
    children: {
      control: 'text',
      description: 'Texto que recebe o efeito de brilho.',
      table: { category: 'Conteúdo' },
    },
    as: {
      control: 'text',
      description:
        "Tag ou componente usado na renderização (ex.: 'p', 'span', 'h2').",
      table: { category: 'Aparência', defaultValue: { summary: "'p'" } },
    },
    duration: {
      control: { type: 'range', min: 0.5, max: 10, step: 0.5 },
      description: 'Duração (s) de um ciclo da animação.',
      table: { category: 'Comportamento', defaultValue: { summary: '2' } },
    },
    spread: {
      control: { type: 'range', min: 1, max: 10, step: 1 },
      description:
        'Multiplicador da largura do brilho em relação ao comprimento do texto.',
      table: { category: 'Comportamento', defaultValue: { summary: '2' } },
    },
    className: {
      control: 'text',
      description: 'Classes extras aplicadas ao elemento.',
      table: { category: 'Aparência' },
    },
  },
  args: {
    children: 'This text shimmers with an animated gradient',
    duration: 2,
    spread: 2,
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const ShortText: Story = {
  args: { children: 'Shimmer' },
};

export const CustomDuration: Story = {
  args: { children: 'Slow shimmer effect', duration: 4, spread: 3 },
};
