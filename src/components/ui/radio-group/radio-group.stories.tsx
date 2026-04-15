import type { Meta, StoryObj } from '@storybook/react-vite';
import { RadioGroup } from './radio-group';

const meta = {
  title: 'UI/RadioGroup',
  component: typeof RadioGroup !== 'undefined' ? RadioGroup : undefined,
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
