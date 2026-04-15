import type { Meta, StoryObj } from '@storybook/react-vite';
import { Card } from './card';

const meta = {
  title: 'UI/Card',
  component: typeof Card !== 'undefined' ? Card : undefined,
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
