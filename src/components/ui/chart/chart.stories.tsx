import type { Meta, StoryObj } from '@storybook/react-vite';
import { ChartContainer } from './chart';

const meta = {
  title: 'UI/ChartContainer',
  component: typeof ChartContainer !== 'undefined' ? ChartContainer : undefined,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {},
} satisfies Meta<any>;

export default meta;

export const Default: StoryObj<typeof meta> = {
  args: {},
};
