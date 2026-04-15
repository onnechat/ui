import type { Meta, StoryObj } from '@storybook/react-vite';
import { PwaInstallBanner } from './pwa-install-banner';

const meta = {
  title: 'UI/PwaInstallBanner',
  component: typeof PwaInstallBanner !== 'undefined' ? PwaInstallBanner : undefined,
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
