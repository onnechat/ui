import type { Meta, StoryObj } from '@storybook/react-vite';
import { Button } from './Button';
import { ExternalLinkIcon } from 'lucide-react';

const meta = {
  title: 'Components/Button',
  component: Button,
  parameters: {
    layout: 'centered',
    controls: {
      include: [
        'variant',
        'size',
        'loading',
        'disabled',
        'asChild',
        'children',
      ],
    },
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: { type: 'select' },
      options: [
        'primary',
        'secondary',
        'destructive',
        'success',
        'warning',
        'ghost',
        'link',
        'outline',
      ],
    },
    size: {
      control: { type: 'select' },
      options: [
        'xs',
        'sm',
        'md',
        'lg',
        'xl',
        '2xl',
        '3xl',
        '4xl',
        '5xl',
        'icon',
      ],
    },
    loading: {
      control: { type: 'boolean' },
    },
    disabled: {
      control: { type: 'boolean' },
    },
    asChild: {
      control: { type: 'boolean' },
    },
    children: {
      control: { type: 'text' },
    },
  },
} satisfies Meta<typeof Button>;

export default meta;

export const Default: StoryObj<typeof meta> = {
  args: {
    children: 'Default',
    asChild: false,
    loading: false,
    disabled: false,
  },
};

export const Loading: StoryObj<typeof meta> = {
  args: {
    children: 'Loading',
    loading: true,
  },
};

export const Disabled: StoryObj<typeof meta> = {
  args: {
    children: 'Disabled',
    disabled: true,
  },
};

export const AsChild: StoryObj<typeof meta> = {
  args: {
    asChild: true,
  },
  render: args => (
    <Button {...args}>
      <a href="https://shiddo.com.br" target="_blank" rel="noopener noreferrer">
        Go to Shiddo <ExternalLinkIcon />
      </a>
    </Button>
  ),
};
