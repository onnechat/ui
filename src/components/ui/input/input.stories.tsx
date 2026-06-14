import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect } from 'storybook/test';
import { Input } from './input';
import { Icon } from '@/components/icon';
import { Label } from '@/components/ui/label';

const meta: Meta<typeof Input> = {
  title: 'UI/Input',
  component: Input,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs', 'new'],
  args: {
    className: 'w-64',
  },
  argTypes: {
    type: {
      control: 'select',
      options: ['text', 'password', 'email', 'number', 'search', 'tel', 'url', 'file'],
    },
  },
};

export default meta;

export const Default: StoryObj<typeof meta> = {
  args: {
    placeholder: 'Enter text...',
    type: 'text',
  },
  play: async ({ canvas }) => {
    await expect(canvas.getByPlaceholderText('Enter text...')).toBeInTheDocument();
  },
};

export const Password: StoryObj<typeof meta> = {
  args: {
    type: 'password',
    placeholder: 'Password',
  },
};

export const Email: StoryObj<typeof meta> = {
  args: {
    type: 'email',
    placeholder: 'email@example.com',
  },
};

export const Disabled: StoryObj<typeof meta> = {
  args: {
    placeholder: 'Disabled input',
    disabled: true,
  },
};

export const ReadOnly: StoryObj<typeof meta> = {
  args: {
    defaultValue: 'Read only value',
    readOnly: true,
  },
};

export const File: StoryObj<typeof meta> = {
  args: {
    type: 'file',
    className: 'w-80',
  },
};

export const WithPrefix: StoryObj<typeof meta> = {
  render: (args) => (
    <div className="grid gap-1.5 w-64">
      <Label htmlFor="search">Search</Label>
      <Input
        id="search"
        placeholder="Search..."
        prefix={<Icon name="Search" className="size-4" />}
        {...args}
      />
    </div>
  ),
  play: async ({ canvas }) => {
    await expect(canvas.getByText('Search')).toBeVisible();
  },
};

export const WithSuffix: StoryObj<typeof meta> = {
  render: (args) => (
    <Input
      placeholder="Website"
      sufix={<span className="text-xs text-muted-foreground">.com</span>}
      {...args}
    />
  ),
};

export const WithLabel: StoryObj<typeof meta> = {
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
