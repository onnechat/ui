import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect } from 'storybook/test';

import { Label } from './label';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';

const meta: Meta<typeof Label> = {
  title: 'UI/Label',
  component: Label,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    children: {
      control: 'text',
      description: 'Texto (ou nós) exibido dentro do label.',
      table: { category: 'Conteúdo' },
    },
    required: {
      control: 'boolean',
      description: 'Exibe um asterisco indicando campo obrigatório.',
      table: {
        category: 'Aparência',
        defaultValue: { summary: 'false' },
      },
    },
    htmlFor: {
      control: 'text',
      description: 'Id do controle associado ao label.',
      table: { category: 'Comportamento' },
    },
    className: {
      control: 'text',
      description: 'Classes extras aplicadas ao elemento `label`.',
      table: { category: 'Aparência' },
    },
  },
  args: {
    children: 'Name',
    required: false,
    htmlFor: 'name',
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  render: args => (
    <div className="flex items-center gap-2">
      <Label {...args} />
      <Input id="name" placeholder="Enter your name" />
    </div>
  ),
  play: async ({ canvas, userEvent }) => {
    // Clicar no label deve focar o input associado via htmlFor.
    await userEvent.click(canvas.getByText('Name'));
    await expect(canvas.getByPlaceholderText('Enter your name')).toHaveFocus();
  },
};

export const WithCheckbox: Story = {
  render: () => (
    <div className="flex flex-col gap-3">
      {[
        { id: 'apple', label: 'Apple' },
        { id: 'banana', label: 'Banana' },
        { id: 'cherry', label: 'Cherry', disabled: true },
      ].map(({ id, label, disabled }) => (
        <div key={id} className="flex items-center gap-2">
          <Checkbox id={id} disabled={disabled} />
          <Label
            htmlFor={id}
            className={disabled ? 'opacity-50 cursor-not-allowed' : ''}
          >
            {label}
          </Label>
        </div>
      ))}
    </div>
  ),
};

export const WithInput: Story = {
  render: () => (
    <div className="flex w-72 flex-col gap-2">
      <Label htmlFor="email">Email address</Label>
      <Input id="email" type="email" placeholder="you@example.com" />
    </div>
  ),
};

export const Required: Story = {
  render: () => (
    <div className="flex w-72 flex-col gap-2">
      <Label htmlFor="username" required>
        Username
      </Label>
      <Input id="username" placeholder="Required field" required />
    </div>
  ),
};

export const WithDescription: Story = {
  render: () => (
    <div className="flex w-72 flex-col gap-2">
      <Label htmlFor="password">Password</Label>
      <Input id="password" type="password" placeholder="Min. 8 characters" />
      <p className="text-xs text-muted-foreground">
        Must contain at least one number and one special character.
      </p>
    </div>
  ),
};

export const Inline: Story = {
  render: () => (
    <div className="flex w-96 flex-col gap-4">
      <div className="flex items-center gap-3">
        <Label htmlFor="width" className="w-20">
          Width
        </Label>
        <Input id="width" defaultValue="100" className="flex-1" />
        <span className="text-sm text-muted-foreground">px</span>
      </div>
      <div className="flex items-center gap-3">
        <Label htmlFor="height" className="w-20">
          Height
        </Label>
        <Input id="height" defaultValue="200" className="flex-1" />
        <span className="text-sm text-muted-foreground">px</span>
      </div>
    </div>
  ),
};
