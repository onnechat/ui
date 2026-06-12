import type { Meta, StoryObj } from '@storybook/react-vite';
import { Accordion } from './accordion';

const meta = {
  title: 'Components/Accordion',
  component: typeof Accordion !== 'undefined' ? Accordion : undefined,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {},
} satisfies Meta<any>;

export default meta;

export const Default: StoryObj<typeof meta> = {
  args: {
    items: Array.from({ length: 10 }, (_, index) => ({
      id: `item-${index}`,
      trigger: `Item ${index + 1}`,
      children: `Content example for item ${index + 1}, this is a long content to test the accordion component and see how it behaves when the content is long.`,
    })),
    className: 'w-full max-w-md',
  },
};
