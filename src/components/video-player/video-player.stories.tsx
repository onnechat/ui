import type { Meta, StoryObj } from '@storybook/react-vite';
import { VideoPlayer } from './video-player';

const meta = {
  title: 'UI/VideoPlayer',
  component: typeof VideoPlayer !== 'undefined' ? VideoPlayer : undefined,
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
