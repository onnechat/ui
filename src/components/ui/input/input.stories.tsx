import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect } from 'storybook/test';

import { Input } from './input';
import { InputGroup } from '@/components/ui/input-group';
import { Icon } from '@/components/icon';
import { Label } from '@/components/ui/label';

const meta: Meta<typeof Input> = {
  title: 'UI/Input',
  component: Input,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs', 'new'],
  argTypes: {
    type: {
      control: 'select',
      options: [
        'text',
        'password',
        'email',
        'number',
        'search',
        'tel',
        'url',
        'file',
      ],
      description: 'Tipo nativo do input.',
      table: {
        category: 'Comportamento',
        defaultValue: { summary: "'text'" },
      },
    },
    placeholder: {
      control: 'text',
      description: 'Texto exibido enquanto o campo está vazio.',
      table: { category: 'Conteúdo' },
    },
    defaultValue: {
      control: 'text',
      description: 'Valor inicial no modo não controlado.',
      table: { category: 'Conteúdo' },
    },
    disabled: {
      control: 'boolean',
      description: 'Desabilita o campo, bloqueando foco e edição.',
      table: {
        category: 'Estado',
        defaultValue: { summary: 'false' },
      },
    },
    readOnly: {
      control: 'boolean',
      description: 'Torna o campo somente leitura (valor visível, sem edição).',
      table: {
        category: 'Estado',
        defaultValue: { summary: 'false' },
      },
    },
    'aria-invalid': {
      control: 'boolean',
      description: 'Marca o campo como inválido, aplicando o estilo de erro.',
      table: {
        category: 'Estado',
        defaultValue: { summary: 'false' },
      },
    },
    onChange: {
      control: false,
      description:
        'Callback nativo de mudança. Recebe o `ChangeEvent` do input.',
      table: { category: 'Comportamento' },
    },
    className: {
      control: 'text',
      description: 'Classes extras aplicadas ao elemento `input`.',
      table: { category: 'Aparência' },
    },
  },
  args: {
    type: 'text',
    placeholder: 'Enter text...',
    disabled: false,
    readOnly: false,
    className: 'w-64',
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  play: async ({ canvas, userEvent }) => {
    const input = canvas.getByPlaceholderText('Enter text...');

    await userEvent.type(input, 'Hello world');
    await expect(input).toHaveValue('Hello world');
  },
};

export const Password: Story = {
  args: {
    type: 'password',
    placeholder: 'Password',
  },
};

export const Email: Story = {
  args: {
    type: 'email',
    placeholder: 'email@example.com',
  },
};

export const Disabled: Story = {
  args: {
    placeholder: 'Disabled input',
    disabled: true,
  },
};

export const ReadOnly: Story = {
  args: {
    defaultValue: 'Read only value',
    readOnly: true,
    placeholder: '',
    'aria-label': 'Read only value',
  },
};

export const File: Story = {
  args: {
    type: 'file',
    placeholder: '',
    className: 'w-80',
    'aria-label': 'Upload file',
  },
};

export const WithPrefix: Story = {
  render: () => (
    <div className="grid gap-1.5 w-64">
      <Label htmlFor="search">Search</Label>
      <InputGroup>
        <InputGroup.Input id="search" placeholder="Search..." />
        <InputGroup.Addon align="inline-start">
          <Icon name="Magnifier" className="size-4" />
        </InputGroup.Addon>
      </InputGroup>
    </div>
  ),
};

export const WithSuffix: Story = {
  render: () => (
    <InputGroup className="w-64">
      <InputGroup.Input placeholder="Website" />
      <InputGroup.Addon align="inline-end">
        <InputGroup.Text>.com</InputGroup.Text>
      </InputGroup.Addon>
    </InputGroup>
  ),
};

export const WithLabel: Story = {
  render: () => (
    <div className="grid gap-1.5 w-64">
      <Label htmlFor="name">Name</Label>
      <Input id="name" placeholder="Your name" />
    </div>
  ),
  play: async ({ canvas }) => {
    await expect(canvas.getByLabelText('Name')).toBeInTheDocument();
  },
};
