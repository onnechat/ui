import type { Meta, StoryObj } from '@storybook/react-vite';
import { DropdownMenu } from './dropdown-menu';

const meta = {
  title: 'UI/DropdownMenu',
  component: typeof DropdownMenu !== 'undefined' ? DropdownMenu : undefined,
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
