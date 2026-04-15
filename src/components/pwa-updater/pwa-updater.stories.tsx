import type { Meta, StoryObj } from '@storybook/react-vite';
import { PwaUpdater } from './pwa-updater';

const meta = {
  title: 'UI/PwaUpdater',
  component: typeof PwaUpdater !== 'undefined' ? PwaUpdater : undefined,
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
