import type { Meta, StoryObj } from '@storybook/react-vite';
import { Sheet } from './sheet';

const meta = {
  title: 'UI/Sheet',
  component: typeof Sheet !== 'undefined' ? Sheet : undefined,
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
