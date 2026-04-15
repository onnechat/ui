import type { Meta, StoryObj } from '@storybook/react-vite';
import { Partners } from './partners';

const meta = {
  title: 'UI/Partners',
  component: typeof Partners !== 'undefined' ? Partners : undefined,
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
