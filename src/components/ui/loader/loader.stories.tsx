import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect } from 'storybook/test';
import { Loader } from './loader';

const meta: Meta<typeof Loader> = {
  title: 'UI/Loader',
  component: Loader,
  parameters: {
    layout: 'centered',
  },
  tags: ['ai-generated'],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { text: 'Loading...' },
  play: async ({ canvas }) => {
    await expect(canvas.getByText('Loading...')).toBeVisible();
  },
};

export const Clean: Story = {
  args: { variant: 'clean', text: 'Please wait...' },
};

export const Button: Story = {
  args: { variant: 'button' },
};
