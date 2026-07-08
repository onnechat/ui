import type { Meta, StoryObj } from '@storybook/react-vite';
import type { ChartConfig } from './core/chart';
import { LineChart } from './line-chart';

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

const meta: Meta<typeof LineChart> = {
  title: 'Charts/LineChart',
  component: LineChart,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
};

export default meta;

type Story = StoryObj;

export const Default: Story = {
  render: () => (
    <LineChart
      chartConfig={chartConfig}
      data={chartData}
      xDataKey="month"
      className="aspect-auto h-80 w-full"
    />
  ),
};

export const WithDots: Story = {
  render: () => (
    <LineChart
      chartConfig={chartConfig}
      data={chartData}
      xDataKey="month"
      strokeVariant="solid"
      dotVariant="default"
      className="aspect-auto h-80 w-full"
    />
  ),
};

export const CurvedClickable: Story = {
  render: () => (
    <LineChart
      chartConfig={chartConfig}
      data={chartData}
      xDataKey="month"
      curveType="monotone"
      isClickable
      className="aspect-auto h-80 w-full"
    />
  ),
};

export const WithBrush: Story = {
  render: () => (
    <LineChart
      chartConfig={chartConfig}
      data={chartData}
      xDataKey="month"
      showBrush
      className="aspect-auto h-96 w-full"
    />
  ),
};

export const Loading: Story = {
  render: () => (
    <LineChart
      chartConfig={chartConfig}
      data={chartData}
      xDataKey="month"
      isLoading
      className="aspect-auto h-80 w-full"
    />
  ),
};
