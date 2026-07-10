import React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, waitFor } from 'storybook/test';

import { ColumnDef } from '@tanstack/react-table';

import { DataCustomTable } from './datatable';

type User = { id: number; name: string; email: string; role: string };

const NAMES = [
  'Alice',
  'Bob',
  'Charlie',
  'Diana',
  'Edward',
  'Fiona',
  'George',
  'Hannah',
  'Isaac',
  'James',
];

const ROLES = ['Admin', 'Editor', 'Viewer'] as const;

const DATA: User[] = Array.from(NAMES, (name, index) => ({
  id: index + 1,
  name,
  email: `${name.toLowerCase()}@email.com`,
  role: ROLES[index % ROLES.length],
}));

const COLUMNS: ColumnDef<User>[] = [
  { accessorKey: 'name', header: 'Name' },
  { accessorKey: 'email', header: 'Email' },
  { accessorKey: 'role', header: 'Role' },
];

const meta: Meta<typeof DataCustomTable<User>> = {
  title: 'UI/DataTable',
  component: DataCustomTable,
  parameters: {
    layout: 'padded',
    // TODO(a11y): o Select de "Rows per page" (DataTablePagination) não tem
    // rótulo acessível (violação button-name) e as linhas entram com animação
    // de opacidade que dispara falsos positivos de color-contrast durante o
    // fade. Ambos exigem correção nos componentes de table/ — como a paginação
    // aparece em todas as stories, o todo vale para o arquivo inteiro.
    a11y: { test: 'todo' },
  },
  tags: ['autodocs'],
  argTypes: {
    isLoading: {
      control: 'boolean',
      description: 'Exibe linhas de skeleton no lugar dos dados.',
      table: {
        category: 'Estado',
        defaultValue: { summary: 'true' },
      },
    },
    data: {
      control: false,
      description: 'Linhas da tabela: array de objetos `T`, um por linha.',
      table: { category: 'Conteúdo', type: { summary: 'T[]' } },
    },
    columns: {
      control: false,
      description:
        'Definições de coluna do TanStack Table: `{ accessorKey, header, cell?, enableSorting?, ... }`.',
      table: { category: 'Conteúdo', type: { summary: 'ColumnDef<T>[]' } },
    },
    totalItems: {
      control: 'number',
      description:
        'Total de itens no servidor, usado pela paginação. Padrão: `data.length`.',
      table: { category: 'Comportamento' },
    },
    variant: {
      control: 'inline-radio',
      options: ['default', 'inset'],
      description:
        'Aparência do wrapper: `inset` adiciona card com borda e padding em volta da tabela.',
      table: {
        category: 'Aparência',
        type: { summary: "'default' | 'inset'" },
        defaultValue: { summary: "'default'" },
      },
    },
    pageSizeOptions: {
      control: false,
      description:
        'Opções do seletor de linhas por página (`number[]`). O primeiro valor define o tamanho inicial.',
      table: {
        category: 'Comportamento',
        defaultValue: { summary: '[10, 20, 30, 40, 50, 100]' },
      },
    },
    cursorMeta: {
      control: false,
      description:
        'Metadados da paginação por cursor: `{ hasNext?, hasPrevious?, limit?, nextCursor?, previousCursor? }`. Habilita os botões de navegação.',
      table: { category: 'Comportamento' },
    },
    onPaginationChange: {
      control: false,
      description:
        'Callback `(page, limit, cursor?, direction?)` disparado ao navegar entre páginas.',
      table: { category: 'Estado' },
    },
    rowSelection: {
      control: false,
      description:
        'Estado de seleção controlado (`Record<string, boolean>`, chaveado pelo id da linha).',
      table: { category: 'Estado' },
    },
    onRowSelectionChange: {
      control: false,
      description:
        'Recebe as linhas selecionadas (`T[]`) a cada mudança de seleção.',
      table: { category: 'Estado' },
    },
    onRowSelectionStateChange: {
      control: false,
      description:
        'Callback com o novo estado de seleção (`Record<string, boolean>`).',
      table: { category: 'Estado' },
    },
    emptyMessage: {
      control: 'text',
      description: 'Mensagem exibida quando não há linhas.',
      table: { category: 'Conteúdo' },
    },
    showIndexCol: {
      control: 'boolean',
      description: 'Mostra a coluna `#` com o índice da linha.',
      table: {
        category: 'Aparência',
        defaultValue: { summary: 'false' },
      },
    },
    showCheckboxCol: {
      control: 'boolean',
      description: 'Mostra a coluna de checkboxes para seleção de linhas.',
      table: {
        category: 'Comportamento',
        defaultValue: { summary: 'false' },
      },
    },
    showPagination: {
      control: 'boolean',
      description: 'Mostra a barra de paginação abaixo da tabela.',
      table: {
        category: 'Comportamento',
        defaultValue: { summary: 'true' },
      },
    },
  },
  args: {
    isLoading: false,
    data: DATA,
    columns: COLUMNS,
    variant: 'default',
    showIndexCol: false,
    showCheckboxCol: false,
    showPagination: true,
    onRowSelectionChange: fn(),
    onRowSelectionStateChange: fn(),
    onPaginationChange: fn(),
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Loading: Story = {
  args: {
    isLoading: true,
    data: [],
  },
};

export const Empty: Story = {
  args: {
    data: [],
    emptyMessage: 'No users found.',
  },
};

export const LoadingToLoaded: Story = {
  render: function Render() {
    const [isLoading, setIsLoading] = React.useState(true);

    React.useEffect(() => {
      const timer = setTimeout(() => setIsLoading(false), 1500);
      return () => clearTimeout(timer);
    }, []);

    return (
      <DataCustomTable
        isLoading={isLoading}
        columns={COLUMNS}
        data={isLoading ? [] : DATA}
        onRowSelectionChange={fn()}
        onRowSelectionStateChange={fn()}
        onPaginationChange={fn()}
      />
    );
  },
  play: async ({ canvas }) => {
    await waitFor(() => expect(canvas.getByText('Alice')).toBeVisible(), {
      timeout: 4000,
    });
  },
};

export const CursorPagination: Story = {
  args: {
    cursorMeta: {
      hasNext: true,
      hasPrevious: false,
      nextCursor: 'cursor-2',
    },
  },
  play: async ({ canvas, userEvent, args }) => {
    // As linhas entram com animação escalonada.
    await waitFor(() => expect(canvas.getByText('Alice')).toBeVisible());

    const previous = canvas.getByRole('button', {
      name: 'Go to previous page',
    });
    await expect(previous).toBeDisabled();

    const next = canvas.getByRole('button', { name: 'Go to next page' });
    await expect(next).toBeEnabled();

    await userEvent.click(next);
    await expect(args.onPaginationChange).toHaveBeenCalledWith(
      expect.any(Number),
      expect.any(Number),
      null,
      'next',
    );
  },
};

export const WithRowSelection: Story = {
  args: {
    showCheckboxCol: true,
  },
  // Quando `onRowSelectionStateChange` é fornecido, a seleção vira controlada:
  // o estado precisa ser mantido pela própria story.
  render: function Render(args) {
    const [selection, setSelection] = React.useState<Record<string, boolean>>(
      {},
    );

    return (
      <DataCustomTable
        {...args}
        rowSelection={selection}
        onRowSelectionStateChange={next => {
          setSelection(next);
          args.onRowSelectionStateChange?.(next);
        }}
      />
    );
  },
  play: async ({ canvas, userEvent, args }) => {
    await waitFor(() => expect(canvas.getByText('Alice')).toBeVisible());

    const [firstRowCheckbox] = canvas.getAllByRole('checkbox', {
      name: 'selectRow',
    });

    await userEvent.click(firstRowCheckbox);
    await expect(firstRowCheckbox).toHaveAttribute('aria-checked', 'true');
    await expect(canvas.getByText(/1 of 10 selected/)).toBeVisible();
    await expect(args.onRowSelectionStateChange).toHaveBeenCalled();
  },
};
