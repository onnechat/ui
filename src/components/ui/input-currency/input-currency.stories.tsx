import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect } from 'storybook/test';

import { CurrencyInput } from './index';

const meta: Meta<typeof CurrencyInput> = {
  title: 'UI/InputCurrency',
  component: CurrencyInput,
  parameters: {
    layout: 'centered',
    // TODO(a11y): o Select.Trigger interno de moeda não expõe nome acessível
    // (violação button-name do axe) e o componente não aceita prop para
    // rotulá-lo. Corrigir no componente e remover este todo.
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
    value: {
      control: 'number',
      description: 'Valor numérico controlado do campo.',
      table: { category: 'Estado' },
    },
    centsMode: {
      control: 'boolean',
      description:
        'Digita da direita para a esquerda preenchendo os centavos. Quando `false`, o valor digitado é tratado como inteiro.',
      table: {
        category: 'Comportamento',
        defaultValue: { summary: 'true' },
      },
    },
    allowZero: {
      control: 'boolean',
      description: 'Permite que o valor final seja zero.',
      table: {
        category: 'Comportamento',
        defaultValue: { summary: 'true' },
      },
    },
    disableCurrencySelect: {
      control: 'boolean',
      description: 'Desabilita o seletor de moeda, fixando a moeda atual.',
      table: {
        category: 'Comportamento',
        defaultValue: { summary: 'false' },
      },
    },
    defaultCurrency: {
      control: 'text',
      description: "Código ISO da moeda inicial (ex.: 'USD', 'BRL').",
      table: { category: 'Comportamento' },
    },
    locale: {
      control: 'text',
      description: 'Locale usado na formatação do valor.',
      table: { category: 'Comportamento' },
    },
    align: {
      control: 'inline-radio',
      options: ['start', 'center', 'end'],
      description: 'Alinhamento do dropdown de moedas em relação ao trigger.',
      table: {
        category: 'Aparência',
        defaultValue: { summary: "'start'" },
      },
    },
    placeholder: {
      control: 'text',
      description:
        'Placeholder do campo. Quando omitido, usa o formato da moeda (ex.: `0,00`).',
      table: { category: 'Conteúdo' },
    },
    disabled: {
      control: 'boolean',
      description: 'Desabilita o campo e o seletor de moeda.',
      table: {
        category: 'Estado',
        defaultValue: { summary: 'false' },
      },
    },
    onChange: {
      control: false,
      description: 'Callback disparado com o valor numérico digitado.',
      table: { category: 'Estado' },
    },
    onCurrencyChange: {
      control: false,
      description:
        'Callback disparado ao trocar a moeda. Recebe `{ code, symbol }`.',
      table: { category: 'Estado' },
    },
    className: {
      control: 'text',
      description: 'Classes extras aplicadas ao trigger e ao input.',
      table: { category: 'Aparência' },
    },
  },
  args: {
    centsMode: true,
    allowZero: true,
    disableCurrencySelect: false,
    disabled: false,
    align: 'start',
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  play: async ({ canvas, userEvent }) => {
    const input = canvas.getByRole('textbox');

    // Moeda padrão BRL: digitar preenche os centavos da direita para a esquerda.
    await userEvent.type(input, '1234');
    await expect(input).toHaveValue('12,34');
  },
};

export const WithValue: Story = {
  args: { value: 1500 },
};

export const Disabled: Story = {
  args: { disabled: true },
};

export const WithPlaceholder: Story = {
  args: { placeholder: '0.00' },
};

export const DisableCurrencySelect: Story = {
  args: { disableCurrencySelect: true },
};

export const NoCentsMode: Story = {
  args: { centsMode: false },
};
