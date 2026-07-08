import type { Meta, StoryObj } from '@storybook/react-vite';
import type { ChartConfig } from './core/chart';
import { PieChart } from './pie-chart';

const chartData = [
  { service: 'haircut', total: 412 },
  { service: 'beard', total: 287 },
  { service: 'coloring', total: 173 },
  { service: 'treatment', total: 98 },
];

const chartConfig = {
  haircut: {
    label: 'Haircut',
    colors: {
      light: ['var(--primary)'],
      dark: ['var(--primary)'],
    },
  },
  beard: {
    label: 'Beard',
    colors: {
      light: ['var(--color-rose-400)'],
      dark: ['var(--color-rose-500)'],
    },
  },
  coloring: {
    label: 'Coloring',
    colors: {
      light: ['var(--color-zinc-400)'],
      dark: ['var(--color-zinc-500)'],
    },
  },
  treatment: {
    label: 'Treatment',
    colors: {
      light: ['var(--color-zinc-300)'],
      dark: ['var(--color-zinc-700)'],
    },
  },
} satisfies ChartConfig;

const meta: Meta<typeof PieChart> = {
  title: 'Charts/PieChart',
  component: PieChart,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;

type Story = StoryObj;

export const Default: Story = {
  render: () => (
    <PieChart
      chartConfig={chartConfig}
      data={chartData}
      dataKey="total"
      nameKey="service"
      className="aspect-square h-80"
    />
  ),
};

export const Donut: Story = {
  render: () => (
    <PieChart
      chartConfig={chartConfig}
      data={chartData}
      dataKey="total"
      nameKey="service"
      pieVariant="donut"
      centerValue="970"
      centerLabel="Appointments"
      className="aspect-square h-80"
    />
  ),
};

export const Clickable: Story = {
  render: () => (
    <PieChart
      chartConfig={chartConfig}
      data={chartData}
      dataKey="total"
      nameKey="service"
      pieVariant="donut"
      isClickable
      className="aspect-square h-80"
    />
  ),
};

export const WithoutLegend: Story = {
  render: () => (
    <PieChart
      chartConfig={chartConfig}
      data={chartData}
      dataKey="total"
      nameKey="service"
      hideLegend
      className="aspect-square h-72"
    />
  ),
};

export const Loading: Story = {
  render: () => (
    <PieChart
      chartConfig={chartConfig}
      data={chartData}
      dataKey="total"
      nameKey="service"
      pieVariant="donut"
      isLoading
      className="aspect-square h-80"
    />
  ),
};
