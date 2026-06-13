import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { SelectMulti } from './select-multi';

const meta: Meta<typeof SelectMulti> = {
  title: 'UI/SelectMulti',
  component: SelectMulti,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;

const OPTIONS = [
  { id: '1', label: 'Apple' },
  { id: '2', label: 'Banana' },
  { id: '3', label: 'Cherry' },
];

export const Default: StoryObj<typeof meta> = {
  render: () => {
    const [values, setValues] = useState<string[]>([]);
    return (
      <SelectMulti
        values={values}
        onValuesChange={setValues}
        options={OPTIONS}
        getItemValue={(item) => item.id}
        renderItem={(item) => <span>{item.label}</span>}
        getBadgeLabel={(item) => item.label}
        className="w-48"
      />
    );
  },
};
