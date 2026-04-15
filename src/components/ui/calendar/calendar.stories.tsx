import type { Meta, StoryObj } from '@storybook/react-vite';
import { Calendar } from './calendar';

const meta = {
  title: 'UI/Calendar',
  component: typeof Calendar !== 'undefined' ? Calendar : undefined,
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
