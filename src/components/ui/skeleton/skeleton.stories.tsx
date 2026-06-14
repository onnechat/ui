import type { Meta, StoryObj } from '@storybook/react-vite';
import { Skeleton } from './skeleton';

const meta: Meta<typeof Skeleton> = {
  title: 'UI/Skeleton',
  component: Skeleton,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs', 'new'],
};

export default meta;

export const Default: StoryObj<typeof meta> = {
  args: {
    className: 'h-4 w-48',
  },
};

export const TextLine: StoryObj<typeof meta> = {
  args: {
    className: 'h-3 w-64',
  },
};

export const Avatar: StoryObj<typeof meta> = {
  args: {
    className: 'size-12 rounded-full',
  },
};

export const Card: StoryObj<typeof meta> = {
  render: () => (
    <div className="flex w-80 flex-col gap-4 rounded-2xl bg-card p-6">
      <div className="flex items-center gap-4">
        <Skeleton className="size-12 rounded-full" />

        <div className="flex flex-1 flex-col gap-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-3 w-3/4" />
        </div>
      </div>

      <Skeleton className="h-32 w-full rounded-xl" />

      <div className="flex gap-2">
        <Skeleton className="h-8 w-20 rounded-lg" />
        <Skeleton className="h-8 w-20 rounded-lg" />
      </div>
    </div>
  ),
};

export const TextBlock: StoryObj<typeof meta> = {
  render: () => (
    <div className="flex w-64 flex-col gap-2">
      {Array.from({ length: 4 }).map((_, i) => (
        <Skeleton
          key={i}
          className="h-3"
          style={{ width: `${[100, 90, 95, 60][i]}%` }}
        />
      ))}
    </div>
  ),
};

export const Profile: StoryObj<typeof meta> = {
  render: () => (
    <div className="flex w-72 flex-col items-center gap-4 rounded-2xl bg-card p-6 text-center">
      <Skeleton className="size-16 rounded-full" />
      <Skeleton className="h-4 w-32" />
      <Skeleton className="h-3 w-48" />

      <div className="mt-2 flex w-full justify-around">
        <Skeleton className="h-8 w-16 rounded-lg" />
        <Skeleton className="h-8 w-16 rounded-lg" />
        <Skeleton className="h-8 w-16 rounded-lg" />
      </div>
    </div>
  ),
};
