import type { Meta, StoryObj } from '@storybook/react-vite';
import { TextShimmer } from './shimmer-text';

const meta: Meta<typeof TextShimmer> = {
  title: 'UI/TextShimmer',
  component: TextShimmer,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;

export const Default: StoryObj<typeof meta> = {
  args: {},
};
