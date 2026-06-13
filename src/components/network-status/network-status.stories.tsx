import type { Meta, StoryObj } from '@storybook/react-vite';
import { NetworkStatus } from './network-status';

const meta: Meta<typeof NetworkStatus> = {
  title: 'UI/NetworkStatus',
  component: NetworkStatus,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;

export const Default: StoryObj<typeof meta> = {
  args: {},
};
