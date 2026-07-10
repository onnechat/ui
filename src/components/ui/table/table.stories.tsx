import type { Meta, StoryObj } from '@storybook/react-vite';

import { Table } from './table';

const meta: Meta<typeof Table> = {
  title: 'UI/Table',
  component: Table,
  subcomponents: {
    'Table.Header': Table.Header,
    'Table.Body': Table.Body,
    'Table.Footer': Table.Footer,
    'Table.Row': Table.Row,
    'Table.Head': Table.Head,
    'Table.Cell': Table.Cell,
    'Table.Caption': Table.Caption,
  } as Meta<typeof Table>['subcomponents'],
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
  argTypes: {
    children: {
      control: false,
      description:
        'Composição livre de `Table.Header`, `Table.Body`, `Table.Footer`, `Table.Row`, `Table.Head`, `Table.Cell` e `Table.Caption`.',
      table: { category: 'Conteúdo' },
    },
    className: {
      control: 'text',
      description: 'Classes extras aplicadas ao elemento `<table>`.',
      table: { category: 'Aparência' },
    },
    containerClassName: {
      control: 'text',
      description:
        'Classes extras aplicadas ao container externo, responsável pelo scroll horizontal e pelo raio de borda.',
      table: { category: 'Aparência' },
    },
  },
  args: {
    className: 'w-full',
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

const INVOICES = [
  { id: 'INV001', status: 'Paid', method: 'Credit Card', amount: '$250.00' },
  { id: 'INV002', status: 'Pending', method: 'PayPal', amount: '$150.00' },
  {
    id: 'INV003',
    status: 'Unpaid',
    method: 'Bank Transfer',
    amount: '$350.00',
  },
  { id: 'INV004', status: 'Paid', method: 'Credit Card', amount: '$450.00' },
  { id: 'INV005', status: 'Pending', method: 'PayPal', amount: '$550.00' },
];

export const Playground: Story = {
  render: args => (
    <Table {...args}>
      <Table.Caption>A list of your recent invoices.</Table.Caption>

      <Table.Header>
        <Table.Row>
          <Table.Head className="w-[100px]">Invoice</Table.Head>
          <Table.Head>Status</Table.Head>
          <Table.Head>Method</Table.Head>
          <Table.Head className="text-right">Amount</Table.Head>
        </Table.Row>
      </Table.Header>

      <Table.Body>
        {INVOICES.map(invoice => (
          <Table.Row key={invoice.id}>
            <Table.Cell className="font-medium">{invoice.id}</Table.Cell>
            <Table.Cell>{invoice.status}</Table.Cell>
            <Table.Cell>{invoice.method}</Table.Cell>
            <Table.Cell className="text-right">{invoice.amount}</Table.Cell>
          </Table.Row>
        ))}
      </Table.Body>
    </Table>
  ),
};

export const Empty: Story = {
  render: args => (
    <Table {...args}>
      <Table.Header>
        <Table.Row>
          <Table.Head>Invoice</Table.Head>
          <Table.Head>Status</Table.Head>
          <Table.Head>Method</Table.Head>
          <Table.Head className="text-right">Amount</Table.Head>
        </Table.Row>
      </Table.Header>

      <Table.Body>
        <Table.Row>
          <Table.Cell colSpan={4} className="h-24 text-center">
            No results.
          </Table.Cell>
        </Table.Row>
      </Table.Body>
    </Table>
  ),
};

export const WithFooter: Story = {
  render: args => {
    const total = '$1,750.00';
    return (
      <Table {...args}>
        <Table.Caption>A list of your recent invoices.</Table.Caption>

        <Table.Header>
          <Table.Row>
            <Table.Head className="w-[100px]">Invoice</Table.Head>
            <Table.Head>Status</Table.Head>
            <Table.Head>Method</Table.Head>
            <Table.Head className="text-right">Amount</Table.Head>
          </Table.Row>
        </Table.Header>

        <Table.Body>
          {INVOICES.map(invoice => (
            <Table.Row key={invoice.id}>
              <Table.Cell className="font-medium">{invoice.id}</Table.Cell>
              <Table.Cell>{invoice.status}</Table.Cell>
              <Table.Cell>{invoice.method}</Table.Cell>
              <Table.Cell className="text-right">{invoice.amount}</Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>

        <Table.Footer>
          <Table.Row>
            <Table.Cell colSpan={3}>Total</Table.Cell>
            <Table.Cell className="text-right">{total}</Table.Cell>
          </Table.Row>
        </Table.Footer>
      </Table>
    );
  },
};
