import type { Meta, StoryObj } from '@storybook/react';
import { Loader } from './Loader';
import { sizes } from '@/constants/sizes';

const meta: Meta<typeof Loader> = {
  title: 'Components/Loader',
  component: Loader,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    loading: {
      control: 'boolean',
      description: 'Whether the loader is loading',
    },
    variant: {
      control: 'select',
      description: 'The variant of the loader',
      options: ['loader', 'spinner'],
    },
    size: {
      control: 'select',
      description: 'The size of the loader',
      options: sizes,
    },
    className: {
      control: 'text',
      description: 'Additional CSS classes for the loader icon',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    loading: true,
  },
};

export const MediumSize: Story = {
  args: {
    loading: true,
    size: 'md',
  },
};

export const LargeSize: Story = {
  args: {
    loading: true,
    size: 'lg',
  },
};

export const ExtraLargeSize: Story = {
  args: {
    loading: true,
    size: 'xl',
  },
};
