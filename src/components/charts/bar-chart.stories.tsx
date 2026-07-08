import type { Meta, StoryObj } from '@storybook/react-vite';
import type { ChartConfig } from './core/chart';
import { BarChart } from './bar-chart';

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

const singleSeriesConfig = {
  bookings: {
    label: 'Bookings',
    colors: {
      light: ['var(--primary)'],
      dark: ['var(--primary)'],
    },
  },
} satisfies ChartConfig;

const meta: Meta<typeof BarChart> = {
  title: 'Charts/BarChart',
  component: BarChart,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
};

export default meta;

type Story = StoryObj;

export const Default: Story = {
  render: () => (
    <BarChart
      chartConfig={chartConfig}
      data={chartData}
      xDataKey="month"
      className="aspect-auto h-80 w-full"
    />
  ),
};

export const Gradient: Story = {
  render: () => (
    <BarChart
      chartConfig={singleSeriesConfig}
      data={chartData}
      xDataKey="month"
      yDataKey="bookings"
      barVariant="gradient"
      barRadius={8}
      hideLegend
      className="aspect-auto h-80 w-full"
    />
  ),
};

export const Stacked: Story = {
  render: () => (
    <BarChart
      chartConfig={chartConfig}
      data={chartData}
      xDataKey="month"
      stackType="stacked"
      barRadius={4}
      className="aspect-auto h-80 w-full"
    />
  ),
};

export const Duotone: Story = {
  render: () => (
    <BarChart
      chartConfig={singleSeriesConfig}
      data={chartData}
      xDataKey="month"
      yDataKey="bookings"
      barVariant="duotone"
      hideLegend
      className="aspect-auto h-80 w-full"
    />
  ),
};

export const Loading: Story = {
  render: () => (
    <BarChart
      chartConfig={singleSeriesConfig}
      data={chartData}
      xDataKey="month"
      yDataKey="bookings"
      isLoading
      hideLegend
      className="aspect-auto h-80 w-full"
    />
  ),
};
