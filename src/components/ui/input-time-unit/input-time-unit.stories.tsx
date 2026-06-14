import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, within } from 'storybook/test';
import { InputTimeUnit } from './input-time-unit';

const meta: Meta<typeof InputTimeUnit> = {
  title: 'UI/InputTimeUnit',
  component: InputTimeUnit,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div className="w-64">
        <Story />
      </div>
    ),
  ],
};

export default meta;

export const Default: StoryObj<typeof meta> = {
  args: {
    placeholder: 'Enter duration',
  },
  play: async ({ canvas }) => {
    await expect(canvas.getByPlaceholderText('Enter duration')).toBeVisible();
  },
};

export const WithValue: StoryObj<typeof meta> = {
  args: {
    value: 120,
    placeholder: 'Duration',
  },
};

export const RestrictedUnits: StoryObj<typeof meta> = {
  args: {
    allowedUnits: ['hours', 'days'],
    defaultUnit: 'hours',
    placeholder: 'Duration',
  },
};

export const DisabledUnitSelect: StoryObj<typeof meta> = {
  args: {
    disableUnitSelect: true,
    defaultUnit: 'minutes',
    placeholder: 'Duration (minutes only)',
  },
};

export const Controlled: StoryObj<typeof meta> = {
  render: () => {
    const [value, setValue] = useState<number | undefined>(undefined);

    return (
      <div className="flex flex-col gap-2">
        <InputTimeUnit
          value={value}
          onChange={setValue}
          placeholder="Pick a duration"
        />
        <span className="text-xs text-muted-foreground">
          Minutes: {value ?? '—'}
        </span>
      </div>
    );
  },
};

export const PickUnit: StoryObj<typeof meta> = {
  render: () => {
    const [value, setValue] = useState<number | undefined>(30);

    return (
      <InputTimeUnit
        value={value}
        onChange={setValue}
        defaultUnit="hours"
        placeholder="Duration"
      />
    );
  },
  play: async ({ canvas, canvasElement }) => {
    const trigger = canvas.getByRole('combobox');
    await userEvent.click(trigger);

    const body = within(canvasElement.ownerDocument.body);
    const daysOption = await body.findByText('Days');
    await expect(daysOption).toBeInTheDocument();
    await userEvent.click(daysOption);

    await expect(trigger).toHaveTextContent('d');
  },
};
