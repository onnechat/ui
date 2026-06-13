import type { Meta, StoryObj } from '@storybook/react-vite';
import { InputTime } from './input-time';

const meta: Meta<typeof InputTime> = {
  title: 'UI/InputTime',
  component: InputTime,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;

export const Date: StoryObj<typeof meta> = {
  args: { type: 'date' },
};

export const Time: StoryObj<typeof meta> = {
  args: { type: 'time' },
};

export const DateTimeLocal: StoryObj<typeof meta> = {
  args: { type: 'datetime-local' },
};
