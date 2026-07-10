import type { ComponentProps } from 'react';
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

// O componente é genérico e as props têm união clicável/não-clicável, o que
// colapsa a inferência de args do Storybook. Instanciamos os genéricos e
// achatamos a união para os controls.
type PieChartProps = Omit<
  ComponentProps<
    typeof PieChart<Record<string, unknown>, Record<string, ChartConfig[string]>>
  >,
  'isClickable' | 'onSelectionChange'
> & {
  isClickable?: boolean;
  onSelectionChange?: (selectedDataKey: string | null) => void;
};

const meta: Meta<PieChartProps> = {
  title: 'Charts/PieChart',
  component: PieChart as Meta<PieChartProps>['component'],
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    chartConfig: {
      control: false,
      description:
        'Configuração das fatias, chaveada pelos valores de `data[nameKey]`: cada entrada define `{ label, colors: { light: string[], dark: string[] } }`.',
      table: { category: 'Dados' },
    },
    data: {
      control: false,
      description:
        'Array de objetos com uma linha por fatia, contendo os campos `dataKey` e `nameKey`.',
      table: { category: 'Dados' },
    },
    dataKey: {
      control: 'text',
      description: 'Campo numérico de cada linha que dimensiona a fatia.',
      table: { category: 'Dados' },
    },
    nameKey: {
      control: 'text',
      description:
        'Campo categórico que nomeia a fatia (e sua chave no `chartConfig`).',
      table: { category: 'Dados' },
    },
    chartProps: {
      control: false,
      description: 'Props extras repassadas ao `<PieChart>` do recharts.',
      table: { category: 'Dados' },
    },
    pieProps: {
      control: false,
      description: 'Props extras repassadas ao `<Pie>` do recharts.',
      table: { category: 'Dados' },
    },
    tooltipContentProps: {
      control: false,
      description: 'Props extras repassadas ao conteúdo do tooltip.',
      table: { category: 'Dados' },
    },
    pieVariant: {
      control: 'inline-radio',
      options: ['default', 'donut'],
      description: 'Pizza cheia ou rosca (donut) com centro vazado.',
      table: {
        category: 'Aparência',
        defaultValue: { summary: "'default'" },
      },
    },
    paddingAngle: {
      control: 'number',
      description: 'Ângulo, em graus, entre as fatias.',
      table: {
        category: 'Aparência',
        defaultValue: { summary: '2' },
      },
    },
    cornerRadius: {
      control: 'number',
      description: 'Raio de arredondamento das pontas de cada fatia.',
      table: {
        category: 'Aparência',
        defaultValue: { summary: '4' },
      },
    },
    legendVariant: {
      control: 'select',
      options: [
        'square',
        'circle',
        'circle-outline',
        'rounded-square',
        'rounded-square-outline',
        'vertical-bar',
        'horizontal-bar',
      ],
      description: 'Formato do marcador de cor na legenda.',
      table: { category: 'Aparência' },
    },
    hideTooltip: {
      control: 'boolean',
      description: 'Oculta o tooltip.',
      table: {
        category: 'Aparência',
        defaultValue: { summary: 'false' },
      },
    },
    hideLegend: {
      control: 'boolean',
      description: 'Oculta a legenda.',
      table: {
        category: 'Aparência',
        defaultValue: { summary: 'false' },
      },
    },
    tooltipRoundness: {
      control: 'select',
      options: ['sm', 'md', 'lg', 'xl'],
      description: 'Raio de borda do tooltip.',
      table: { category: 'Aparência' },
    },
    tooltipVariant: {
      control: 'inline-radio',
      options: ['default', 'frosted-glass'],
      description: 'Estilo visual do tooltip.',
      table: { category: 'Aparência' },
    },
    className: {
      control: 'text',
      description: 'Classes extras aplicadas ao container do gráfico.',
      table: { category: 'Aparência' },
    },
    centerLabel: {
      control: 'text',
      description: 'Rótulo central, exibido apenas na variante `donut`.',
      table: { category: 'Conteúdo' },
    },
    centerValue: {
      control: 'text',
      description: 'Valor central, exibido apenas na variante `donut`.',
      table: { category: 'Conteúdo' },
    },
    isClickable: {
      control: 'boolean',
      description: 'Permite selecionar uma fatia clicando nela ou na legenda.',
      table: {
        category: 'Comportamento',
        defaultValue: { summary: 'false' },
      },
    },
    tooltipAnimationDuration: {
      control: 'number',
      description: 'Duração, em ms, da animação do tooltip.',
      table: { category: 'Comportamento' },
    },
    isLoading: {
      control: 'boolean',
      description: 'Exibe o skeleton animado no lugar dos dados.',
      table: {
        category: 'Estado',
        defaultValue: { summary: 'false' },
      },
    },
    loadingSlices: {
      control: 'number',
      description: 'Quantidade de fatias geradas para o skeleton de loading.',
      table: {
        category: 'Estado',
        defaultValue: { summary: '5' },
      },
    },
    defaultSelectedDataKey: {
      control: false,
      description: 'Fatia selecionada inicialmente, no modo não controlado.',
      table: { category: 'Estado' },
    },
    onSelectionChange: {
      control: false,
      description:
        'Callback disparado quando a fatia selecionada muda (requer `isClickable`).',
      table: { category: 'Estado' },
    },
  },
  args: {
    chartConfig,
    data: chartData,
    dataKey: 'total',
    nameKey: 'service',
    pieVariant: 'default',
    paddingAngle: 2,
    cornerRadius: 4,
    isClickable: false,
    isLoading: false,
    className: 'aspect-square h-80',
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Donut: Story = {
  args: {
    pieVariant: 'donut',
    centerValue: '970',
    centerLabel: 'Appointments',
  },
};

export const Clickable: Story = {
  args: {
    pieVariant: 'donut',
    isClickable: true,
  },
};

export const WithoutLegend: Story = {
  args: {
    hideLegend: true,
    className: 'aspect-square h-72',
  },
};

export const Loading: Story = {
  args: {
    pieVariant: 'donut',
    isLoading: true,
  },
};
