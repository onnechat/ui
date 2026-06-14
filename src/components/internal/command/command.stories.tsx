import type { Meta, StoryObj } from '@storybook/react-vite';
import { Command } from './command';

const meta: Meta<typeof Command> = {
  title: 'Internal/Command',
  component: Command,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;

export const Default: StoryObj<typeof meta> = {
  args: {},
};
