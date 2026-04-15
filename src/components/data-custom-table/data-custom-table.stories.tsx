import type { Meta, StoryObj } from '@storybook/react-vite';
import { DataCustomTable } from './data-custom-table';

const meta = {
  title: 'UI/DataCustomTable',
  component: typeof DataCustomTable !== 'undefined' ? DataCustomTable : undefined,
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
