import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn } from 'storybook/test';

import { PhoneInput } from './index';

const meta: Meta<typeof PhoneInput> = {
  title: 'UI/InputPhone',
  component: PhoneInput,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  decorators: [
    Story => (
      <div className="w-80">
        <Story />
      </div>
    ),
  ],
  argTypes: {
    value: {
      control: 'text',
      description:
        'Telefone controlado em formato internacional (ex.: `+5511999999999`). Define também o país inicial.',
      table: { category: 'Estado' },
    },
    disableCountrySelect: {
      control: 'boolean',
      description: 'Desabilita o seletor de país, fixando o país atual.',
      table: {
        category: 'Comportamento',
        defaultValue: { summary: 'false' },
      },
    },
    locale: {
      control: 'text',
      description: 'Locale usado para exibir os nomes dos países.',
      table: { category: 'Comportamento' },
    },
    align: {
      control: 'inline-radio',
      options: ['start', 'center', 'end'],
      description: 'Alinhamento do dropdown de países em relação ao trigger.',
      table: {
        category: 'Aparência',
        defaultValue: { summary: "'start'" },
      },
    },
    placeholder: {
      control: 'text',
      description:
        'Placeholder do campo. Quando omitido, usa a máscara do país selecionado.',
      table: { category: 'Conteúdo' },
    },
    countrySelectAriaLabel: {
      control: 'text',
      description: '`aria-label` do seletor de país embutido.',
      table: {
        category: 'Conteúdo',
        defaultValue: { summary: "'Country'" },
      },
    },
    disabled: {
      control: 'boolean',
      description: 'Desabilita o campo e o seletor de país.',
      table: {
        category: 'Estado',
        defaultValue: { summary: 'false' },
      },
    },
    onChange: {
      control: false,
      description: 'Callback disparado com o telefone digitado (string).',
      table: { category: 'Estado' },
    },
    onCountryChange: {
      control: false,
      description:
        'Callback disparado ao trocar o país. Recebe `{ code, name, flag, dialCode }`.',
      table: { category: 'Estado' },
    },
    className: {
      control: 'text',
      description: 'Classes extras aplicadas ao trigger e ao input.',
      table: { category: 'Aparência' },
    },
  },
  args: {
    disableCountrySelect: false,
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

    // País padrão BR: a máscara (##) #####-#### é aplicada ao digitar.
    await userEvent.type(input, '11987654321');
    await expect(input).toHaveValue('(11) 98765-4321');

    // onChange recebe o telefone em formato internacional a cada tecla.
    await expect(args.onChange).toHaveBeenCalledTimes(11);
    await expect(args.onChange).toHaveBeenLastCalledWith('+5511987654321');
  },
};

export const WithValue: Story = {
  args: { value: '+5511999999999' },
  play: async ({ canvas }) => {
    // O valor controlado define o país (BR) e é exibido com a máscara aplicada.
    await expect(canvas.getByRole('textbox')).toHaveValue('(11) 99999-9999');
  },
};

export const Disabled: Story = {
  args: { disabled: true },
};

export const DisableCountrySelect: Story = {
  args: { disableCountrySelect: true },
};
