import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn } from 'storybook/test';

import { Checkbox } from './checkbox';
import { Label } from '@/components/ui/label';

const meta: Meta<typeof Checkbox> = {
  title: 'UI/Checkbox',
  component: Checkbox,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    defaultChecked: {
      control: 'boolean',
      description: 'Estado inicial marcado, no modo não controlado.',
      table: {
        category: 'Estado',
        defaultValue: { summary: 'false' },
      },
    },
    checked: {
      control: false,
      description:
        'Estado marcado no modo controlado. Use com `onCheckedChange`.',
      table: { category: 'Estado' },
    },
    indeterminate: {
      control: 'boolean',
      description:
        'Exibe o estado indeterminado (traço), típico de seleções parciais.',
      table: {
        category: 'Estado',
        defaultValue: { summary: 'false' },
      },
    },
    disabled: {
      control: 'boolean',
      description: 'Desabilita o checkbox, bloqueando foco e alternância.',
      table: {
        category: 'Estado',
        defaultValue: { summary: 'false' },
      },
    },
    required: {
      control: 'boolean',
      description: 'Marca o checkbox como obrigatório em formulários.',
      table: {
        category: 'Comportamento',
        defaultValue: { summary: 'false' },
      },
    },
    onCheckedChange: {
      control: false,
      description:
        'Callback disparado ao alternar. Recebe `(checked: boolean, event)`.',
      table: { category: 'Comportamento' },
    },
    'aria-label': {
      control: 'text',
      description: 'Nome acessível quando não há um `Label` visível associado.',
      table: { category: 'Conteúdo' },
    },
    className: {
      control: 'text',
      description: 'Classes extras aplicadas ao elemento raiz.',
      table: { category: 'Aparência' },
    },
  },
  args: {
    defaultChecked: false,
    indeterminate: false,
    disabled: false,
    'aria-label': 'Accept terms',
    onCheckedChange: fn(),
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  play: async ({ canvas, userEvent }) => {
    const checkbox = canvas.getByRole('checkbox');

    await userEvent.click(checkbox);
    await expect(checkbox).toBeChecked();

    await userEvent.click(checkbox);
    await expect(checkbox).not.toBeChecked();
  },
};

export const Checked: Story = {
  args: {
    checked: true,
  },
};

export const Indeterminate: Story = {
  args: {
    indeterminate: true,
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
  },
};

export const DisabledChecked: Story = {
  args: {
    disabled: true,
    checked: true,
  },
};

export const WithLabel: Story = {
  render: () => (
    <div className="flex items-center gap-2">
      <Checkbox id="terms" onCheckedChange={fn()} />
      <Label htmlFor="terms">Accept terms and conditions</Label>
    </div>
  ),
  play: async ({ canvas, userEvent }) => {
    // O nome acessível vem do Label associado via htmlFor.
    const checkbox = canvas.getByRole('checkbox', {
      name: 'Accept terms and conditions',
    });

    await userEvent.click(checkbox);
    await expect(checkbox).toBeChecked();
  },
};

export const WithDescription: Story = {
  render: () => (
    <div className="flex items-start gap-2">
      <Checkbox id="notifications" onCheckedChange={fn()} className="-mt-0.5" />
      <div className="grid gap-1">
        <Label htmlFor="notifications">Enable notifications</Label>
        <p className="text-sm text-muted-foreground">
          You can enable or disable notifications at any time.
        </p>
      </div>
    </div>
  ),
};

export const Group: Story = {
  render: () => (
    <div className="grid gap-3">
      <p className="text-sm font-medium">Select items to display</p>
      {[
        'Hard disks',
        'External disks',
        'CDs, DVDs, and iPods',
        'Connected servers',
      ].map(label => {
        const id = label.toLowerCase().replace(/[^a-z0-9]+/g, '-');

        return (
          <div key={id} className="flex items-center gap-2">
            <Checkbox id={id} onCheckedChange={fn()} />
            <Label htmlFor={id}>{label}</Label>
          </div>
        );
      })}
    </div>
  ),
};
