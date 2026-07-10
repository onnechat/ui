import type { ComponentProps } from 'react';
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

// O componente é genérico e as props têm união clicável/não-clicável, o que
// colapsa a inferência de args do Storybook. Instanciamos os genéricos e
// achatamos a união para os controls.
type BarChartProps = Omit<
  ComponentProps<
    typeof BarChart<Record<string, unknown>, Record<string, ChartConfig[string]>>
  >,
  'isClickable' | 'onSelectionChange'
> & {
  isClickable?: boolean;
  onSelectionChange?: (selectedDataKey: string | null) => void;
};

const meta: Meta<BarChartProps> = {
  title: 'Charts/BarChart',
  component: BarChart as Meta<BarChartProps>['component'],
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
  argTypes: {
    chartConfig: {
      control: false,
      description:
        'Configuração das séries: mapeia cada chave dos dados para `{ label, colors: { light: string[], dark: string[] } }`.',
      table: { category: 'Dados' },
    },
    data: {
      control: false,
      description:
        'Array de objetos com os pontos do gráfico. As chaves das séries devem existir no `chartConfig`.',
      table: { category: 'Dados' },
    },
    xDataKey: {
      control: 'text',
      description: 'Chave dos dados exibida no eixo X.',
      table: { category: 'Dados' },
    },
    yDataKey: {
      control: 'text',
      description: 'Chave dos dados exibida no eixo Y.',
      table: { category: 'Dados' },
    },
    chartProps: {
      control: false,
      description: 'Props extras repassadas ao `<BarChart>` do recharts.',
      table: { category: 'Dados' },
    },
    xAxisProps: {
      control: false,
      description: 'Props extras repassadas ao `<XAxis>` do recharts.',
      table: { category: 'Dados' },
    },
    yAxisProps: {
      control: false,
      description: 'Props extras repassadas ao `<YAxis>` do recharts.',
      table: { category: 'Dados' },
    },
    tooltipContentProps: {
      control: false,
      description: 'Props extras repassadas ao conteúdo do tooltip.',
      table: { category: 'Dados' },
    },
    glowingBars: {
      control: false,
      description:
        'Chaves numéricas das séries que recebem efeito de brilho (glow).',
      table: { category: 'Dados' },
    },
    barVariant: {
      control: 'select',
      options: [
        'default',
        'hatched',
        'duotone',
        'duotone-reverse',
        'gradient',
        'stripped',
      ],
      description: 'Padrão de preenchimento das barras.',
      table: {
        category: 'Aparência',
        defaultValue: { summary: "'default'" },
      },
    },
    layout: {
      control: 'inline-radio',
      options: ['vertical', 'horizontal'],
      description: 'Orientação das barras.',
      table: {
        category: 'Aparência',
        defaultValue: { summary: "'vertical'" },
      },
    },
    barRadius: {
      control: 'number',
      description: 'Raio de arredondamento das barras.',
      table: {
        category: 'Aparência',
        defaultValue: { summary: '2' },
      },
    },
    barGap: {
      control: 'number',
      description: 'Espaço, em pixels, entre barras da mesma categoria.',
      table: { category: 'Aparência' },
    },
    barCategoryGap: {
      control: 'number',
      description: 'Espaço, em pixels, entre categorias de barras.',
      table: { category: 'Aparência' },
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
    backgroundVariant: {
      control: 'select',
      options: [
        'dots',
        'grid',
        'cross-hatch',
        'diagonal-lines',
        'plus',
        'falling-triangles',
        '4-pointed-star',
        'tiny-checkers',
        'overlapping-circles',
        'wiggle-lines',
        'bubbles',
      ],
      description: 'Padrão decorativo de fundo; substitui a grade cartesiana.',
      table: { category: 'Aparência' },
    },
    tickGap: {
      control: 'number',
      description: 'Espaçamento mínimo entre ticks dos eixos.',
      table: {
        category: 'Aparência',
        defaultValue: { summary: '8' },
      },
    },
    hideTooltip: {
      control: 'boolean',
      description: 'Oculta o tooltip.',
      table: {
        category: 'Aparência',
        defaultValue: { summary: 'false' },
      },
    },
    hideCartesianGrid: {
      control: 'boolean',
      description: 'Oculta a grade cartesiana.',
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
    tooltipCursorStrokeWidth: {
      control: 'number',
      description: 'Espessura do contorno do cursor do tooltip.',
      table: {
        category: 'Aparência',
        defaultValue: { summary: '1' },
      },
    },
    brushHeight: {
      control: 'number',
      description: 'Altura, em pixels, da régua de zoom (brush).',
      table: { category: 'Aparência' },
    },
    className: {
      control: 'text',
      description: 'Classes extras aplicadas ao container do gráfico.',
      table: { category: 'Aparência' },
    },
    stackType: {
      control: 'inline-radio',
      options: ['default', 'stacked', 'percent'],
      description:
        'Empilhamento das séries: lado a lado, empilhadas ou normalizadas em 100%.',
      table: {
        category: 'Comportamento',
        defaultValue: { summary: "'default'" },
      },
    },
    isClickable: {
      control: 'boolean',
      description:
        'Permite selecionar uma série clicando na barra ou na legenda.',
      table: {
        category: 'Comportamento',
        defaultValue: { summary: 'false' },
      },
    },
    enableHoverHighlight: {
      control: 'boolean',
      description: 'Realça a barra sob o cursor.',
      table: {
        category: 'Comportamento',
        defaultValue: { summary: 'false' },
      },
    },
    enableBufferBar: {
      control: 'boolean',
      description:
        'Renderiza as barras do último ponto com estilo hachurado (dados parciais).',
      table: {
        category: 'Comportamento',
        defaultValue: { summary: 'false' },
      },
    },
    showBrush: {
      control: 'boolean',
      description: 'Exibe a régua de zoom (brush) abaixo do gráfico.',
      table: {
        category: 'Comportamento',
        defaultValue: { summary: 'false' },
      },
    },
    brushFormatLabel: {
      control: false,
      description: 'Formata os rótulos exibidos nas alças do brush.',
      table: { category: 'Comportamento' },
    },
    tooltipDefaultIndex: {
      control: 'number',
      description: 'Índice do ponto com tooltip aberto inicialmente.',
      table: { category: 'Comportamento' },
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
    loadingBars: {
      control: 'number',
      description: 'Quantidade de barras geradas para o skeleton de loading.',
      table: {
        category: 'Estado',
        defaultValue: { summary: '12' },
      },
    },
    defaultSelectedDataKey: {
      control: false,
      description: 'Série selecionada inicialmente, no modo não controlado.',
      table: { category: 'Estado' },
    },
    onSelectionChange: {
      control: false,
      description:
        'Callback disparado quando a série selecionada muda (requer `isClickable`).',
      table: { category: 'Estado' },
    },
    onBrushChange: {
      control: false,
      description: 'Callback disparado quando o intervalo do brush muda.',
      table: { category: 'Estado' },
    },
  },
  args: {
    chartConfig,
    data: chartData,
    xDataKey: 'month',
    barVariant: 'default',
    stackType: 'default',
    layout: 'vertical',
    barRadius: 2,
    isClickable: false,
    isLoading: false,
    showBrush: false,
    className: 'aspect-auto h-80 w-full',
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Gradient: Story = {
  args: {
    chartConfig: singleSeriesConfig,
    yDataKey: 'bookings',
    barVariant: 'gradient',
    barRadius: 8,
    hideLegend: true,
  },
};

export const Stacked: Story = {
  args: {
    stackType: 'stacked',
    barRadius: 4,
  },
};

export const Duotone: Story = {
  args: {
    chartConfig: singleSeriesConfig,
    yDataKey: 'bookings',
    barVariant: 'duotone',
    hideLegend: true,
  },
};

export const Loading: Story = {
  args: {
    chartConfig: singleSeriesConfig,
    yDataKey: 'bookings',
    isLoading: true,
    hideLegend: true,
  },
};
