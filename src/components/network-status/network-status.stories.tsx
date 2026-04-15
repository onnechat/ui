import type { Meta, StoryObj } from '@storybook/react-vite';
import { NetworkStatus } from './network-status';

const meta = {
  title: 'UI/NetworkStatus',
  component: typeof NetworkStatus !== 'undefined' ? NetworkStatus : undefined,
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
