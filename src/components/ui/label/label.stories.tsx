import type { Meta, StoryObj } from '@storybook/react-vite';
import { Label } from './label';

const meta = {
  title: 'UI/Label',
  component: typeof Label !== 'undefined' ? Label : undefined,
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
