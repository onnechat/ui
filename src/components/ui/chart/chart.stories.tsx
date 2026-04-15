import type { Meta, StoryObj } from '@storybook/react-vite';
import { Chart } from './chart';

const meta = {
  title: 'UI/Chart',
  component: typeof Chart !== 'undefined' ? Chart : undefined,
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
