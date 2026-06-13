import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { DataCustomTable } from './data-custom-table';
import { ColumnDef } from '@tanstack/react-table';

type User = { id: number; name: string; email: string; role: string };

const NAMES = [
  'Alice',
  'Bob',
  'Charlie',
  'Diana',
  'Edward',
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
  title: 'UI/DataCustomTable',
  component: DataCustomTable,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
  args: {
    onRowSelectionChange: fn(),
    onRowSelectionStateChange: fn(),
    onPaginationChange: fn(),
  },
};

export default meta;

export const Default: StoryObj<typeof meta> = {
  args: {
    isLoading: false,
    data: DATA,
    columns: COLUMNS,
  },
};

export const Loading: StoryObj<typeof meta> = {
  args: {
    isLoading: true,
    data: [],
    columns: COLUMNS,
  },
};

export const Empty: StoryObj<typeof meta> = {
  args: {
    isLoading: false,
    data: [],
    columns: COLUMNS,
    emptyMessage: 'No users found.',
  },
};
