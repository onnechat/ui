import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import type { IconType } from '@/components/icon';
import { ActionGroup } from './action-group';

const meta: Meta<typeof ActionGroup> = {
  title: 'UI/ActionGroup',
  component: ActionGroup,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
  argTypes: {
    disabled: {
      control: 'boolean',
      description: 'Disable the trigger button',
    },
    align: {
      control: 'select',
      options: ['start', 'center', 'end'],
      description: 'Dropdown alignment relative to trigger',
    },
  },
  args: {
    disabled: false,
    align: 'end',
  },
};

export default meta;

export const Default: StoryObj<typeof meta> = {
  render: (args) => (
    <div className="flex justify-center">
      <ActionGroup {...args} />
    </div>
  ),
  args: {
    items: [
      [
        { label: 'Edit', icon: 'Pen3' as IconType, onClick: fn() },
        { label: 'Duplicate', icon: 'Copy' as IconType, onClick: fn() },
      ],
      [
        { label: 'Delete', icon: 'Trash' as IconType, onClick: fn(), variant: 'destructive' },
      ],
    ],
  },
};
