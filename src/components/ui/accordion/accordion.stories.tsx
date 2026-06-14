import type { Meta, StoryObj } from '@storybook/react-vite';
import { Accordion } from './accordion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const meta: Meta<typeof Accordion> = {
  title: 'UI/Accordion',
  component: Accordion,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;

const items = Array.from({ length: 3 }, (_, index) => ({
  id: `item-${index}`,
  trigger: `Item ${index + 1}`,
  children: `Content for item ${index + 1}.`,
}));

export const Default: StoryObj<typeof meta> = {
  args: {
    items,
    className: 'w-full min-w-(--container-md) max-w-(--container-md)',
  },
};

export const Multiple: StoryObj<typeof meta> = {
  args: {
    items,
    type: 'multiple',
    defaultValue: ['item-0'],
    className: 'w-full min-w-(--container-md) max-w-(--container-md)',
  },
};

export const CustomTriggers: StoryObj<typeof meta> = {
  args: {
    items: [
      {
        id: 'profile',
        trigger: (
          <span className="flex items-center gap-2">
            <span className="flex size-6 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
              A
            </span>
            Profile Settings
          </span>
        ),
        children: 'Manage your profile information, avatar, and display name.',
      },
      {
        id: 'notifications',
        trigger: (
          <span className="flex items-center gap-2">
            <span className="flex size-6 items-center justify-center rounded-full bg-warning text-[10px] font-bold text-warning-foreground">
              B
            </span>
            Notifications
          </span>
        ),
        children: 'Configure email, push, and in-app notification preferences.',
      },
      {
        id: 'billing',
        trigger: (
          <span className="flex items-center gap-2">
            <span className="flex size-6 items-center justify-center rounded-full bg-success text-[10px] font-bold text-success-foreground">
              C
            </span>
            Billing & Plans
          </span>
        ),
        children: 'View your current plan, payment methods, and billing history.',
      },
    ],
    className: 'w-full min-w-(--container-md) max-w-(--container-md)',
  },
};

export const CustomContent: StoryObj<typeof meta> = {
  args: {
    items: [
      {
        id: 'search',
        trigger: 'Search',
        children: (
          <div className="flex flex-col gap-3">
            <Input placeholder="Search..." />
            <div className="flex gap-2">
              <Button size="sm" variant="primary">Search</Button>
              <Button size="sm" variant="outline">Clear</Button>
            </div>
          </div>
        ),
      },
      {
        id: 'filters',
        trigger: 'Filters',
        children: (
          <div className="flex flex-wrap gap-2">
            {['Active', 'Pending', 'Draft', 'Archived'].map((label) => (
              <Button key={label} size="sm" variant="secondary">{label}</Button>
            ))}
          </div>
        ),
      },
      {
        id: 'actions',
        trigger: 'Quick Actions',
        children: (
          <div className="flex flex-col gap-2">
            <Button variant="outline" className="justify-start">Export CSV</Button>
            <Button variant="outline" className="justify-start">Import Data</Button>
            <Button variant="destructive" className="justify-start">Delete All</Button>
          </div>
        ),
      },
    ],
    className: 'w-full min-w-(--container-md) max-w-(--container-md)',
  },
};
