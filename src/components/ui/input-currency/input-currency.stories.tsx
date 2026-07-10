import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn } from 'storybook/test';

import { CurrencyInput } from './index';

const meta: Meta<typeof CurrencyInput> = {
  title: 'UI/InputCurrency',
  component: CurrencyInput,
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
    currencySelectAriaLabel: {
      control: 'text',
      description: '`aria-label` do seletor de moeda embutido.',
      table: {
        category: 'Conteúdo',
        defaultValue: { summary: "'Currency'" },
      },
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
  args: { onChange: fn() },
  play: async ({ args, canvas, userEvent }) => {
    const input = canvas.getByRole('textbox');

    // Moeda padrão BRL: digitar preenche os centavos da direita para a esquerda.
    await userEvent.type(input, '1234');
    await expect(input).toHaveValue('12,34');

    // onChange recebe o valor numérico em centavos a cada tecla.
    await expect(args.onChange).toHaveBeenCalledTimes(4);
    await expect(args.onChange).toHaveBeenLastCalledWith(1234);
  },
};

export const WithValue: Story = {
  args: { value: 1500 },
  play: async ({ canvas }) => {
    // O valor controlado (1500 centavos) é exibido formatado na moeda padrão.
    await expect(canvas.getByRole('textbox')).toHaveValue('15,00');
  },
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
