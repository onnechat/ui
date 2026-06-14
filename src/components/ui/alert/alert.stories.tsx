import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect } from 'storybook/test';
import { Alert, AlertTitle, AlertDescription } from './alert';
import { Icon, type IconType } from '@/components/icon';
import { fillIcons } from '@/components/icon/variants';

const ICON_OPTIONS: (IconType | null)[] = [
  null,
  ...(Object.keys(fillIcons).sort() as IconType[]),
];

const meta: Meta<typeof Alert> = {
  title: 'UI/Alert',
  component: Alert,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'destructive', 'warning', 'info', 'success'],
    },
  },
};

export default meta;

export const Default: StoryObj<typeof Alert> = {
  argTypes: {
    iconType: {
      control: 'select',
      options: ICON_OPTIONS,
    },
    title: {
      control: 'text',
    },
    description: {
      control: 'text',
    },
  },
  args: {
    iconType: 'CircleInfo' as IconType | null,
    title: 'Alert Title',
    description: 'This is the alert description text.',
  },
  render: ({ iconType, title, description, ...args }) => (
    <Alert {...args}>
      {iconType && <Icon name={iconType} />}
      {title && <AlertTitle>{title}</AlertTitle>}
      {description && <AlertDescription>{description}</AlertDescription>}
    </Alert>
  ),
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('alert')).toBeVisible();
  },
};

export const Destructive: StoryObj<typeof meta> = {
  args: { variant: 'destructive' },
  render: (args) => (
    <Alert {...args}>
      <Icon name="TriangleWarning" />
      <AlertTitle>Account suspended</AlertTitle>
      <AlertDescription>
        Your account has been suspended due to a violation of our terms of
        service.
      </AlertDescription>
    </Alert>
  ),
  play: async ({ canvas }) => {
    await expect(canvas.getByText('Account suspended')).toBeVisible();
  },
};

export const Warning: StoryObj<typeof meta> = {
  args: { variant: 'warning' },
  render: (args) => (
    <Alert {...args}>
      <Icon name="TriangleWarning" />
      <AlertTitle>Subscription expiring</AlertTitle>
      <AlertDescription>
        Your subscription will expire in 3 days. Update your payment method
        to avoid interruption.
      </AlertDescription>
    </Alert>
  ),
  play: async ({ canvas }) => {
    await expect(canvas.getByText('Subscription expiring')).toBeVisible();
  },
};

export const Info: StoryObj<typeof meta> = {
  args: { variant: 'info' },
  render: (args) => (
    <Alert {...args}>
      <Icon name="CircleInfo" />
      <AlertTitle>New feature available</AlertTitle>
      <AlertDescription>
        We have released dark mode support. Go to settings to enable it.
      </AlertDescription>
    </Alert>
  ),
  play: async ({ canvas }) => {
    await expect(canvas.getByText('New feature available')).toBeVisible();
  },
};

export const Success: StoryObj<typeof meta> = {
  args: { variant: 'success' },
  render: (args) => (
    <Alert {...args}>
      <Icon name="CircleCheck" />
      <AlertTitle>Operation completed</AlertTitle>
      <AlertDescription>
        Your changes have been saved successfully.
      </AlertDescription>
    </Alert>
  ),
  play: async ({ canvas }) => {
    await expect(canvas.getByText('Operation completed')).toBeVisible();
  },
};

export const TitleOnly: StoryObj<typeof meta> = {
  args: { variant: 'info' },
  render: (args) => (
    <Alert {...args}>
      <Icon name="CircleCheck" />
      <AlertTitle>Update completed successfully.</AlertTitle>
    </Alert>
  ),
  play: async ({ canvas }) => {
    await expect(canvas.getByText('Update completed successfully.')).toBeVisible();
  },
};

export const DescriptionOnly: StoryObj<typeof meta> = {
  args: { variant: 'destructive' },
  render: (args) => (
    <Alert {...args}>
      <Icon name="TriangleWarning" />
      <AlertDescription>
        Payment failed. Please try again or use a different card.
      </AlertDescription>
    </Alert>
  ),
  play: async ({ canvas }) => {
    await expect(canvas.getByText(/Payment failed/)).toBeVisible();
  },
};

export const WithoutIcon: StoryObj<typeof meta> = {
  render: (args) => (
    <Alert {...args}>
      <AlertTitle>Plain message</AlertTitle>
      <AlertDescription>
        This alert has no icon, just a title and description.
      </AlertDescription>
    </Alert>
  ),
  play: async ({ canvas }) => {
    await expect(canvas.getByText('Plain message')).toBeVisible();
  },
};
