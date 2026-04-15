import type { Meta, StoryObj } from '@storybook/react-vite';
import { Logo } from './logo';

const meta = {
  title: 'UI/Logo',
  component: typeof Logo !== 'undefined' ? Logo : undefined,
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
