import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn } from 'storybook/test';

import { RadioGroup } from './radio-group';
import { Label } from '@/components/ui/label';

const meta: Meta<typeof RadioGroup> = {
  title: 'UI/RadioGroup',
  component: RadioGroup,
  subcomponents: {
    'RadioGroup.Item': RadioGroup.Item,
  } as Meta<typeof RadioGroup>['subcomponents'],
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs', 'new'],
  argTypes: {
    defaultValue: {
      control: 'select',
      options: ['option-1', 'option-2', 'option-3'],
      description: 'Item marcado inicialmente, no modo não controlado.',
      table: { category: 'Estado' },
    },
    value: {
      control: false,
      description: 'Item marcado no modo controlado.',
      table: { category: 'Estado' },
    },
    onValueChange: {
      control: false,
      description:
        'Callback disparado quando a seleção muda. Recebe o novo valor e os detalhes do evento.',
      table: { category: 'Estado' },
    },
    disabled: {
      control: 'boolean',
      description: 'Desabilita todos os itens do grupo.',
      table: { category: 'Comportamento', defaultValue: { summary: 'false' } },
    },
    readOnly: {
      control: 'boolean',
      description: 'Impede a mudança de seleção, mantendo os itens focáveis.',
      table: { category: 'Comportamento', defaultValue: { summary: 'false' } },
    },
    required: {
      control: 'boolean',
      description: 'Exige uma seleção antes de submeter o formulário.',
      table: { category: 'Comportamento', defaultValue: { summary: 'false' } },
    },
    name: {
      control: 'text',
      description: 'Nome do campo para submissão em formulários.',
      table: { category: 'Comportamento' },
    },
    className: {
      control: 'text',
      description: 'Classes extras aplicadas ao container do grupo.',
      table: { category: 'Aparência' },
    },
  },
  args: {
    defaultValue: 'option-1',
    disabled: false,
    readOnly: false,
    onValueChange: fn(),
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  render: args => (
    <RadioGroup {...args}>
      <div className="flex items-center gap-2">
        <RadioGroup.Item value="option-1" id="r1" />
        <Label htmlFor="r1">Default</Label>
      </div>
      <div className="flex items-center gap-2">
        <RadioGroup.Item value="option-2" id="r2" />
        <Label htmlFor="r2">Comfortable</Label>
      </div>
      <div className="flex items-center gap-2">
        <RadioGroup.Item value="option-3" id="r3" />
        <Label htmlFor="r3">Compact</Label>
      </div>
    </RadioGroup>
  ),
  play: async ({ canvas, userEvent }) => {
    const initial = canvas.getByRole('radio', { name: 'Default' });
    await expect(initial).toBeChecked();

    const compact = canvas.getByRole('radio', { name: 'Compact' });
    await userEvent.click(compact);

    await expect(compact).toBeChecked();
    await expect(compact).toHaveAttribute('aria-checked', 'true');
    await expect(initial).not.toBeChecked();
  },
};

export const Horizontal: Story = {
  args: {
    defaultValue: 'light',
  },
  argTypes: {
    defaultValue: {
      control: 'select',
      options: ['light', 'dark', 'system'],
    },
  },
  render: args => (
    <RadioGroup {...args} className="flex gap-4">
      <div className="flex items-center gap-2">
        <RadioGroup.Item value="light" id="h1" />
        <Label htmlFor="h1">Light</Label>
      </div>
      <div className="flex items-center gap-2">
        <RadioGroup.Item value="dark" id="h2" />
        <Label htmlFor="h2">Dark</Label>
      </div>
      <div className="flex items-center gap-2">
        <RadioGroup.Item value="system" id="h3" />
        <Label htmlFor="h3">System</Label>
      </div>
    </RadioGroup>
  ),
};

export const Disabled: Story = {
  args: {
    defaultValue: 'a',
    disabled: true,
  },
  argTypes: {
    defaultValue: {
      control: 'select',
      options: ['a', 'b'],
    },
  },
  render: args => (
    <RadioGroup {...args}>
      <div className="flex items-center gap-2">
        <RadioGroup.Item value="a" id="d1" />
        <Label htmlFor="d1">Option A</Label>
      </div>
      <div className="flex items-center gap-2">
        <RadioGroup.Item value="b" id="d2" />
        <Label htmlFor="d2">Option B</Label>
      </div>
    </RadioGroup>
  ),
};
