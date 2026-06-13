import type { Meta, StoryObj } from '@storybook/react-vite';
import { SettingsItem } from './settings-item';

const meta: Meta<typeof SettingsItem> = {
  title: 'UI/SettingsItem',
  component: SettingsItem,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;

export const Default: StoryObj<typeof meta> = {
  args: {},
};
