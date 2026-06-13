import type { Meta, StoryObj } from '@storybook/react-vite';
import { KeyboardShortcut } from './keyboard-shortcut';

const meta: Meta<typeof KeyboardShortcut> = {
  title: 'UI/KeyboardShortcut',
  component: KeyboardShortcut,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;

export const Default: StoryObj<typeof meta> = {
  args: {},
};
