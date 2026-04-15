import type { Meta, StoryObj } from '@storybook/react-vite';
import { HoverCard } from './hover-card';

const meta = {
  title: 'UI/HoverCard',
  component: typeof HoverCard !== 'undefined' ? HoverCard : undefined,
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
