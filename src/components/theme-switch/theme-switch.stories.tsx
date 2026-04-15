import type { Meta, StoryObj } from '@storybook/react-vite';
import { ThemeSwitch } from './theme-switch';

const meta = {
  title: 'UI/ThemeSwitch',
  component: typeof ThemeSwitch !== 'undefined' ? ThemeSwitch : undefined,
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
