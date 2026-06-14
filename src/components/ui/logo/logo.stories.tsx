import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect } from 'storybook/test';
import { Logo } from './logo';

const meta: Meta<typeof Logo> = {
  title: 'UI/Logo',
  component: Logo,
  parameters: {
    layout: 'centered',
  },
  tags: ['ai-generated'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'icon'],
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { variant: 'default' },
};

export const IconOnly: Story = {
  args: { variant: 'icon' },
};
