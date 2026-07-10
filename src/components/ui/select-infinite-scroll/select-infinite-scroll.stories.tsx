import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { expect, fn, waitFor, within } from 'storybook/test';

import { SelectInfiniteScroll } from './select-infinite-scroll';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      staleTime: Infinity,
    },
  },
});

type Item = { id: string; label: string; category: string };

const ITEMS: Item[] = [
  { id: '1', label: 'Apple', category: 'Fruit' },
  { id: '2', label: 'Banana', category: 'Fruit' },
  { id: '3', label: 'Cherry', category: 'Fruit' },
  { id: '4', label: 'Carrot', category: 'Vegetable' },
  { id: '5', label: 'Broccoli', category: 'Vegetable' },
  { id: '6', label: 'Spinach', category: 'Vegetable' },
  { id: '7', label: 'Chicken', category: 'Meat' },
  { id: '8', label: 'Beef', category: 'Meat' },
  { id: '9', label: 'Salmon', category: 'Fish' },
  { id: '10', label: 'Tuna', category: 'Fish' },
];

const queryFn = async ({ search }: { search: string }) => {
  await new Promise(r => setTimeout(r, 500));
  if (!search) return ITEMS;
  const q = search.toLowerCase();
  return ITEMS.filter(i => i.label.toLowerCase().includes(q));
};

const meta: Meta<typeof SelectInfiniteScroll<Item>> = {
  title: 'UI/SelectInfiniteScroll',
  component: SelectInfiniteScroll,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  decorators: [
    Story => (
      <QueryClientProvider client={queryClient}>
        <Story />
      </QueryClientProvider>
    ),
  ],
  argTypes: {
    value: {
      control: false,
      description: 'Valor selecionado (`string`). Componente controlado.',
      table: { category: 'Estado' },
    },
    onValueChange: {
      control: false,
      description:
        'Callback disparado ao selecionar um item. Recebe o novo valor.',
      table: { category: 'Estado' },
    },
    onSelectedItemChange: {
      control: false,
      description:
        'Callback disparado quando o item resolvido muda. Recebe `item | null`.',
      table: { category: 'Estado' },
    },
    search: {
      control: 'boolean',
      description: 'Exibe campo de busca no popup (com debounce de 300ms).',
      table: { category: 'Comportamento', defaultValue: { summary: 'false' } },
    },
    disabled: {
      control: 'boolean',
      description: 'Desabilita o trigger e impede a abertura do popup.',
      table: { category: 'Comportamento', defaultValue: { summary: 'false' } },
    },
    enabled: {
      control: 'boolean',
      description: 'Habilita a execução da query.',
      table: { category: 'Comportamento', defaultValue: { summary: 'true' } },
    },
    queryKey: {
      control: false,
      description: 'Chave da query infinita (array de strings).',
      table: { category: 'Comportamento' },
    },
    queryFn: {
      control: false,
      description:
        '`({ pageParam, search }) => Promise<T[]>` — busca uma página de itens.',
      table: { category: 'Comportamento' },
    },
    options: {
      control: false,
      description: 'Opções extras repassadas ao `useInfiniteCustomQuery`.',
      table: { category: 'Comportamento' },
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
    renderSelectedValue: {
      control: false,
      description:
        '`(item) => ReactNode` — renderiza o item selecionado no trigger. Padrão: `getItemValue`.',
      table: { category: 'Conteúdo' },
    },
    placeholder: {
      control: 'text',
      description: 'Texto exibido no trigger quando nada está selecionado.',
      table: { category: 'Conteúdo' },
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
    value: '',
    onValueChange: fn(),
    queryFn,
    getItemValue: item => item.id,
    renderItem: item => <span>{item.label}</span>,
    renderSelectedValue: item => item.label,
    placeholder: 'Select an item…',
    search: false,
    disabled: false,
    enabled: true,
    className: 'w-56',
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

/** Wrapper controlado: mantém `value` em estado local e repassa o restante dos args. */
function ControlledSelect(
  args: React.ComponentProps<typeof SelectInfiniteScroll<Item>>,
) {
  const [value, setValue] = React.useState(args.value);
  return (
    <SelectInfiniteScroll
      {...args}
      value={value}
      onValueChange={next => {
        setValue(next);
        args.onValueChange(next);
      }}
    />
  );
}

export const Playground: Story = {
  args: {
    queryKey: ['playground-demo'],
  },
  render: args => <ControlledSelect {...args} />,
  play: async ({ canvas, userEvent }) => {
    const trigger = canvas.getByRole('button', { name: 'Select an item…' });
    await userEvent.click(trigger);

    // O popup renderiza em portal no body; os itens chegam após o fetch fake.
    const body = within(document.body);
    const option = await body.findByRole(
      'button',
      { name: 'Apple' },
      { timeout: 3000 },
    );
    await userEvent.click(option);

    await waitFor(() => expect(trigger).toHaveTextContent('Apple'));

    // Aguarda a animação de saída do popup terminar (o Base UI mantém o
    // role="dialog" e os focus guards no DOM até o fim da transição).
    await waitFor(() =>
      expect(body.queryByRole('dialog')).not.toBeInTheDocument(),
    );
  },
};

export const WithSearch: Story = {
  // TODO(a11y): placeholder usa text-muted-foreground/50 sobre bg-input
  // (contraste 2.2 — estilo do componente, não da story).
  parameters: { a11y: { test: 'todo' } },
  args: {
    search: true,
    queryKey: ['search-demo'],
    placeholder: 'Search and select…',
    searchPlaceholder: 'Type to filter…',
  },
  render: args => <ControlledSelect {...args} />,
};

export const Preselected: Story = {
  // TODO(a11y): enquanto o fetch inicial não resolve, o trigger mostra o
  // placeholder text-muted-foreground/50 (contraste 2.2 — componente).
  parameters: { a11y: { test: 'todo' } },
  args: {
    value: '3',
    queryKey: ['preselected-demo'],
  },
  render: args => <ControlledSelect {...args} />,
};

export const CustomItemRender: Story = {
  // TODO(a11y): placeholder usa text-muted-foreground/50 sobre bg-input
  // (contraste 2.2 — estilo do componente, não da story).
  parameters: { a11y: { test: 'todo' } },
  args: {
    queryKey: ['render-demo'],
    renderItem: (item, isSelected) => (
      <div className="flex flex-col gap-0.5">
        <span className={isSelected ? 'font-semibold' : ''}>{item.label}</span>
        <span className="text-xs text-muted-foreground">{item.category}</span>
      </div>
    ),
  },
  render: args => <ControlledSelect {...args} />,
};

export const Disabled: Story = {
  args: {
    disabled: true,
    value: '1',
    queryKey: ['disabled-demo'],
    placeholder: 'Disabled…',
  },
  render: args => <ControlledSelect {...args} />,
};
