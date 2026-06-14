import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  Bar,
  BarChart,
  CartesianGrid,
  LabelList,
  Line,
  LineChart,
  XAxis,
  YAxis,
} from 'recharts'
import {
  Chart,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from './chart'

const meta: Meta<typeof Chart> = {
  title: 'UI/Chart',
  component: Chart,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
}

export default meta

const CHART_DATA = [
  { month: 'Jan', desktop: 186, mobile: 80 },
  { month: 'Feb', desktop: 305, mobile: 200 },
  { month: 'Mar', desktop: 237, mobile: 120 },
  { month: 'Apr', desktop: 73, mobile: 190 },
  { month: 'May', desktop: 209, mobile: 130 },
  { month: 'Jun', desktop: 214, mobile: 140 },
]

const CHART_CONFIG = {
  desktop: { label: 'Desktop', color: 'hsl(var(--chart-1))' },
  mobile: { label: 'Mobile', color: 'hsl(var(--chart-2))' },
}

export const BarExample: StoryObj = {
  render: () => (
    <Chart config={CHART_CONFIG} className="min-h-[300px] w-full max-w-lg">
      <BarChart data={CHART_DATA}>
        <CartesianGrid vertical={false} />
        <XAxis dataKey="month" tickLine={false} axisLine={false} />
        <ChartTooltip content={<ChartTooltipContent />} />
        <ChartLegend content={<ChartLegendContent />} />
        <Bar dataKey="desktop" fill="var(--color-desktop)" radius={4} />
        <Bar dataKey="mobile" fill="var(--color-mobile)" radius={4} />
      </BarChart>
    </Chart>
  ),
}

export const LineExample: StoryObj = {
  render: () => (
    <Chart config={CHART_CONFIG} className="min-h-[300px] w-full max-w-lg">
      <LineChart data={CHART_DATA}>
        <CartesianGrid vertical={false} />
        <XAxis dataKey="month" tickLine={false} axisLine={false} />
        <ChartTooltip content={<ChartTooltipContent />} />
        <ChartLegend content={<ChartLegendContent />} />
        <Line
          dataKey="desktop"
          stroke="var(--color-desktop)"
          strokeWidth={2}
          dot={{ fill: 'var(--color-desktop)' }}
        />
        <Line
          dataKey="mobile"
          stroke="var(--color-mobile)"
          strokeWidth={2}
          dot={{ fill: 'var(--color-mobile)' }}
        />
      </LineChart>
    </Chart>
  ),
}

export const WithLabels: StoryObj = {
  render: () => (
    <Chart config={CHART_CONFIG} className="min-h-[300px] w-full max-w-lg">
      <BarChart data={CHART_DATA}>
        <CartesianGrid vertical={false} />
        <XAxis dataKey="month" tickLine={false} axisLine={false} />
        <ChartTooltip content={<ChartTooltipContent />} />
        <Bar dataKey="desktop" fill="var(--color-desktop)" radius={4}>
          <LabelList
            dataKey="desktop"
            position="top"
            className="fill-foreground"
            fontSize={11}
          />
        </Bar>
        <Bar dataKey="mobile" fill="var(--color-mobile)" radius={4}>
          <LabelList
            dataKey="mobile"
            position="top"
            className="fill-foreground"
            fontSize={11}
          />
        </Bar>
      </BarChart>
    </Chart>
  ),
}
