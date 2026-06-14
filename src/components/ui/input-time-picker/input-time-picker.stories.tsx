import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { InputTimePicker } from './input-time-picker';

const meta: Meta<typeof InputTimePicker> = {
  title: 'UI/InputTimePicker',
  component: InputTimePicker,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;

export const Default: StoryObj<typeof meta> = {
  render: () => {
    const [date, setDate] = useState<Date | undefined>(new Date());

    return <InputTimePicker date={date} setDate={setDate} />;
  },
};

export const Empty: StoryObj<typeof meta> = {
  render: () => {
    const [date, setDate] = useState<Date | undefined>(undefined);

    return <InputTimePicker date={date} setDate={setDate} />;
  },
};

export const Disabled: StoryObj<typeof meta> = {
  render: () => {
    const [date, setDate] = useState<Date | undefined>(new Date());

    return <InputTimePicker date={date} setDate={setDate} disabled />;
  },
};
