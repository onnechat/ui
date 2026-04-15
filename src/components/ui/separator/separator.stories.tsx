import type { Meta, StoryObj } from '@storybook/react-vite';
import { Separator } from './separator';

const meta = {
  title: 'UI/Separator',
  component: typeof Separator !== 'undefined' ? Separator : undefined,
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
