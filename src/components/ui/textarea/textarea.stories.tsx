import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect } from 'storybook/test';

import { Textarea } from './textarea';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const meta: Meta<typeof Textarea> = {
  title: 'UI/Textarea',
  component: Textarea,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
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
    rows: {
      control: 'number',
      description: 'Número de linhas visíveis do textarea.',
      table: { category: 'Aparência' },
    },
    maxLength: {
      control: 'number',
      description: 'Quantidade máxima de caracteres aceitos.',
      table: { category: 'Comportamento' },
    },
    disabled: {
      control: 'boolean',
      description: 'Desabilita o campo, bloqueando foco e edição.',
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
        'Callback nativo de mudança. Recebe o `ChangeEvent` do textarea.',
      table: { category: 'Comportamento' },
    },
    className: {
      control: 'text',
      description: 'Classes extras aplicadas ao elemento `textarea`.',
      table: { category: 'Aparência' },
    },
  },
  args: {
    placeholder: 'Type your message here...',
    disabled: false,
    className: 'w-80',
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  play: async ({ canvas, userEvent }) => {
    const textarea = canvas.getByPlaceholderText('Type your message here...');

    await userEvent.type(textarea, 'Hello from Storybook');
    await expect(textarea).toHaveValue('Hello from Storybook');
  },
};

export const WithValue: Story = {
  args: {
    defaultValue:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    placeholder: '',
    'aria-label': 'Message',
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
    defaultValue: 'This textarea is disabled and cannot be edited.',
    placeholder: '',
    'aria-label': 'Disabled message',
  },
};

export const Invalid: Story = {
  args: {
    'aria-invalid': true,
    defaultValue: 'Invalid input content.',
    placeholder: '',
    'aria-label': 'Invalid message',
  },
};

export const WithLabel: Story = {
  render: () => (
    <div className="flex w-80 flex-col gap-1.5">
      <Label htmlFor="bio">Bio</Label>
      <Textarea id="bio" placeholder="Tell us about yourself..." />
    </div>
  ),
};

export const WithCharacterCount: Story = {
  render: () => {
    const maxLength = 200;

    return (
      <div className="flex w-80 flex-col gap-1.5">
        <div className="flex items-center justify-between">
          <Label htmlFor="desc">Description</Label>
          <span className="text-xs text-muted-foreground">0 / {maxLength}</span>
        </div>
        <Textarea
          id="desc"
          maxLength={maxLength}
          placeholder="Brief description..."
        />
      </div>
    );
  },
};

export const CustomRows: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <Textarea rows={2} placeholder="2 rows" className="w-80" />
      <Textarea rows={4} placeholder="4 rows (default)" className="w-80" />
      <Textarea rows={8} placeholder="8 rows" className="w-80" />
    </div>
  ),
};

export const FormExample: Story = {
  render: () => (
    <form
      className="flex w-80 flex-col gap-4"
      onSubmit={e => {
        e.preventDefault();
        alert('Form submitted');
      }}
    >
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="name">Name</Label>
        <Input id="name" placeholder="Your name" />
      </div>
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="feedback">Feedback</Label>
        <Textarea id="feedback" placeholder="Share your thoughts..." />
      </div>
      <Button type="submit">Submit</Button>
    </form>
  ),
};
