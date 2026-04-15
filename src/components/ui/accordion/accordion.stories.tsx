import type { Meta, StoryObj } from '@storybook/react-vite';
import { Accordion } from './accordion';

const meta = {
  title: 'UI/Accordion',
  component: typeof Accordion !== 'undefined' ? Accordion : undefined,
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
