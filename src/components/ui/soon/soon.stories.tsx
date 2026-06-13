import type { Meta, StoryObj } from '@storybook/react-vite';
import { Soon } from './soon';

const meta: Meta<typeof Soon> = {
  title: 'UI/Soon',
  component: Soon,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;

export const Default: StoryObj<typeof meta> = {
  args: {},
};
