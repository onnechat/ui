import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect } from 'storybook/test';
import { TextShimmer } from './shimmer-text';

const meta: Meta<typeof TextShimmer> = {
  title: 'UI/TextShimmer',
  component: TextShimmer,
  parameters: {
    layout: 'centered',
  },
  tags: ['ai-generated'],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { children: 'This text shimmers with an animated gradient' },
  play: async ({ canvas }) => {
    await expect(canvas.getByText('This text shimmers with an animated gradient')).toBeVisible();
  },
};

export const ShortText: Story = {
  args: { children: 'Shimmer' },
};

export const CustomDuration: Story = {
  args: { children: 'Slow shimmer effect', duration: 4, spread: 3 },
};
