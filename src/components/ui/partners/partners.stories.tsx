import type { Meta, StoryObj } from '@storybook/react-vite';
import { Partners } from './partners';

const meta: Meta<typeof Partners> = {
  title: 'UI/Partners',
  component: Partners,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;

export const Default: StoryObj<typeof meta> = {
  args: {},
};
