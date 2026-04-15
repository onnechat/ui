import type { Meta, StoryObj } from '@storybook/react-vite';
import { TrialButton } from './trial-button';

const meta = {
  title: 'UI/TrialButton',
  component: typeof TrialButton !== 'undefined' ? TrialButton : undefined,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {},
} satisfies Meta<any>;

export default meta;

export const Default: StoryObj<typeof meta> = {
  args: {},
};
