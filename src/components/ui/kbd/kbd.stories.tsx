import type { Meta, StoryObj } from '@storybook/react-vite';
import { Kbd } from './kbd';

const meta: Meta<typeof Kbd> = {
  title: 'UI/Kbd',
  component: Kbd,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;

export const Single: StoryObj<typeof meta> = {
  args: {
    keys: 'Mod',
  },
};

export const Simultaneous: StoryObj<typeof meta> = {
  args: {
    keys: ['Mod', 'Enter'],
  },
};

export const Sequential: StoryObj<typeof meta> = {
  args: {
    keys: [['G'], ['D']],
  },
};

export const Mixed: StoryObj<typeof meta> = {
  args: {
    keys: [['Mod', 'G'], ['E']],
  },
};
