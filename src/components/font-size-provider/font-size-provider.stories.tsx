import type { Meta, StoryObj } from '@storybook/react-vite';
import { FontSizeProvider } from './font-size-provider';

const meta = {
  title: 'UI/FontSizeProvider',
  component: typeof FontSizeProvider !== 'undefined' ? FontSizeProvider : undefined,
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
