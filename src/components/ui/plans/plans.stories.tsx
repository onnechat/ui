import type { Meta, StoryObj } from '@storybook/react-vite';
import { Plans } from './plans';

const meta: Meta<typeof Plans> = {
  title: 'UI/Plans',
  component: Plans,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;

export const Default: StoryObj<typeof meta> = {
  args: {},
};
