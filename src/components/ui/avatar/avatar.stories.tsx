import type { Meta, StoryObj } from '@storybook/react-vite';
import { Avatar } from './avatar';

const meta = {
  title: 'UI/Avatar',
  component: typeof Avatar !== 'undefined' ? Avatar : undefined,
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
