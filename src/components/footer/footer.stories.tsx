import type { Meta, StoryObj } from '@storybook/react-vite';
import { Footer } from './footer';

const meta = {
  title: 'UI/Footer',
  component: typeof Footer !== 'undefined' ? Footer : undefined,
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
