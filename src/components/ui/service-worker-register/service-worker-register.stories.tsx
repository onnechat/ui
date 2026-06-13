import type { Meta, StoryObj } from '@storybook/react-vite';
import { ServiceWorkerRegister } from './service-worker-register';

const meta: Meta<typeof ServiceWorkerRegister> = {
  title: 'UI/ServiceWorkerRegister',
  component: ServiceWorkerRegister,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;

export const Default: StoryObj<typeof meta> = {
  args: {},
};
