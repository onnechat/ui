import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, waitFor } from 'storybook/test';

import { Accordion } from './accordion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const meta: Meta<typeof Accordion> = {
  title: 'UI/Accordion',
  component: Accordion,
  subcomponents: {
    'Accordion.Item': Accordion.Item,
    'Accordion.Trigger': Accordion.Trigger,
    'Accordion.Content': Accordion.Content,
  } as Meta<typeof Accordion>['subcomponents'],
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    type: {
      control: 'inline-radio',
      options: ['single', 'multiple'],
      description: 'Quantos itens podem ficar abertos ao mesmo tempo.',
      table: {
        category: 'Comportamento',
        type: { summary: "'single' | 'multiple'" },
        defaultValue: { summary: "'single'" },
      },
    },
    collapsible: {
      control: 'boolean',
      description:
        'Permite fechar o item aberto sem precisar abrir outro. Mantido por compatibilidade com a API do Radix — no Base UI o modo single é sempre colapsável.',
      table: {
        category: 'Comportamento',
        defaultValue: { summary: 'true' },
      },
    },
    disabled: {
      control: 'boolean',
      description: 'Desabilita todos os itens do accordion.',
      table: {
        category: 'Comportamento',
        defaultValue: { summary: 'false' },
      },
    },
    defaultValue: {
      control: false,
      description:
        'Item(ns) aberto(s) inicialmente, no modo não controlado. `string` para single, `string[]` para multiple.',
      table: { category: 'Estado' },
    },
    value: {
      control: false,
      description: 'Item(ns) aberto(s) no modo controlado.',
      table: { category: 'Estado' },
    },
    onValueChange: {
      control: false,
      description:
        'Callback disparado quando a seleção muda. Recebe `string` no single e `string[]` no multiple.',
      table: { category: 'Estado' },
    },
    className: {
      control: 'text',
      description: 'Classes extras aplicadas ao container raiz.',
      table: { category: 'Aparência' },
    },
  },
  args: {
    type: 'single',
    collapsible: true,
    disabled: false,
    className: 'w-full min-w-(--container-md) max-w-(--container-md)',
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

const items = (count: number) =>
  Array.from({ length: count }, (_, i) => (
    <Accordion.Item key={i} value={`item-${i}`}>
      <Accordion.Trigger>Item {i + 1}</Accordion.Trigger>
      <Accordion.Content>Content for item {i + 1}.</Accordion.Content>
    </Accordion.Item>
  ));

export const Playground: Story = {
  render: args => <Accordion {...args}>{items(5)}</Accordion>,
  play: async ({ canvas, userEvent }) => {
    const trigger = canvas.getByRole('button', { name: 'Item 2' });

    await userEvent.click(trigger);
    await expect(trigger).toHaveAttribute('aria-expanded', 'true');
    const content = await canvas.findByText('Content for item 2.');
    await waitFor(() => expect(content).toBeVisible());

    await userEvent.click(trigger);
    await expect(trigger).toHaveAttribute('aria-expanded', 'false');
  },
};

export const Multiple: Story = {
  args: {
    type: 'multiple',
    defaultValue: ['item-0'],
  },
  render: args => <Accordion {...args}>{items(5)}</Accordion>,
  play: async ({ canvas, userEvent }) => {
    await expect(canvas.getByText('Content for item 1.')).toBeVisible();

    await userEvent.click(canvas.getByRole('button', { name: 'Item 3' }));
    const content = await canvas.findByText('Content for item 3.');
    await waitFor(() => expect(content).toBeVisible());

    // No modo multiple o item anterior permanece aberto.
    await expect(canvas.getByText('Content for item 1.')).toBeVisible();
  },
};

export const CustomTriggers: Story = {
  render: args => (
    <Accordion {...args}>
      <Accordion.Item value="profile">
        <Accordion.Trigger>
          <span className="flex items-center gap-2">
            <span className="flex size-6 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
              A
            </span>
            Profile Settings
          </span>
        </Accordion.Trigger>
        <Accordion.Content>
          Manage your profile information, avatar, and display name.
        </Accordion.Content>
      </Accordion.Item>
      <Accordion.Item value="notifications">
        <Accordion.Trigger>
          <span className="flex items-center gap-2">
            <span className="flex size-6 items-center justify-center rounded-full bg-warning text-[10px] font-bold text-warning-foreground">
              B
            </span>
            Notifications
          </span>
        </Accordion.Trigger>
        <Accordion.Content>
          Configure email, push, and in-app notification preferences.
        </Accordion.Content>
      </Accordion.Item>
      <Accordion.Item value="billing">
        <Accordion.Trigger>
          <span className="flex items-center gap-2">
            <span className="flex size-6 items-center justify-center rounded-full bg-success text-[10px] font-bold text-success-foreground">
              C
            </span>
            Billing & Plans
          </span>
        </Accordion.Trigger>
        <Accordion.Content>
          View your current plan, payment methods, and billing history.
        </Accordion.Content>
      </Accordion.Item>
    </Accordion>
  ),
};

export const CustomContent: Story = {
  render: args => (
    <Accordion {...args}>
      <Accordion.Item value="search">
        <Accordion.Trigger>Search</Accordion.Trigger>
        <Accordion.Content>
          <div className="flex flex-col gap-3">
            <Input placeholder="Search..." />
            <div className="flex gap-2">
              <Button size="sm" variant="primary">
                Search
              </Button>
              <Button size="sm" variant="outline">
                Clear
              </Button>
            </div>
          </div>
        </Accordion.Content>
      </Accordion.Item>
      <Accordion.Item value="filters">
        <Accordion.Trigger>Filters</Accordion.Trigger>
        <Accordion.Content>
          <div className="flex flex-wrap gap-2">
            {['Active', 'Pending', 'Draft', 'Archived'].map(label => (
              <Button key={label} size="sm" variant="secondary">
                {label}
              </Button>
            ))}
          </div>
        </Accordion.Content>
      </Accordion.Item>
      <Accordion.Item value="actions">
        <Accordion.Trigger>Quick Actions</Accordion.Trigger>
        <Accordion.Content>
          <div className="flex flex-col gap-2">
            <Button variant="outline" className="justify-start">
              Export CSV
            </Button>
            <Button variant="outline" className="justify-start">
              Import Data
            </Button>
            <Button variant="destructive" className="justify-start">
              Delete All
            </Button>
          </div>
        </Accordion.Content>
      </Accordion.Item>
    </Accordion>
  ),
};
