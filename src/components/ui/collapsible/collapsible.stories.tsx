import type { Meta, StoryObj } from '@storybook/react-vite';
import { Collapsible } from './collapsible';

const meta = {
  title: 'UI/Collapsible',
  component: typeof Collapsible !== 'undefined' ? Collapsible : undefined,
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
