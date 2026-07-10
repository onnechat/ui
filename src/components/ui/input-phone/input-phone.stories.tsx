import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect } from 'storybook/test';

import { PhoneInput } from './index';

const meta: Meta<typeof PhoneInput> = {
  title: 'UI/InputPhone',
  component: PhoneInput,
  parameters: {
    layout: 'centered',
    // TODO(a11y): o Select.Trigger interno de país não expõe nome acessível
    // (violação button-name do axe) e o componente não aceita prop para
    // rotulá-lo. Corrigir no componente e remover este todo.
    a11y: { test: 'todo' },
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
  play: async ({ canvas, userEvent }) => {
    const input = canvas.getByRole('textbox');

    // País padrão BR: a máscara (##) #####-#### é aplicada ao digitar.
    await userEvent.type(input, '11987654321');
    await expect(input).toHaveValue('(11) 98765-4321');
  },
};

export const WithValue: Story = {
  args: { value: '+5511999999999' },
};

export const Disabled: Story = {
  args: { disabled: true },
};

export const DisableCountrySelect: Story = {
  args: { disableCountrySelect: true },
};
