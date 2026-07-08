import type { Meta, StoryObj } from '@storybook/react-vite';
import type { ChartConfig } from './core/chart';
import { AreaChart } from './area-chart';

const chartData = [
  { month: 'Jan', bookings: 186, cancellations: 24 },
  { month: 'Feb', bookings: 305, cancellations: 42 },
  { month: 'Mar', bookings: 237, cancellations: 31 },
  { month: 'Apr', bookings: 273, cancellations: 18 },
  { month: 'May', bookings: 209, cancellations: 27 },
  { month: 'Jun', bookings: 314, cancellations: 22 },
  { month: 'Jul', bookings: 289, cancellations: 35 },
  { month: 'Aug', bookings: 342, cancellations: 29 },
];

const chartConfig = {
  bookings: {
    label: 'Bookings',
    colors: {
      light: ['var(--primary)'],
      dark: ['var(--primary)'],
    },
  },
  cancellations: {
    label: 'Cancellations',
    colors: {
      light: ['var(--color-zinc-400)'],
      dark: ['var(--color-zinc-600)'],
    },
  },
} satisfies ChartConfig;

const meta: Meta<typeof AreaChart> = {
  title: 'Charts/AreaChart',
  component: AreaChart,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
};

export default meta;

type Story = StoryObj;

export const Default: Story = {
  render: () => (
    <AreaChart
      chartConfig={chartConfig}
      data={chartData}
      xDataKey="month"
      className="aspect-auto h-80 w-full"
    />
  ),
};

export const Stacked: Story = {
  render: () => (
    <AreaChart
      chartConfig={chartConfig}
      data={chartData}
      xDataKey="month"
      stackType="stacked"
      className="aspect-auto h-80 w-full"
    />
  ),
};

export const SolidWithDots: Story = {
  render: () => (
    <AreaChart
      chartConfig={chartConfig}
      data={chartData}
      xDataKey="month"
      areaVariant="solid"
      strokeVariant="solid"
      dotVariant="default"
      className="aspect-auto h-80 w-full"
    />
  ),
};

export const WithBrush: Story = {
  render: () => (
    <AreaChart
      chartConfig={chartConfig}
      data={chartData}
      xDataKey="month"
      showBrush
      className="aspect-auto h-96 w-full"
    />
  ),
};

export const Clickable: Story = {
  render: () => (
    <AreaChart
      chartConfig={chartConfig}
      data={chartData}
      xDataKey="month"
      isClickable
      className="aspect-auto h-80 w-full"
    />
  ),
};

export const Loading: Story = {
  render: () => (
    <AreaChart
      chartConfig={chartConfig}
      data={chartData}
      xDataKey="month"
      isLoading
      className="aspect-auto h-80 w-full"
    />
  ),
};
