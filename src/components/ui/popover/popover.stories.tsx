import type { Meta, StoryObj } from '@storybook/react-vite';
import { Popover } from './popover';

const meta = {
  title: 'UI/Popover',
  component: typeof Popover !== 'undefined' ? Popover : undefined,
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
