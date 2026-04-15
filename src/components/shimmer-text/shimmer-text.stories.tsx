import type { Meta, StoryObj } from '@storybook/react-vite';
import { TextShimmer } from './shimmer-text';

const meta = {
  title: 'UI/TextShimmer',
  component: typeof TextShimmer !== 'undefined' ? TextShimmer : undefined,
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
