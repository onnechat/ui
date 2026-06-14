import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect } from 'storybook/test';
import { Alert, AlertTitle, AlertDescription } from './alert';
import { Icon } from '@/components/icon';

const meta: Meta<typeof Alert> = {
  title: 'UI/Alert',
  component: Alert,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;

export const Default: StoryObj<typeof meta> = {
  args: {
    children: (
      <AlertDescription>
        Default alert — used for neutral information.
      </AlertDescription>
    ),
  },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('alert')).toBeVisible();
  },
};

export const Destructive: StoryObj<typeof meta> = {
  args: {
    variant: 'destructive',
    children: (
      <>
        <Icon name="TriangleWarning" />

        <AlertTitle>Account suspended</AlertTitle>
        <AlertDescription>
          Your account has been suspended due to a violation of our terms of
          service.
        </AlertDescription>
      </>
    ),
  },
  play: async ({ canvas }) => {
    await expect(canvas.getByText('Account suspended')).toBeVisible();
  },
};

export const Warning: StoryObj<typeof meta> = {
  args: {
    variant: 'warning',
    children: (
      <>
        <Icon name="TriangleWarning" />

        <AlertTitle>Subscription expiring</AlertTitle>
        <AlertDescription>
          Your subscription will expire in 3 days. Update your payment method
          to avoid interruption.
        </AlertDescription>
      </>
    ),
  },
  play: async ({ canvas }) => {
    await expect(canvas.getByText('Subscription expiring')).toBeVisible();
  },
};

export const Info: StoryObj<typeof meta> = {
  args: {
    variant: 'info',
    children: (
      <>
        <Icon name="CircleInfo" />

        <AlertTitle>New feature available</AlertTitle>
        <AlertDescription>
          We have released dark mode support. Go to settings to enable it.
        </AlertDescription>
      </>
    ),
  },
  play: async ({ canvas }) => {
    await expect(canvas.getByText('New feature available')).toBeVisible();
  },
};

export const TitleOnly: StoryObj<typeof meta> = {
  args: {
    variant: 'info',
    children: (
      <>
        <Icon name="CircleCheck" />
        <AlertTitle>Update completed successfully.</AlertTitle>
      </>
    ),
  },
  play: async ({ canvas }) => {
    await expect(canvas.getByText('Update completed successfully.')).toBeVisible();
  },
};

export const DescriptionOnly: StoryObj<typeof meta> = {
  args: {
    variant: 'destructive',
    children: (
      <>
        <Icon name="TriangleWarning" />

        <AlertDescription>
          Payment failed. Please try again or use a different card.
        </AlertDescription>
      </>
    ),
  },
  play: async ({ canvas }) => {
    await expect(canvas.getByText(/Payment failed/)).toBeVisible();
  },
};

export const WithoutIcon: StoryObj<typeof meta> = {
  args: {
    children: (
      <>
        <AlertTitle>Plain message</AlertTitle>
        <AlertDescription>
          This alert has no icon, just a title and description.
        </AlertDescription>
      </>
    ),
  },
  play: async ({ canvas }) => {
    await expect(canvas.getByText('Plain message')).toBeVisible();
  },
};
