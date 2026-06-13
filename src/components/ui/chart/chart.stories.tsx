import type { Meta, StoryObj } from '@storybook/react-vite';
import { ChartContainer } from './chart';

const meta: Meta<typeof ChartContainer> = {
  title: 'UI/ChartContainer',
  component: ChartContainer,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;

export const Default: StoryObj<typeof meta> = {
  args: {},
};
