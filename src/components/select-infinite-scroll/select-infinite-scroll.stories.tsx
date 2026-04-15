import type { Meta, StoryObj } from '@storybook/react-vite';
import { SelectInfiniteScroll } from './select-infinite-scroll';

const meta = {
  title: 'UI/SelectInfiniteScroll',
  component: typeof SelectInfiniteScroll !== 'undefined' ? SelectInfiniteScroll : undefined,
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
