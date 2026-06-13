import type { Meta, StoryObj } from '@storybook/react-vite';
import { PwaInstallBanner } from './pwa-install-banner';

const meta: Meta<typeof PwaInstallBanner> = {
  title: 'UI/PwaInstallBanner',
  component: PwaInstallBanner,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;

export const Default: StoryObj<typeof meta> = {
  args: {},
};
