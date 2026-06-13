import type { Meta, StoryObj } from '@storybook/react-vite';
import { Tracker } from './tracker';

const meta: Meta<typeof Tracker> = {
  title: 'UI/Tracker',
  component: Tracker,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;

export const Default: StoryObj<typeof meta> = {
  args: {},
};
