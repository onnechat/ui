import type { Meta, StoryObj } from '@storybook/react-vite';
import { TimeInput } from './time-input';

const meta: Meta<typeof TimeInput> = {
  title: 'UI/TimeInput',
  component: TimeInput,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;

export const Default: StoryObj<typeof meta> = {
  args: {},
};
