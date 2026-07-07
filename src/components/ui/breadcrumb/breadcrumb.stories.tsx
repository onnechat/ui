import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect } from 'storybook/test';
import { Breadcrumb } from './breadcrumb';

const meta: Meta<typeof Breadcrumb> = {
  title: 'UI/Breadcrumb',
  component: Breadcrumb,
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    hideBackButton: { control: 'boolean' },
    disableLinks: { control: 'boolean' },
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

export const WithoutLinks: Story = {
  args: {
    ...Default.args,
    disableLinks: true,
  },
};

export const WithoutBackButton: Story = {
  args: {
    ...Default.args,
    hideBackButton: true,
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
