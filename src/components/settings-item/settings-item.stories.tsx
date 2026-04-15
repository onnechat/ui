import type { Meta, StoryObj } from '@storybook/react-vite';
import { SettingsItem } from './settings-item';

const meta = {
  title: 'UI/SettingsItem',
  component: typeof SettingsItem !== 'undefined' ? SettingsItem : undefined,
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
