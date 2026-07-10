import type { Meta, StoryObj } from '@storybook/react-vite';
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
    data: {
      control: false,
      description:
        'Array de blocos: `{ key?, color?, tooltip?, defaultBackgroundColor? }`. Cada item vira um bloco colorido na trilha.',
      table: { category: 'Dados' },
    },
    disabledTooltip: {
      control: 'boolean',
      description: 'Desativa os tooltips e o cursor interativo dos blocos.',
      table: {
        category: 'Comportamento',
        defaultValue: { summary: 'false' },
      },
    },
    isLoading: {
      control: 'boolean',
      description: 'Exibe o skeleton animado no lugar dos blocos.',
      table: {
        category: 'Estado',
        defaultValue: { summary: 'false' },
      },
    },
    loadingBlocks: {
      control: 'number',
      description: 'Quantidade de blocos exibidos no skeleton de loading.',
      table: {
        category: 'Estado',
        defaultValue: { summary: '30' },
      },
    },
    className: {
      control: 'text',
      description: 'Classes extras aplicadas ao container da trilha.',
      table: { category: 'Aparência' },
    },
  },
  args: {
    className: 'w-full min-w-(--container-md) max-w-(--container-md)',
    disabledTooltip: false,
    isLoading: false,
    data: Array.from({ length: 12 }, (_, i) => ({
      key: i,
      color: COLORS[i % COLORS.length],
      tooltip: `Day ${i + 1}`,
    })),
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

function generateData(days: number) {
  return Array.from({ length: days }, (_, i) => ({
    key: i,
    color: COLORS[Math.floor(Math.random() * COLORS.length)],
    tooltip: `Day ${i + 1}: ${Math.floor(Math.random() * 10)} activities`,
  }));
}

export const Playground: Story = {
  args: {
    data: generateData(60),
  },
};

export const Empty: Story = {
  args: {
    data: [],
    className: 'w-[480px] h-10',
  },
};

export const DisabledTooltips: Story = {
  args: {
    data: generateData(30),
    disabledTooltip: true,
  },
};

export const SingleColor: Story = {
  args: {
    data: Array.from({ length: 20 }, (_, i) => ({
      key: i,
      color: COLORS[0],
      tooltip: `Event ${i + 1}`,
    })),
  },
};

export const Long: Story = {
  args: {
    data: generateData(120),
    className: 'w-[800px]',
  },
};

export const Loading: Story = {
  args: {
    data: [],
    isLoading: true,
  },
};
