import type { Meta, StoryObj } from '@storybook/react-vite';
import { CopyrightVersion } from './copyright-version';

const meta = {
  title: 'UI/CopyrightVersion',
  component: typeof CopyrightVersion !== 'undefined' ? CopyrightVersion : undefined,
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
