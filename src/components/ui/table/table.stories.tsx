import type { Meta, StoryObj } from '@storybook/react-vite';
import { Table } from './table';

const meta = {
  title: 'UI/Table',
  component: typeof Table !== 'undefined' ? Table : undefined,
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
