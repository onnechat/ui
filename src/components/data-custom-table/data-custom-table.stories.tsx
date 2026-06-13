import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { DataCustomTable } from './data-custom-table';
import { ColumnDef } from '@tanstack/react-table';

type User = { id: number; name: string; email: string; role: string };

const DATA: User[] = [
  { id: 1, name: 'Alice', email: 'alice@example.com', role: 'Admin' },
  { id: 2, name: 'Bob', email: 'bob@example.com', role: 'Editor' },
  { id: 3, name: 'Charlie', email: 'charlie@example.com', role: 'Viewer' },
  { id: 4, name: 'Diana', email: 'diana@example.com', role: 'Admin' },
  { id: 5, name: 'Edward', email: 'edward@example.com', role: 'Editor' },
  { id: 6, name: 'Fiona', email: 'fiona@example.com', role: 'Viewer' },
  { id: 7, name: 'George', email: 'george@example.com', role: 'Admin' },
  { id: 8, name: 'Hannah', email: 'hannah@example.com', role: 'Editor' },
  { id: 9, name: 'Ivan', email: 'ivan@example.com', role: 'Viewer' },
  { id: 10, name: 'Julia', email: 'julia@example.com', role: 'Admin' },
  { id: 11, name: 'Kevin', email: 'kevin@example.com', role: 'Editor' },
  { id: 12, name: 'Laura', email: 'laura@example.com', role: 'Viewer' },
  { id: 13, name: 'Mike', email: 'mike@example.com', role: 'Admin' },
  { id: 14, name: 'Nina', email: 'nina@example.com', role: 'Editor' },
  { id: 15, name: 'Oscar', email: 'oscar@example.com', role: 'Viewer' },
  { id: 16, name: 'Paula', email: 'paula@example.com', role: 'Admin' },
  { id: 17, name: 'Quinn', email: 'quinn@example.com', role: 'Editor' },
  { id: 18, name: 'Rachel', email: 'rachel@example.com', role: 'Viewer' },
  { id: 19, name: 'Steve', email: 'steve@example.com', role: 'Admin' },
  { id: 20, name: 'Tina', email: 'tina@example.com', role: 'Editor' },
];

const COLUMNS: ColumnDef<User>[] = [
  { accessorKey: 'name', header: 'Name' },
  { accessorKey: 'email', header: 'Email' },
  { accessorKey: 'role', header: 'Role' },
];

const meta: Meta<typeof DataCustomTable> = {
  title: 'UI/DataCustomTable',
  component: DataCustomTable,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
};

export default meta;

export const Default: StoryObj<typeof meta> = {
  args: {
    isLoading: false,
    data: DATA,
    columns: COLUMNS,
    onRowSelectionChange: fn(),
    onRowSelectionStateChange: fn(),
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
