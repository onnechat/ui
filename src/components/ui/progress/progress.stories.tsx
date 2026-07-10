import type { Meta, StoryObj } from '@storybook/react-vite';

import { Progress } from './progress';

const meta: Meta<typeof Progress> = {
  title: 'UI/Progress',
  component: Progress,
  subcomponents: {
    'Progress.Label': Progress.Label,
    'Progress.Value': Progress.Value,
    'Progress.Track': Progress.Track,
    'Progress.Indicator': Progress.Indicator,
  } as Meta<typeof Progress>['subcomponents'],
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs', 'new'],
  argTypes: {
    value: {
      control: { type: 'range', min: 0, max: 100 },
      description: 'Valor atual do progresso. Use `null` para indeterminado.',
      table: {
        category: 'Estado',
        type: { summary: 'number | null' },
        defaultValue: { summary: 'null' },
      },
    },
    min: {
      control: 'number',
      description: 'Valor mínimo da barra.',
      table: { category: 'Comportamento', defaultValue: { summary: '0' } },
    },
    max: {
      control: 'number',
      description: 'Valor máximo da barra.',
      table: { category: 'Comportamento', defaultValue: { summary: '100' } },
    },
    'aria-label': {
      control: 'text',
      description:
        'Nome acessível da barra — obrigatório quando não há `Progress.Label`.',
      table: { category: 'Comportamento' },
    },
    getAriaValueText: {
      control: false,
      description:
        'Função que gera o texto acessível (`aria-valuetext`) do valor atual.',
      table: { category: 'Comportamento' },
    },
    format: {
      control: false,
      description:
        'Opções de `Intl.NumberFormat` usadas para formatar o valor exibido.',
      table: { category: 'Conteúdo' },
    },
    locale: {
      control: false,
      description: 'Locale usado na formatação do valor.',
      table: { category: 'Conteúdo' },
    },
    children: {
      control: false,
      description:
        'Conteúdo extra, como `Progress.Label` e `Progress.Value`. O Track e o Indicator são renderizados automaticamente.',
      table: { category: 'Conteúdo' },
    },
    className: {
      control: 'text',
      description: 'Classes extras aplicadas ao container raiz.',
      table: { category: 'Aparência' },
    },
  },
  args: {
    value: 60,
    className: 'w-64',
    'aria-label': 'Progress',
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const WithLabel: Story = {
  render: () => (
    <Progress value={75} className="w-72">
      <Progress.Label>Uploading files</Progress.Label>
      <Progress.Value />
    </Progress>
  ),
};

export const Determinate: Story = {
  args: {
    value: 0,
  },
};

export const Halfway: Story = {
  args: {
    value: 50,
  },
};

export const Complete: Story = {
  args: {
    value: 100,
  },
};
