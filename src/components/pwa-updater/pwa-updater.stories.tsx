import type { Meta, StoryObj } from '@storybook/react-vite';
import { PwaUpdater } from './pwa-updater';

const meta: Meta<typeof PwaUpdater> = {
  title: 'UI/PwaUpdater',
  component: PwaUpdater,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;

export const Default: StoryObj<typeof meta> = {
  args: {},
};
