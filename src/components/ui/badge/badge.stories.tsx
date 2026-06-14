import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect } from 'storybook/test';
import { Badge } from './badge';

const meta: Meta<typeof Badge> = {
  title: 'UI/Badge',
  component: Badge,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'secondary', 'destructive', 'warning', 'success', 'outline'],
    },
  },
};

export default meta;

export const Default: StoryObj<typeof meta> = {
  args: {
    children: 'Default',
  },
  play: async ({ canvas }) => {
    await expect(canvas.getByText('Default')).toBeVisible();
  },
};

export const Secondary: StoryObj<typeof meta> = {
  args: {
    variant: 'secondary',
    children: 'Secondary',
  },
};

export const Destructive: StoryObj<typeof meta> = {
  args: {
    variant: 'destructive',
    children: 'Destructive',
  },
};

export const Warning: StoryObj<typeof meta> = {
  args: {
    variant: 'warning',
    children: 'Warning',
  },
};

export const Success: StoryObj<typeof meta> = {
  args: {
    variant: 'success',
    children: 'Success',
  },
};

export const Outline: StoryObj<typeof meta> = {
  args: {
    variant: 'outline',
    children: 'Outline',
  },
};
