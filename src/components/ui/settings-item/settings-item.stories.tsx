import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect } from 'storybook/test';
import { SettingsItem } from './settings-item';

const meta: Meta<typeof SettingsItem> = {
  title: 'UI/SettingsItem',
  component: SettingsItem,
  parameters: {
    layout: 'centered',
  },
  tags: ['ai-generated'],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    title: 'Notifications',
    description: 'Manage your notification preferences.',
  },
  play: async ({ canvas }) => {
    await expect(canvas.getByText('Notifications')).toBeVisible();
    await expect(canvas.getByText('Manage your notification preferences.')).toBeVisible();
  },
};

export const WithIcon: Story = {
  args: {
    icon: 'Bell',
    title: 'Notifications',
    description: 'Receive push and email notifications.',
  },
};

export const WithAction: Story = {
  args: {
    icon: 'User',
    title: 'Account',
    description: 'Update your account details.',
    action: <span className="text-sm text-muted-foreground">Manage</span>,
  },
};

export const CardVariant: Story = {
  args: {
    variant: 'card',
    title: 'Security',
    description: 'Two-factor authentication and password settings.',
    icon: 'Lock',
  },
};
