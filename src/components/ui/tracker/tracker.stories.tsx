import type { Meta, StoryObj } from '@storybook/react-vite';
import { Tracker } from './tracker';

const meta = {
  title: 'UI/Tracker',
  component: typeof Tracker !== 'undefined' ? Tracker : undefined,
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
