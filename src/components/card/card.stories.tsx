import type { Meta, StoryObj } from '@storybook/react-vite';
import { Card } from './card';

const meta: Meta<typeof Card> = {
  title: 'Components/Card',
  component: Card,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {},
};

export default meta;

export const Default: StoryObj<typeof meta> = {
  args: {
    title: 'Card Title',
    children: 'Card Content',
  },
};
