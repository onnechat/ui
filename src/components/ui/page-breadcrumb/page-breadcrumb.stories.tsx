import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect } from 'storybook/test';
import { PageBreadcrumb } from './page-breadcrumb';

const meta: Meta<typeof PageBreadcrumb> = {
  title: 'UI/PageBreadcrumb',
  component: PageBreadcrumb,
  parameters: {
    layout: 'centered',
  },
  tags: ['ai-generated'],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    items: [
      { label: 'Workspace', href: '/workspace' },
      { label: 'Calendar', href: '/workspace/calendar' },
      { label: 'Events' },
    ],
  },
  play: async ({ canvas }) => {
    await expect(canvas.getByText('Workspace')).toBeVisible();
    await expect(canvas.getByText('Events')).toBeVisible();
  },
};

export const SingleItem: Story = {
  args: {
    items: [{ label: 'Dashboard' }],
  },
};

export const LongPath: Story = {
  args: {
    items: [
      { label: 'Home', href: '/' },
      { label: 'Workspace', href: '/workspace' },
      { label: 'Project', href: '/workspace/project' },
      { label: 'Settings', href: '/workspace/project/settings' },
      { label: 'Advanced' },
    ],
  },
};
