import type { Meta, StoryObj } from '@storybook/react-vite';
import { Loader } from './loader';

const meta = {
  title: 'UI/Loader',
  component: typeof Loader !== 'undefined' ? Loader : undefined,
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
