import type { Meta, StoryObj } from '@storybook/react-vite';
import { Sidebar } from './sidebar';

const meta = {
  title: 'UI/Sidebar',
  component: typeof Sidebar !== 'undefined' ? Sidebar : undefined,
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
