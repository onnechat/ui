import type { Meta, StoryObj } from '@storybook/react-vite';
import { LanguageSwitch } from './language-switch';

const meta = {
  title: 'UI/LanguageSwitch',
  component: typeof LanguageSwitch !== 'undefined' ? LanguageSwitch : undefined,
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
