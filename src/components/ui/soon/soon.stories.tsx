import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect } from 'storybook/test';
import { Soon } from './soon';

const meta: Meta<typeof Soon> = {
  title: 'UI/Soon',
  component: Soon,
  parameters: {
    layout: 'centered',
  },
  tags: ['ai-generated'],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { children: 'Em breve' },
};

export const CustomText: Story = {
  args: { children: 'Soon' },
  play: async ({ canvas }) => {
    await expect(canvas.getByText('Soon')).toBeVisible();
  },
};
