import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, within } from 'storybook/test';

import type { InputTimePickerProps } from './input-time-picker';
import { InputTimePicker } from './input-time-picker';

const meta: Meta<typeof InputTimePicker> = {
  title: 'UI/InputTimePicker',
  component: InputTimePicker,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    date: {
      control: 'date',
      description:
        'Data selecionada (controlada). Quando `undefined`, os dois selects começam vazios.',
      table: { category: 'Estado' },
    },
    setDate: {
      control: false,
      description:
        'Callback disparado com o novo `Date` (ou `undefined`) ao trocar hora ou minuto.',
      table: { category: 'Estado' },
    },
    disabled: {
      control: 'boolean',
      description: 'Desabilita os selects de hora e minuto.',
      table: {
        category: 'Estado',
        defaultValue: { summary: 'false' },
      },
    },
    hourPlaceholder: {
      control: 'text',
      description: 'Placeholder do select de horas quando vazio.',
      table: {
        category: 'Conteúdo',
        defaultValue: { summary: "'HH'" },
      },
    },
    minutePlaceholder: {
      control: 'text',
      description: 'Placeholder do select de minutos quando vazio.',
      table: {
        category: 'Conteúdo',
        defaultValue: { summary: "'MM'" },
      },
    },
    hourAriaLabel: {
      control: 'text',
      description: '`aria-label` do select de horas.',
      table: {
        category: 'Conteúdo',
        defaultValue: { summary: "'Hours'" },
      },
    },
    minuteAriaLabel: {
      control: 'text',
      description: '`aria-label` do select de minutos.',
      table: {
        category: 'Conteúdo',
        defaultValue: { summary: "'Minutes'" },
      },
    },
    className: {
      control: 'text',
      description: 'Classes extras aplicadas ao container.',
      table: { category: 'Aparência' },
    },
  },
  args: {
    date: new Date('2026-06-14T15:30:00'),
    setDate: fn(),
    disabled: false,
    className: 'w-40',
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

/**
 * Wrapper controlado: mantém o `Date` em estado local e repassa mudanças
 * para o spy `setDate` dos args (visível no painel Actions).
 */
const ControlledTimePicker = ({
  date,
  setDate,
  ...props
}: InputTimePickerProps) => {
  const timestamp = date ? new Date(date).getTime() : undefined;

  const [value, setValue] = React.useState<Date | undefined>(
    timestamp !== undefined ? new Date(timestamp) : undefined,
  );

  React.useEffect(() => {
    setValue(timestamp !== undefined ? new Date(timestamp) : undefined);
  }, [timestamp]);

  return (
    <InputTimePicker
      {...props}
      date={value}
      setDate={next => {
        setValue(next);
        setDate?.(next);
      }}
    />
  );
};

export const Playground: Story = {
  render: args => <ControlledTimePicker {...args} />,
  play: async ({ canvas, userEvent }) => {
    const hours = canvas.getByRole('combobox', { name: 'Hours' });
    await expect(hours).toHaveTextContent('15');

    await userEvent.click(hours);

    // As opções são renderizadas em um portal, fora do canvas.
    const option = await within(document.body).findByRole('option', {
      name: '09',
    });
    await userEvent.click(option);

    await expect(hours).toHaveTextContent('09');
  },
};

export const Empty: Story = {
  parameters: {
    // TODO(a11y): os placeholders 'HH'/'MM' do Select interno usam
    // text-muted-foreground e reprovam em color-contrast; a cor vem do
    // componente Select, não da story.
    a11y: { test: 'todo' },
  },
  args: {
    date: undefined,
  },
  render: args => <ControlledTimePicker {...args} />,
};

export const Disabled: Story = {
  args: {
    disabled: true,
  },
  render: args => <ControlledTimePicker {...args} />,
};
