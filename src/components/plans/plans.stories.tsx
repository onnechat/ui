import type { Meta, StoryObj } from '@storybook/react-vite';
import { Plans } from './plans';

const meta = {
  title: 'UI/Plans',
  component: typeof Plans !== 'undefined' ? Plans : undefined,
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
