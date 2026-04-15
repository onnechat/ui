import type { Meta, StoryObj } from '@storybook/react-vite';
import { AnnouncementBanner } from './announcement-banner';

const meta = {
  title: 'UI/AnnouncementBanner',
  component: typeof AnnouncementBanner !== 'undefined' ? AnnouncementBanner : undefined,
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
