import type { Meta, StoryObj } from '@storybook/react-vite';
import { Slider } from './slider';

const meta: Meta<typeof Slider> = {
  title: 'UI/Slider',
  component: Slider,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs', 'new'],
};

export default meta;

export const Default: StoryObj<typeof meta> = {
  args: {
    defaultValue: 40,
    className: 'w-64',
  },
};

export const WithMinMax: StoryObj<typeof meta> = {
  args: {
    defaultValue: 25,
    min: 0,
    max: 50,
    className: 'w-64',
  },
};

export const Disabled: StoryObj<typeof meta> = {
  args: {
    defaultValue: 60,
    disabled: true,
    className: 'w-64',
  },
};
