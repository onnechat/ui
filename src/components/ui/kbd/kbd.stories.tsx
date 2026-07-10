import type { Meta, StoryObj } from '@storybook/react-vite';

import { Kbd } from './kbd';

const meta: Meta<typeof Kbd> = {
  title: 'UI/Kbd',
  component: Kbd,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    keys: {
      control: 'object',
      description:
        'Tecla ou combinação exibida. `string` para tecla única, `string[]` para teclas simultâneas e `string[][]` para sequências. Modificadores como `Mod` se adaptam ao sistema operacional (⌘ no macOS, Ctrl no Windows/Linux).',
      table: {
        category: 'Conteúdo',
        type: { summary: 'KbdKey | KbdKey[] | KbdKey[][]' },
      },
    },
    separator: {
      control: 'text',
      description: 'Separador entre teclas pressionadas simultaneamente.',
      table: {
        category: 'Conteúdo',
        defaultValue: { summary: "'+'" },
      },
    },
    thenSeparator: {
      control: 'text',
      description: 'Separador entre grupos de teclas de uma sequência.',
      table: {
        category: 'Conteúdo',
        defaultValue: { summary: "'then'" },
      },
    },
    className: {
      control: 'text',
      description: 'Classes extras aplicadas ao container.',
      table: { category: 'Aparência' },
    },
  },
  args: {
    keys: ['Mod', 'K'],
    separator: '+',
    thenSeparator: 'then',
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Single: Story = {
  args: {
    keys: 'Mod',
  },
};

export const Simultaneous: Story = {
  args: {
    keys: ['Mod', 'Enter'],
  },
};

export const Sequential: Story = {
  args: {
    keys: [['G'], ['D']],
  },
};

export const Mixed: Story = {
  args: {
    keys: [['Mod', 'G'], ['E']],
  },
};
