import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect } from 'storybook/test'

import { AnnouncementBanner } from './announcement-banner'

const meta: Meta<typeof AnnouncementBanner> = {
  title: 'Layouts/AnnouncementBanner',
  component: AnnouncementBanner,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
  argTypes: {
    type: {
      control: 'select',
      options: [
        'NEW',
        'SALE',
        'WARNING',
        'INFO',
        'SUCCESS',
        'ERROR',
        'CRITICAL',
        'MAINTENANCE',
        'UPDATE',
      ],
    },
  },
}

export default meta

export const Default: StoryObj<typeof meta> = {
  args: {
    type: 'NEW',
    typeLabel: 'New',
    message: 'A brand new analytics dashboard is now available.',
  },
  play: async ({ canvas }) => {
    await expect(
      canvas.getByText('A brand new analytics dashboard is now available.'),
    ).toBeInTheDocument()
  },
}

export const Critical: StoryObj<typeof meta> = {
  args: {
    type: 'CRITICAL',
    typeLabel: 'Critical',
    message:
      'Your subscription is inactive. Update your billing information to keep using the product.',
  },
}

export const Maintenance: StoryObj<typeof meta> = {
  args: {
    type: 'MAINTENANCE',
    typeLabel: 'Maintenance',
    message: 'Scheduled maintenance this Saturday from 02:00 to 04:00 UTC.',
  },
}

export const NotDismissible: StoryObj<typeof meta> = {
  args: {
    type: 'WARNING',
    typeLabel: 'Warning',
    message: 'This banner cannot be dismissed.',
    dismissible: false,
  },
}

export const OverflowingMessage: StoryObj<typeof meta> = {
  render: (args) => (
    <div className="mx-auto max-w-md">
      <AnnouncementBanner {...args} className="max-w-md mx-auto" />
    </div>
  ),
  args: {
    type: 'INFO',
    typeLabel: 'Info',
    message:
      'This is a very long announcement message that will not fit in the available space, so it automatically scrolls back and forth like a marquee to stay readable.',
  },
}
