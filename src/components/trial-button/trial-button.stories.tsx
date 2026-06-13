import type { Meta, StoryObj } from '@storybook/react-vite';
import { TrialButton } from './trial-button';

const meta: Meta<typeof TrialButton> = {
  title: 'UI/TrialButton',
  component: TrialButton,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;

export const Default: StoryObj<typeof meta> = {
  args: {},
};
