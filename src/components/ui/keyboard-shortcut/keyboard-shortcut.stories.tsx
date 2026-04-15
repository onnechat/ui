import type { Meta, StoryObj } from '@storybook/react-vite';
import { KeyboardShortcut } from './keyboard-shortcut';

const meta = {
  title: 'UI/KeyboardShortcut',
  component: typeof KeyboardShortcut !== 'undefined' ? KeyboardShortcut : undefined,
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
