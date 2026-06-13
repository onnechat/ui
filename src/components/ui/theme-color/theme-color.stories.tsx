import type { Meta, StoryObj } from '@storybook/react-vite';
import { ThemeColor } from './theme-color';

const meta: Meta<typeof ThemeColor> = {
  title: 'UI/ThemeColor',
  component: ThemeColor,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;

export const Default: StoryObj<typeof meta> = {
  args: {},
};
