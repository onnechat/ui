import type { Meta, StoryObj } from '@storybook/react-vite';
import { CookieBanner } from './cookie-banner';

const meta = {
  title: 'UI/CookieBanner',
  component: typeof CookieBanner !== 'undefined' ? CookieBanner : undefined,
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
