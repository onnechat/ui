import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect } from 'storybook/test';
import { Table } from './table';

const meta: Meta<typeof Table> = {
  title: 'UI/Table',
  component: Table,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
  args: {
    className: 'w-full',
  },
};

export default meta;

const INVOICES = [
  { id: 'INV001', status: 'Paid', method: 'Credit Card', amount: '$250.00' },
  { id: 'INV002', status: 'Pending', method: 'PayPal', amount: '$150.00' },
  { id: 'INV003', status: 'Unpaid', method: 'Bank Transfer', amount: '$350.00' },
  { id: 'INV004', status: 'Paid', method: 'Credit Card', amount: '$450.00' },
  { id: 'INV005', status: 'Pending', method: 'PayPal', amount: '$550.00' },
];

export const Default: StoryObj<typeof meta> = {
  render: (args) => (
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
        {INVOICES.map((invoice) => (
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
  play: async ({ canvas }) => {
    await expect(canvas.getByText('INV001')).toBeVisible();
  },
};

export const Empty: StoryObj<typeof meta> = {
  render: (args) => (
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

export const WithFooter: StoryObj<typeof meta> = {
  render: (args) => {
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
          {INVOICES.map((invoice) => (
            <Table.Row key={invoice.id}>
              <Table.Cell className="font-medium">{invoice.id}</Table.Cell>
              <Table.Cell>{invoice.status}</Table.Cell>
              <Table.Cell>{invoice.method}</Table.Cell>
              <Table.Cell className="text-right">{invoice.amount}</Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>

        <tfoot>
          <Table.Row>
            <Table.Cell colSpan={3}>Total</Table.Cell>
            <Table.Cell className="text-right">{total}</Table.Cell>
          </Table.Row>
        </tfoot>
      </Table>
    );
  },
  play: async ({ canvas }) => {
    await expect(canvas.getByText('$1,750.00')).toBeVisible();
  },
};
