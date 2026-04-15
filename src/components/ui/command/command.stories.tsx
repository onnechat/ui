import type { Meta, StoryObj } from '@storybook/react-vite';
import { Command } from './command';

const meta = {
  title: 'UI/Command',
  component: typeof Command !== 'undefined' ? Command : undefined,
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
