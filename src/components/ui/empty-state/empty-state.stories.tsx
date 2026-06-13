import type { Meta, StoryObj } from '@storybook/react-vite';
import { EmptyState } from './empty-state';
import { Button } from '@/components/internal/button';

const meta: Meta<typeof EmptyState> = {
  title: 'UI/EmptyState',
  component: EmptyState,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'embedded', 'flat'],
      table: { defaultValue: { summary: 'default' } },
    },
    title: { control: 'text' },
    description: { control: 'text' },
  },
  args: {
    variant: 'default',
    icon: 'Archive',
  },
};

export default meta;

export const Default: StoryObj<typeof meta> = {
  args: {
    icon: 'Magnifier',
    title: 'No results found',
    description: 'Try adjusting your search or filters.',
  },
};

export const IconDescription: StoryObj<typeof meta> = {
  args: {
    icon: 'Archive',
    description: 'Create your first project to get started.',
  },
};

export const IconTitle: StoryObj<typeof meta> = {
  args: {
    icon: 'Archive',
    title: 'No projects yet',
  },
};

export const TitleDescription: StoryObj<typeof meta> = {
  args: {
    title: 'No projects yet',
    description: 'Create your first project to get started.',
  },
};

export const WithAction: StoryObj<typeof meta> = {
  args: {
    icon: 'Archive',
    title: 'No projects yet',
    description: 'Create your first project to get started.',
    children: (
      <Button variant="primary">Create project</Button>
    ),
  },
};
