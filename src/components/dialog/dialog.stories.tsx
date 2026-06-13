import type { Meta, StoryObj } from '@storybook/react-vite';
import { Dialog } from './dialog';

const meta: Meta<typeof Dialog> = {
  title: 'UI/Dialog (Compound)',
  component: Dialog,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;

export const Default: StoryObj<typeof meta> = {
  args: {
    title: 'Dialog Title',
    description: 'Dialog Description',
    actions: [
      {
        label: 'Cancel',
        onClick: () => {},
      },
    ],
    children: 'Dialog Content',
  },
};
