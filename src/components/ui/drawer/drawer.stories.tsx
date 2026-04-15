import type { Meta, StoryObj } from '@storybook/react-vite';
import { Drawer } from './drawer';

const meta = {
  title: 'UI/Drawer',
  component: typeof Drawer !== 'undefined' ? Drawer : undefined,
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
