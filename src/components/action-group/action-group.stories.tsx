import type { Meta, StoryObj } from '@storybook/react-vite';
import { ActionGroup } from './action-group';

const meta = {
  title: 'UI/ActionGroup',
  component: typeof ActionGroup !== 'undefined' ? ActionGroup : undefined,
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
