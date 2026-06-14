import type { Meta, StoryObj } from '@storybook/react-vite';
import { Separator } from './separator';

const meta: Meta<typeof Separator> = {
  title: 'Internal/Separator',
  component: Separator,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;

export const Default: StoryObj<typeof meta> = {
  args: {},
};
