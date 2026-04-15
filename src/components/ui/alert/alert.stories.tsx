import type { Meta, StoryObj } from '@storybook/react-vite';
import { Alert } from './alert';

const meta = {
  title: 'UI/Alert',
  component: typeof Alert !== 'undefined' ? Alert : undefined,
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
