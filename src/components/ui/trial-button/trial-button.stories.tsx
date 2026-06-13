import type { Meta, StoryObj } from '@storybook/react-vite';
import { TrialButton } from './trial-button';

const meta: Meta<typeof TrialButton> = {
  title: 'UI/TrialButton',
  component: TrialButton,
  parameters: {
    layout: 'centered',
  },
  tags: ['ai-generated'],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
};
