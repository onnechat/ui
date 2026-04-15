import type { Meta, StoryObj } from '@storybook/react-vite';
import { Dialog } from './dialog';

const meta = {
  title: 'UI/Dialog',
  component: typeof Dialog !== 'undefined' ? Dialog : undefined,
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
