import type { Meta, StoryObj } from '@storybook/react-vite';
import { ServiceWorkerRegister } from './service-worker-register';

const meta = {
  title: 'UI/ServiceWorkerRegister',
  component: typeof ServiceWorkerRegister !== 'undefined' ? ServiceWorkerRegister : undefined,
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
