import type { Meta, StoryObj } from '@storybook/react-vite';
import { Kbd } from './kbd';

const meta = {
  title: 'UI/Kbd',
  component: typeof Kbd !== 'undefined' ? Kbd : undefined,
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
