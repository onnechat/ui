import type { Meta, StoryObj } from '@storybook/react-vite';
import { Soon } from './soon';

const meta = {
  title: 'UI/Soon',
  component: typeof Soon !== 'undefined' ? Soon : undefined,
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
