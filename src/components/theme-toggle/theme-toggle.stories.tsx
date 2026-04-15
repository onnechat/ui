import type { Meta, StoryObj } from '@storybook/react-vite';
import { ThemeToggle } from './theme-toggle';

const meta = {
  title: 'UI/ThemeToggle',
  component: typeof ThemeToggle !== 'undefined' ? ThemeToggle : undefined,
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
