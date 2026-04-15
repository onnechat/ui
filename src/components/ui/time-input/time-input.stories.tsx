import type { Meta, StoryObj } from '@storybook/react-vite';
import { TimeInput } from './time-input';

const meta = {
  title: 'UI/TimeInput',
  component: typeof TimeInput !== 'undefined' ? TimeInput : undefined,
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
