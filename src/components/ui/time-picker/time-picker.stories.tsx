import type { Meta, StoryObj } from '@storybook/react-vite';
import { TimePicker } from './time-picker';

const meta = {
  title: 'UI/TimePicker',
  component: typeof TimePicker !== 'undefined' ? TimePicker : undefined,
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
