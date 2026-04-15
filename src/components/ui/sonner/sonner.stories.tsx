import type { Meta, StoryObj } from '@storybook/react-vite';
import { Sonner } from './sonner';

const meta = {
  title: 'UI/Sonner',
  component: typeof Sonner !== 'undefined' ? Sonner : undefined,
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
