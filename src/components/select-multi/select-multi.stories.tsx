import type { Meta, StoryObj } from '@storybook/react-vite';
import { SelectMulti } from './select-multi';

const meta = {
  title: 'UI/SelectMulti',
  component: typeof SelectMulti !== 'undefined' ? SelectMulti : undefined,
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
