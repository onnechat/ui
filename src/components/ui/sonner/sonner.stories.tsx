import type { Meta, StoryObj } from '@storybook/react-vite';
import { Toaster } from './sonner';

const meta = {
  title: 'UI/Toaster',
  component: typeof Toaster !== 'undefined' ? Toaster : undefined,
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
