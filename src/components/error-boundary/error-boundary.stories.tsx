import type { Meta, StoryObj } from '@storybook/react-vite';
import { ErrorBoundary } from './error-boundary';

const meta = {
  title: 'UI/ErrorBoundary',
  component: typeof ErrorBoundary !== 'undefined' ? ErrorBoundary : undefined,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {},
} satisfies Meta<any>;

export default meta;

export const Default: StoryObj<typeof meta> = {
  args: {},
};
