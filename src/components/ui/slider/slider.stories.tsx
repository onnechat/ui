import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, waitFor } from 'storybook/test';

import { Slider } from './slider';

const meta: Meta<typeof Slider> = {
  title: 'UI/Slider',
  component: Slider,
  subcomponents: {
    'Slider.Control': Slider.Control,
    'Slider.Track': Slider.Track,
    'Slider.Indicator': Slider.Indicator,
    'Slider.Thumb': Slider.Thumb,
  } as Meta<typeof Slider>['subcomponents'],
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs', 'new'],
  argTypes: {
    defaultValue: {
      control: 'number',
      description:
        'Valor inicial no modo não controlado (aplicado na montagem). Use `number[]` para range com múltiplos thumbs.',
      table: { category: 'Estado' },
    },
    value: {
      control: false,
      description: 'Valor no modo controlado. `number` ou `number[]`.',
      table: { category: 'Estado' },
    },
    onValueChange: {
      control: false,
      description:
        'Callback disparado durante o arraste, a cada mudança de valor.',
      table: { category: 'Estado' },
    },
    onValueCommitted: {
      control: false,
      description: 'Callback disparado ao soltar o thumb, com o valor final.',
      table: { category: 'Estado' },
    },
    min: {
      control: 'number',
      description: 'Valor mínimo do slider.',
      table: { category: 'Comportamento', defaultValue: { summary: '0' } },
    },
    max: {
      control: 'number',
      description: 'Valor máximo do slider.',
      table: { category: 'Comportamento', defaultValue: { summary: '100' } },
    },
    step: {
      control: 'number',
      description: 'Incremento entre valores válidos.',
      table: { category: 'Comportamento', defaultValue: { summary: '1' } },
    },
    disabled: {
      control: 'boolean',
      description: 'Desabilita a interação com o slider.',
      table: { category: 'Comportamento', defaultValue: { summary: 'false' } },
    },
    orientation: {
      control: 'inline-radio',
      options: ['horizontal', 'vertical'],
      description: 'Orientação do slider.',
      table: {
        category: 'Aparência',
        defaultValue: { summary: "'horizontal'" },
      },
    },
    className: {
      control: 'text',
      description: 'Classes extras aplicadas ao container raiz.',
      table: { category: 'Aparência' },
    },
  },
  args: {
    defaultValue: 40,
    min: 0,
    max: 100,
    step: 1,
    disabled: false,
    className: 'w-64',
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

// O thumb precisa de rótulo acessível — o input escondido dentro dele é um
// campo de formulário para leitores de tela.
const renderSlider: Story['render'] = args => (
  <Slider {...args}>
    <Slider.Thumb aria-label="Value" />
  </Slider>
);

export const Playground: Story = {
  render: renderSlider,
  play: async ({ canvas, userEvent }) => {
    const slider = canvas.getByRole('slider');
    await expect(slider).toHaveAttribute('aria-valuenow', '40');

    slider.focus();
    await userEvent.keyboard('{ArrowRight}');
    await waitFor(() => expect(slider).toHaveAttribute('aria-valuenow', '41'));

    await userEvent.keyboard('{ArrowLeft}');
    await waitFor(() => expect(slider).toHaveAttribute('aria-valuenow', '40'));
  },
};

export const WithMinMax: Story = {
  args: {
    defaultValue: 25,
    min: 0,
    max: 50,
  },
  render: renderSlider,
};

export const Disabled: Story = {
  args: {
    defaultValue: 60,
    disabled: true,
  },
  render: renderSlider,
};
