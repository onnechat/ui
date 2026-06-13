import type { Meta, StoryObj } from '@storybook/react-vite';
import { Marquee } from './marquee';

const meta: Meta<typeof Marquee> = {
  title: 'UI/Marquee',
  component: Marquee,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;

export const Default: StoryObj<typeof meta> = {
  args: {},
};
