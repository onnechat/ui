import type { Meta, StoryObj } from '@storybook/react-vite';
import { Dialog } from './dialog';

const meta = {
  title: 'Components/Dialog',
  component: typeof Dialog !== 'undefined' ? Dialog : undefined,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {},
} satisfies Meta<any>;

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
