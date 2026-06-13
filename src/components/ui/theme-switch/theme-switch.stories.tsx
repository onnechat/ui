import type { Meta, StoryObj } from '@storybook/react-vite';
import { ThemeSwitch } from './theme-switch';

const meta: Meta<typeof ThemeSwitch> = {
  title: 'UI/ThemeSwitch',
  component: ThemeSwitch,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;

export const Default: StoryObj<typeof meta> = {
  args: {},
};
