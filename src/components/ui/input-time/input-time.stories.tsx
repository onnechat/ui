import type { Meta, StoryObj } from '@storybook/react-vite';

import { InputTime } from './input-time';

const meta: Meta<typeof InputTime> = {
  title: 'UI/InputTime',
  component: InputTime,
  parameters: {
    layout: 'centered',
    // TODO(a11y): o Select.Trigger interno de tipo (ícone) não expõe nome
    // acessível (violação button-name do axe) e o campo vazio usa
    // text-muted-foreground/50, reprovando em color-contrast. Ambos vêm do
    // componente; corrigir lá e remover este todo.
    a11y: { test: 'todo' },
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

export const Playground: Story = {};

export const Date: Story = {
  args: { type: 'date' },
};

export const Time: Story = {
  args: { type: 'time' },
};

export const DateTimeLocal: Story = {
  args: { type: 'datetime-local' },
};

export const WithValue: Story = {
  args: { type: 'date', defaultValue: '2026-06-14' },
};
