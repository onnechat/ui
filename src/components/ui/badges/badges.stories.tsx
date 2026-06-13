import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect } from 'storybook/test';
import { StatusBadge } from './status';
import { RoleBadge } from './roles';

const meta: Meta = {
  title: 'UI/Badges',
  parameters: { layout: 'centered' },
  tags: ['ai-generated'],
};

export default meta;

export const StatusPending: StoryObj = {
  render: () => <StatusBadge status="PENDING" />,
};

export const StatusAccepted: StoryObj = {
  render: () => <StatusBadge status="ACCEPTED" />,
};

export const StatusCancelled: StoryObj = {
  render: () => <StatusBadge status="CANCELLED" />,
};

export const StatusDefault: StoryObj = {
  render: () => <StatusBadge status="UNKNOWN" />,
  play: async ({ canvas }) => {
    await expect(canvas.getByText('UNKNOWN')).toBeVisible();
  },
};

export const RoleAdmin: StoryObj = {
  render: () => <RoleBadge role="Admin" />,
};

export const RoleUser: StoryObj = {
  render: () => <RoleBadge role="User" />,
};

export const CssCheck: StoryObj = {
  render: () => <StatusBadge status="PENDING" />,
  play: async ({ canvas }) => {
    const badge = canvas.getByText('PENDING');
    const style = getComputedStyle(badge);
    await expect(style.backgroundColor).toBeDefined();
  },
};
