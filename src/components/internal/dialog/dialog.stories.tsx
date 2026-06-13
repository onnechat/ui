import type { Meta, StoryObj } from '@storybook/react-vite';
import { Dialog } from './dialog';

const meta: Meta<typeof Dialog> = {
  title: 'Internal/Dialog',
  component: Dialog,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;

export const Default: StoryObj<typeof meta> = {
  args: {},
};
