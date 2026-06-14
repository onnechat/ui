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
  args: {
    config: {
      desktop: { label: 'Desktop', color: 'hsl(var(--chart-1))' },
    },
    className: 'min-h-[200px] w-full min-w-(--container-md) max-w-(--container-md)',
  },
};
