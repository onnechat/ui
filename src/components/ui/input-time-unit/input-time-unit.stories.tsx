import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, within } from 'storybook/test';

import { InputTimeUnit } from './input-time-unit';

const meta: Meta<typeof InputTimeUnit> = {
  title: 'UI/InputTimeUnit',
  component: InputTimeUnit,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  decorators: [
    Story => (
      <div className="w-64">
        <Story />
      </div>
    ),
  ],
  argTypes: {
    value: {
      control: 'number',
      description:
        'Valor controlado em **minutos**. O número exibido é convertido conforme a unidade selecionada.',
      table: { category: 'Estado' },
    },
    defaultUnit: {
      control: 'select',
      options: [
        'seconds',
        'minutes',
        'hours',
        'days',
        'weeks',
        'months',
        'years',
      ],
      description:
        'Unidade selecionada por padrão, enquanto o usuário não escolher outra.',
      table: {
        category: 'Comportamento',
        defaultValue: { summary: "'minutes'" },
      },
    },
    disableUnitSelect: {
      control: 'boolean',
      description:
        'Desabilita o seletor de unidade — apenas o campo numérico fica editável.',
      table: {
        category: 'Comportamento',
        defaultValue: { summary: 'false' },
      },
    },
    allowedUnits: {
      control: false,
      description:
        "Restringe as unidades do dropdown. Array de `TimeUnit` (ex.: `['hours', 'days']`); vazio ou omitido exibe todas.",
      table: { category: 'Comportamento' },
    },
    labels: {
      control: false,
      description:
        "Sobrescreve os rótulos por unidade. Objeto parcial `{ [unit]: { short, label } }` mesclado com os padrões em inglês (ex.: `{ hours: { short: 'hrs', label: 'Horas' } }`).",
      table: { category: 'Conteúdo' },
    },
    onChange: {
      control: false,
      description:
        'Callback disparado com o total em **minutos** (`number`), ou `undefined` quando o campo está vazio/inválido.',
      table: { category: 'Estado' },
    },
    onUnitChange: {
      control: false,
      description: 'Callback disparado quando o usuário troca a unidade.',
      table: { category: 'Estado' },
    },
    align: {
      control: 'inline-radio',
      options: ['start', 'center', 'end'],
      description: 'Alinhamento do dropdown de unidades em relação ao trigger.',
      table: {
        category: 'Aparência',
        defaultValue: { summary: "'start'" },
      },
    },
    unitSelectAriaLabel: {
      control: 'text',
      description:
        'Nome acessível (`aria-label`) do seletor de unidade embutido, que exibe apenas a abreviação da unidade.',
      table: {
        category: 'Acessibilidade',
        defaultValue: { summary: "'Time unit'" },
      },
    },
    placeholder: {
      control: 'text',
      description: 'Placeholder do campo numérico.',
      table: { category: 'Conteúdo' },
    },
    disabled: {
      control: 'boolean',
      description: 'Desabilita o campo e o seletor de unidade.',
      table: {
        category: 'Estado',
        defaultValue: { summary: 'false' },
      },
    },
    className: {
      control: 'text',
      description: 'Classes extras aplicadas ao input numérico.',
      table: { category: 'Aparência' },
    },
    containerClassName: {
      control: 'text',
      description: 'Classes extras aplicadas ao wrapper externo.',
      table: { category: 'Aparência' },
    },
  },
  args: {
    placeholder: 'Enter duration',
    defaultUnit: 'minutes',
    disableUnitSelect: false,
    disabled: false,
    align: 'start',
    onChange: fn(),
    onUnitChange: fn(),
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  play: async ({ args, canvas, userEvent }) => {
    const input = canvas.getByPlaceholderText('Enter duration');

    // Com a unidade padrão (minutos), o valor emitido é o próprio número.
    await userEvent.type(input, '90');
    await expect(input).toHaveValue('90');
    await expect(args.onChange).toHaveBeenCalledWith(90);
  },
};

export const WithValue: Story = {
  args: {
    value: 120,
    placeholder: 'Duration',
  },
};

export const RestrictedUnits: Story = {
  args: {
    allowedUnits: ['hours', 'days'],
    defaultUnit: 'hours',
    placeholder: 'Duration',
  },
};

export const DisabledUnitSelect: Story = {
  args: {
    disableUnitSelect: true,
    defaultUnit: 'minutes',
    placeholder: 'Duration (minutes only)',
  },
};

export const Controlled: Story = {
  render: () => {
    const [value, setValue] = useState<number | undefined>(undefined);

    return (
      <div className="flex flex-col gap-2">
        <InputTimeUnit
          value={value}
          onChange={setValue}
          placeholder="Pick a duration"
        />
        <span className="text-xs text-muted-foreground">
          Minutes: {value ?? '—'}
        </span>
      </div>
    );
  },
};

export const PickUnit: Story = {
  render: () => {
    const [value, setValue] = useState<number | undefined>(30);

    return (
      <InputTimeUnit
        value={value}
        onChange={setValue}
        defaultUnit="hours"
        placeholder="Duration"
      />
    );
  },
  play: async ({ canvas, userEvent }) => {
    const trigger = canvas.getByRole('combobox');
    await userEvent.click(trigger);

    // As opções são renderizadas em um portal, fora do canvas.
    const daysOption = await within(document.body).findByText('Days');
    await userEvent.click(daysOption);

    await expect(trigger).toHaveTextContent('d');
  },
};
