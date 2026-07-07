import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect } from 'storybook/test';
import { Progress } from './progress';

const meta: Meta<typeof Progress> = {
  title: 'UI/Progress',
  component: Progress,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs', 'new'],
  argTypes: {
    value: {
      control: { type: 'range', min: 0, max: 100 },
    },
  },
};

export default meta;

export const Default: StoryObj<typeof meta> = {
  args: {
    value: 60,
    className: 'w-64',
  },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('progressbar')).toBeVisible();
  },
};

export const WithLabel: StoryObj<typeof meta> = {
  render: () => (
    <Progress value={75} className="w-72">
      <Progress.Label>Uploading files</Progress.Label>
      <Progress.Value />
    </Progress>
  ),
  play: async ({ canvas }) => {
    await expect(canvas.getByText('Uploading files')).toBeVisible();
    await expect(canvas.getByText('75%')).toBeVisible();
  },
};

export const Determinate: StoryObj<typeof meta> = {
  args: {
    value: 0,
    className: 'w-64',
  },
};

export const Halfway: StoryObj<typeof meta> = {
  args: {
    value: 50,
    className: 'w-64',
  },
};

export const Complete: StoryObj<typeof meta> = {
  args: {
    value: 100,
    className: 'w-64',
  },
};
