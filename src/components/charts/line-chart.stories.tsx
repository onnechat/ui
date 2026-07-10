import type { ComponentProps } from 'react';
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

// O componente é genérico e as props têm união clicável/não-clicável, o que
// colapsa a inferência de args do Storybook. Instanciamos os genéricos e
// achatamos a união para os controls.
type LineChartProps = Omit<
  ComponentProps<
    typeof LineChart<Record<string, unknown>, Record<string, ChartConfig[string]>>
  >,
  'isClickable' | 'onSelectionChange'
> & {
  isClickable?: boolean;
  onSelectionChange?: (selectedDataKey: string | null) => void;
};

const meta: Meta<LineChartProps> = {
  title: 'Charts/LineChart',
  component: LineChart as Meta<LineChartProps>['component'],
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
      description: 'Props extras repassadas ao `<LineChart>` do recharts.',
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
    glowingLines: {
      control: false,
      description:
        'Chaves numéricas das séries que recebem efeito de brilho (glow).',
      table: { category: 'Dados' },
    },
    curveType: {
      control: 'select',
      options: [
        'linear',
        'monotone',
        'natural',
        'step',
        'stepBefore',
        'stepAfter',
        'bump',
        'basis',
      ],
      description: 'Interpolação da curva entre os pontos.',
      table: {
        category: 'Aparência',
        defaultValue: { summary: "'linear'" },
      },
    },
    strokeVariant: {
      control: 'inline-radio',
      options: ['solid', 'dashed', 'animated-dashed'],
      description: 'Estilo do traço das linhas.',
      table: {
        category: 'Aparência',
        defaultValue: { summary: "'solid'" },
      },
    },
    strokeWidth: {
      control: 'number',
      description: 'Espessura do traço das linhas.',
      table: {
        category: 'Aparência',
        defaultValue: { summary: '1' },
      },
    },
    dotVariant: {
      control: 'select',
      options: ['default', 'border', 'colored-border'],
      description: 'Estilo dos pontos em cada valor. Omitido, não há pontos.',
      table: { category: 'Aparência' },
    },
    activeDotVariant: {
      control: 'select',
      options: ['default', 'border', 'colored-border'],
      description: 'Estilo do ponto ativo sob o cursor.',
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
    hideCursorLine: {
      control: 'boolean',
      description: 'Oculta a linha vertical do cursor do tooltip.',
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
    connectNulls: {
      control: 'boolean',
      description: 'Conecta a linha através de valores nulos.',
      table: {
        category: 'Comportamento',
        defaultValue: { summary: 'false' },
      },
    },
    isClickable: {
      control: 'boolean',
      description:
        'Permite selecionar uma série clicando na linha ou na legenda.',
      table: {
        category: 'Comportamento',
        defaultValue: { summary: 'false' },
      },
    },
    enableBufferLine: {
      control: 'boolean',
      description:
        'Renderiza o último trecho da linha tracejado (dados parciais).',
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
    loadingPoints: {
      control: 'number',
      description: 'Quantidade de pontos gerados para o skeleton de loading.',
      table: {
        category: 'Estado',
        defaultValue: { summary: '14' },
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
    curveType: 'linear',
    strokeVariant: 'solid',
    connectNulls: false,
    isClickable: false,
    isLoading: false,
    showBrush: false,
    className: 'aspect-auto h-80 w-full',
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const WithDots: Story = {
  args: {
    strokeVariant: 'solid',
    dotVariant: 'default',
  },
};

export const CurvedClickable: Story = {
  args: {
    curveType: 'monotone',
    isClickable: true,
  },
};

export const WithBrush: Story = {
  args: {
    showBrush: true,
    className: 'aspect-auto h-96 w-full',
  },
};

export const Loading: Story = {
  args: {
    isLoading: true,
  },
};
