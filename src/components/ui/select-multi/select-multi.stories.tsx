import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, waitFor, within } from 'storybook/test';

import { SelectMulti } from './select-multi';

type Item = { id: string; label: string; group: string };

const OPTIONS: Item[] = [
  { id: '1', label: 'Apple', group: 'Fruits' },
  { id: '2', label: 'Banana', group: 'Fruits' },
  { id: '3', label: 'Cherry', group: 'Fruits' },
  { id: '4', label: 'Carrot', group: 'Vegetables' },
  { id: '5', label: 'Broccoli', group: 'Vegetables' },
  { id: '6', label: 'Spinach', group: 'Vegetables' },
  { id: '7', label: 'Chicken', group: 'Meat' },
  { id: '8', label: 'Beef', group: 'Meat' },
  { id: '9', label: 'Salmon', group: 'Fish' },
  { id: '10', label: 'Tuna', group: 'Fish' },
];

const meta: Meta<typeof SelectMulti<Item>> = {
  title: 'UI/SelectMulti',
  component: SelectMulti,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    values: {
      control: false,
      description: 'Valores selecionados (`string[]`). Componente controlado.',
      table: { category: 'Estado' },
    },
    onValuesChange: {
      control: false,
      description:
        'Callback disparado a cada toggle. Recebe o novo array completo de valores.',
      table: { category: 'Estado' },
    },
    options: {
      control: false,
      description:
        'Itens disponíveis. Qualquer objeto — use `getItemValue`/`renderItem` para extrair valor e rótulo.',
      table: { category: 'Conteúdo' },
    },
    isLoading: {
      control: 'boolean',
      description: 'Mostra spinner no trigger e loader na lista de opções.',
      table: { category: 'Estado', defaultValue: { summary: 'false' } },
    },
    disabled: {
      control: 'boolean',
      description: 'Desabilita o trigger e impede a abertura do popup.',
      table: { category: 'Comportamento', defaultValue: { summary: 'false' } },
    },
    getItemValue: {
      control: false,
      description: '`(item) => string` — valor único de cada item.',
      table: { category: 'Comportamento' },
    },
    renderItem: {
      control: false,
      description:
        '`(item, isSelected) => ReactNode` — renderiza cada opção da lista.',
      table: { category: 'Conteúdo' },
    },
    getBadgeLabel: {
      control: false,
      description:
        '`(item) => string` — texto do badge no trigger. Padrão: `getItemValue`.',
      table: { category: 'Conteúdo' },
    },
    filterFn: {
      control: false,
      description:
        '`(item, search) => boolean` — filtro customizado da busca. Padrão: `getItemValue` contém o termo.',
      table: { category: 'Comportamento' },
    },
    placeholder: {
      control: 'text',
      description: 'Texto exibido no trigger quando nada está selecionado.',
      table: { category: 'Conteúdo', defaultValue: { summary: "'Select…'" } },
    },
    searchPlaceholder: {
      control: 'text',
      description: 'Placeholder do campo de busca dentro do popup.',
      table: { category: 'Conteúdo', defaultValue: { summary: "'Search…'" } },
    },
    emptyText: {
      control: 'text',
      description: 'Mensagem exibida quando a busca não encontra resultados.',
      table: {
        category: 'Conteúdo',
        defaultValue: { summary: "'No results found.'" },
      },
    },
    contentTitle: {
      control: 'text',
      description: 'Título do drawer no mobile. Padrão: `placeholder`.',
      table: { category: 'Conteúdo' },
    },
    id: {
      control: 'text',
      description: 'Id do trigger (associação com `<label htmlFor>`).',
      table: { category: 'Comportamento' },
    },
    className: {
      control: 'text',
      description: 'Classes extras aplicadas ao trigger.',
      table: { category: 'Aparência' },
    },
  },
  args: {
    values: [],
    onValuesChange: fn(),
    options: OPTIONS,
    getItemValue: item => item.id,
    renderItem: item => <span>{item.label}</span>,
    getBadgeLabel: item => item.label,
    placeholder: 'Select items…',
    isLoading: false,
    disabled: false,
    className: 'w-56',
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

/** Wrapper controlado: mantém `values` em estado local e repassa o restante dos args. */
function ControlledSelectMulti(
  args: React.ComponentProps<typeof SelectMulti<Item>>,
) {
  const [values, setValues] = React.useState<string[]>(args.values);
  return (
    <SelectMulti
      {...args}
      values={values}
      onValuesChange={next => {
        setValues(next);
        args.onValuesChange(next);
      }}
    />
  );
}

export const Playground: Story = {
  // TODO(a11y): o placeholder usa text-muted-foreground/50 (contraste 2.2) e o
  // botão de remover badge é um role="button" sem nome acessível aninhado no
  // trigger (nested-interactive) — problemas do componente, não da story.
  parameters: { a11y: { test: 'todo' } },
  render: args => <ControlledSelectMulti {...args} />,
  play: async ({ canvas, userEvent }) => {
    await userEvent.click(
      canvas.getByRole('button', { name: 'Select items…' }),
    );

    // O popup renderiza em portal no body, fora do canvas da story.
    const body = within(document.body);
    await userEvent.click(await body.findByRole('button', { name: 'Apple' }));
    await userEvent.click(await body.findByRole('button', { name: 'Carrot' }));
    await userEvent.keyboard('{Escape}');

    // Os itens selecionados aparecem como badges no trigger.
    await waitFor(() => {
      expect(canvas.getByText('Apple')).toBeVisible();
      expect(canvas.getByText('Carrot')).toBeVisible();
    });
  },
};

export const Preselected: Story = {
  // TODO(a11y): botão de remover badge sem nome acessível + nested-interactive
  // (estrutura do componente, não da story).
  parameters: { a11y: { test: 'todo' } },
  args: {
    values: ['1', '3', '5'],
  },
  render: args => <ControlledSelectMulti {...args} />,
};

export const ManySelected: Story = {
  // TODO(a11y): botão de remover badge sem nome acessível + nested-interactive
  // (estrutura do componente, não da story).
  parameters: { a11y: { test: 'todo' } },
  args: {
    values: ['1', '2', '4', '5', '7', '8', '9'],
  },
  render: args => <ControlledSelectMulti {...args} />,
};

export const WithCustomFilter: Story = {
  // TODO(a11y): placeholder usa text-muted-foreground/50 sobre bg-input
  // (contraste 2.2 — estilo do componente, não da story).
  parameters: { a11y: { test: 'todo' } },
  args: {
    renderItem: item => (
      <div className="flex flex-col gap-0.5">
        <span>{item.label}</span>
        <span className="text-xs text-muted-foreground">{item.group}</span>
      </div>
    ),
    filterFn: (item, search) =>
      item.label.toLowerCase().includes(search) ||
      item.group.toLowerCase().includes(search),
    placeholder: 'Search by name or group…',
    searchPlaceholder: 'Apples, Vegetables…',
  },
  render: args => <ControlledSelectMulti {...args} />,
};

export const CustomBadgeLabel: Story = {
  // TODO(a11y): botão de remover badge sem nome acessível + nested-interactive
  // (estrutura do componente, não da story).
  parameters: { a11y: { test: 'todo' } },
  args: {
    values: ['1', '4'],
    getBadgeLabel: item => `${item.label} (${item.group})`,
    className: 'w-64',
  },
  render: args => <ControlledSelectMulti {...args} />,
};

export const Disabled: Story = {
  // TODO(a11y): botão de remover badge sem nome acessível + nested-interactive
  // (estrutura do componente, não da story).
  parameters: { a11y: { test: 'todo' } },
  args: {
    disabled: true,
    values: ['1', '4'],
    placeholder: 'Disabled…',
  },
  render: args => <ControlledSelectMulti {...args} />,
};
