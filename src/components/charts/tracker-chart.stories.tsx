import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect } from 'storybook/test';
import { TrackerChart } from './tracker-chart';

const COLORS = [
  'var(--color-emerald-600)',
  'var(--color-emerald-500)',
  'var(--color-emerald-400)',
  'var(--color-emerald-300)',
];

const meta: Meta<typeof TrackerChart> = {
  title: 'Charts/TrackerChart',
  component: TrackerChart,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    data: { table: { disable: true } },
  },
  args: {
    className: 'w-full min-w-(--container-md) max-w-(--container-md)',
    data: Array.from({ length: 12 }, (_, i) => ({
      key: i,
      color: COLORS[i % COLORS.length],
      tooltip: `Day ${i + 1}`,
    })),
  },
};

export default meta;

function generateData(days: number) {
  return Array.from({ length: days }, (_, i) => ({
    key: i,
    color: COLORS[Math.floor(Math.random() * COLORS.length)],
    tooltip: `Day ${i + 1}: ${Math.floor(Math.random() * 10)} activities`,
  }));
}

export const Default: StoryObj<typeof meta> = {
  args: {
    data: generateData(60),
  },
  play: async ({ canvas }) => {
    const buttons = canvas.getAllByRole('button');
    await expect(buttons.length).toBeGreaterThan(0);
  },
};

export const Empty: StoryObj<typeof meta> = {
  args: {
    data: [],
    className: 'w-[480px] h-10',
  },
};

export const DisabledTooltips: StoryObj<typeof meta> = {
  args: {
    data: generateData(30),
    disabledTooltip: true,
  },
};

export const SingleColor: StoryObj<typeof meta> = {
  args: {
    data: Array.from({ length: 20 }, (_, i) => ({
      key: i,
      color: COLORS[0],
      tooltip: `Event ${i + 1}`,
    })),
  },
};

export const Long: StoryObj<typeof meta> = {
  args: {
    data: generateData(120),
    className: 'w-[800px]',
  },
};

export const Loading: StoryObj<typeof meta> = {
  args: {
    data: [],
    isLoading: true,
  },
};
