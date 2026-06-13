import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect } from 'storybook/test';
import { Cell } from './cell';

const meta: Meta<typeof Cell> = {
  title: 'UI/Text',
  component: Cell,
  parameters: { layout: 'centered' },
  tags: ['ai-generated'],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { children: 'Sample cell text' },
};

export const Empty: Story = {
  args: { children: undefined },
  play: async ({ canvas }) => {
    await expect(canvas.getByText('notDefined')).toBeVisible();
  },
};

export const NoWrap: Story = {
  args: { children: 'This is a long text that should not wrap', wrap: false },
};

export const Wrap: Story = {
  args: { children: 'This is a long text that should wrap when it overflows', wrap: true },
};
