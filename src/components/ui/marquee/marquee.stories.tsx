import type { Meta, StoryObj } from '@storybook/react-vite';
import { Marquee } from './marquee';

const meta = {
  title: 'UI/Marquee',
  component: typeof Marquee !== 'undefined' ? Marquee : undefined,
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
