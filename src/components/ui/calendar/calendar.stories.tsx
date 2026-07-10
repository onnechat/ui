import type { ComponentProps } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, waitFor } from 'storybook/test';

import { Calendar } from './calendar';

type CalendarProps = ComponentProps<typeof Calendar>;

// As props do react-day-picker são uma união discriminada por `mode`, o que
// colapsa a inferência de args do Storybook para `never`. Usamos um tipo plano
// para os controls e fazemos cast no render.
type CalendarStoryArgs = {
  mode?: 'single' | 'multiple' | 'range';
  showOutsideDays?: boolean;
  numberOfMonths?: number;
  fixedWeeks?: boolean;
  selected?: Date | Date[] | { from: Date; to?: Date };
  onSelect?: (...args: unknown[]) => void;
  defaultMonth?: Date;
  disabled?: unknown;
  className?: string;
};

const meta: Meta<CalendarStoryArgs> = {
  title: 'UI/Calendar',
  component: Calendar as Meta<CalendarStoryArgs>['component'],
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    mode: {
      control: 'inline-radio',
      options: ['single', 'multiple', 'range'],
      description: 'Modo de seleção de datas.',
      table: {
        category: 'Comportamento',
        type: { summary: "'single' | 'multiple' | 'range'" },
      },
    },
    showOutsideDays: {
      control: 'boolean',
      description: 'Exibe os dias dos meses adjacentes nas bordas da grade.',
      table: { category: 'Aparência', defaultValue: { summary: 'true' } },
    },
    numberOfMonths: {
      control: { type: 'number', min: 1, max: 4 },
      description: 'Quantidade de meses exibidos lado a lado.',
      table: { category: 'Aparência', defaultValue: { summary: '1' } },
    },
    fixedWeeks: {
      control: 'boolean',
      description: 'Sempre renderiza 6 semanas, evitando mudança de altura.',
      table: { category: 'Aparência', defaultValue: { summary: 'false' } },
    },
    selected: {
      control: false,
      description:
        'Data(s) selecionada(s) no modo controlado. `Date`, `Date[]` ou `{ from, to }` conforme o `mode`.',
      table: { category: 'Estado' },
    },
    onSelect: {
      control: false,
      description: 'Callback disparado quando a seleção muda.',
      table: { category: 'Estado' },
    },
    defaultMonth: {
      control: false,
      description: 'Mês exibido inicialmente (`Date`).',
      table: { category: 'Estado' },
    },
    disabled: {
      control: false,
      description:
        'Datas desabilitadas. Aceita `Date`, array, `{ before, after }` ou função matcher.',
      table: { category: 'Comportamento' },
    },
    className: {
      control: 'text',
      description: 'Classes extras aplicadas ao container raiz.',
      table: { category: 'Aparência' },
    },
  },
  args: {
    mode: 'single',
    showOutsideDays: true,
    numberOfMonths: 1,
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  // TODO(a11y): os cabeçalhos de dia da semana usam text-muted-foreground/80
  // sobre bg-card (contraste 4.0 < 4.5 — estilo do componente, não da story).
  parameters: { a11y: { test: 'todo' } },
  args: {
    defaultMonth: new Date(2024, 5),
  },
  render: args => <Calendar {...(args as CalendarProps)} />,
  play: async ({ canvas, userEvent }) => {
    // O aria-label do botão do dia é a data completa ("Saturday, June 15th, 2024").
    const day = canvas.getByRole('button', { name: /June 15th/ });
    await userEvent.click(day);

    await waitFor(() =>
      expect(day.closest('[role="gridcell"]')).toHaveAttribute(
        'aria-selected',
        'true',
      ),
    );
  },
};

export const WithSelected: Story = {
  // TODO(a11y): contraste dos cabeçalhos de dia da semana (componente).
  parameters: { a11y: { test: 'todo' } },
  args: {
    selected: new Date(2024, 5, 15),
    defaultMonth: new Date(2024, 5),
  },
  render: args => <Calendar {...(args as CalendarProps)} />,
};

export const WithRange: Story = {
  // TODO(a11y): contraste dos cabeçalhos de dia da semana (componente).
  parameters: { a11y: { test: 'todo' } },
  args: {
    mode: 'range',
    selected: {
      from: new Date(2024, 5, 10),
      to: new Date(2024, 5, 20),
    },
    defaultMonth: new Date(2024, 5),
  },
  render: args => <Calendar {...(args as CalendarProps)} />,
};

export const MultipleMonths: Story = {
  // TODO(a11y): contraste dos cabeçalhos de dia da semana (componente).
  parameters: { a11y: { test: 'todo' } },
  args: {
    numberOfMonths: 2,
    defaultMonth: new Date(2024, 5),
  },
  render: args => <Calendar {...(args as CalendarProps)} />,
};

export const DisabledPast: Story = {
  // TODO(a11y): contraste dos cabeçalhos de dia da semana (componente).
  parameters: { a11y: { test: 'todo' } },
  render: args => {
    const today = new Date();
    return (
      <Calendar
        {...(args as CalendarProps)}
        disabled={{ before: today }}
        defaultMonth={today}
      />
    );
  },
};
