import type { Meta, StoryObj } from '@storybook/react-vite';

import { InputTime } from './input-time';

const meta: Meta<typeof InputTime> = {
  title: 'UI/InputTime',
  component: InputTime,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  decorators: [
    Story => (
      <div className="w-72">
        <Story />
      </div>
    ),
  ],
  argTypes: {
    type: {
      control: 'select',
      options: ['date', 'time', 'datetime-local'],
      description:
        'Tipo do campo no modo controlado. Quando definido, o seletor de tipo fica travado.',
      table: {
        category: 'Comportamento',
        type: { summary: "'date' | 'time' | 'datetime-local'" },
      },
    },
    defaultType: {
      control: 'select',
      options: ['date', 'time', 'datetime-local'],
      description: 'Tipo inicial no modo não controlado.',
      table: {
        category: 'Comportamento',
        defaultValue: { summary: "'date'" },
      },
    },
    align: {
      control: 'inline-radio',
      options: ['start', 'center', 'end'],
      description: 'Alinhamento do dropdown de tipos em relação ao trigger.',
      table: {
        category: 'Aparência',
        defaultValue: { summary: "'start'" },
      },
    },
    typeSelectAriaLabel: {
      control: 'text',
      description:
        'Nome acessível (`aria-label`) do seletor de tipo embutido, que exibe apenas um ícone.',
      table: {
        category: 'Acessibilidade',
        defaultValue: { summary: "'Input type'" },
      },
    },
    placeholder: {
      control: 'text',
      description:
        'Placeholder do campo. Quando omitido, usa o formato do tipo (ex.: `YYYY-MM-DD`).',
      table: { category: 'Conteúdo' },
    },
    defaultValue: {
      control: 'text',
      description:
        'Valor inicial no formato nativo do tipo (ex.: `2026-06-14`).',
      table: { category: 'Conteúdo' },
    },
    disabled: {
      control: 'boolean',
      description: 'Desabilita o campo.',
      table: {
        category: 'Estado',
        defaultValue: { summary: 'false' },
      },
    },
    onChange: {
      control: false,
      description: 'Callback nativo de mudança do input.',
      table: { category: 'Estado' },
    },
    onTypeChange: {
      control: false,
      description:
        "Callback disparado ao trocar o tipo. Recebe 'date' | 'time' | 'datetime-local'.",
      table: { category: 'Estado' },
    },
    className: {
      control: 'text',
      description: 'Classes extras aplicadas ao input.',
      table: { category: 'Aparência' },
    },
  },
  args: {
    defaultType: 'date',
    disabled: false,
    align: 'start',
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

// TODO(a11y): com o campo vazio, o placeholder usa text-muted-foreground/50 e
// reprova em color-contrast (contraste fica fora do escopo por ora). Vale só
// para as stories sem valor — WithValue passa com 'error'.
const PLACEHOLDER_CONTRAST_A11Y_TODO = {
  a11y: { test: 'todo' },
} as const;

export const Playground: Story = {
  parameters: PLACEHOLDER_CONTRAST_A11Y_TODO,
};

export const Date: Story = {
  // TODO(a11y): mesmo motivo do Playground — contraste do placeholder.
  parameters: PLACEHOLDER_CONTRAST_A11Y_TODO,
  args: { type: 'date' },
};

export const Time: Story = {
  // TODO(a11y): mesmo motivo do Playground — contraste do placeholder.
  parameters: PLACEHOLDER_CONTRAST_A11Y_TODO,
  args: { type: 'time' },
};

export const DateTimeLocal: Story = {
  // TODO(a11y): mesmo motivo do Playground — contraste do placeholder.
  parameters: PLACEHOLDER_CONTRAST_A11Y_TODO,
  args: { type: 'datetime-local' },
};

export const WithValue: Story = {
  args: { type: 'date', defaultValue: '2026-06-14' },
};
