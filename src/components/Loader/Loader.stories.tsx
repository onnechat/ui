import type { Meta, StoryObj } from '@storybook/react';
import { Loader } from './Loader';

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
      description: 'Whether the loader should be visible',
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

export const Hidden: Story = {
  args: {
    loading: false,
  },
};

export const CustomSize: Story = {
  args: {
    loading: true,
    className: 'size-8',
  },
};

export const LargeSize: Story = {
  args: {
    loading: true,
    className: 'size-12',
  },
};
