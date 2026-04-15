import type { Meta, StoryObj } from '@storybook/react-vite';
import { ThemeColor } from './theme-color';

const meta = {
  title: 'UI/ThemeColor',
  component: typeof ThemeColor !== 'undefined' ? ThemeColor : undefined,
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
