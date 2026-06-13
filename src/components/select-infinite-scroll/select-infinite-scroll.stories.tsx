import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { SelectInfiniteScroll } from './select-infinite-scroll';

const meta: Meta<typeof SelectInfiniteScroll> = {
  title: 'UI/SelectInfiniteScroll',
  component: SelectInfiniteScroll,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;

const ITEMS = [
  { id: '1', label: 'Apple' },
  { id: '2', label: 'Banana' },
  { id: '3', label: 'Cherry' },
];

export const Default: StoryObj<typeof meta> = {
  render: () => {
    const [value, setValue] = useState('');
    return (
      <SelectInfiniteScroll
        value={value}
        onValueChange={setValue}
        queryKey={['demo']}
        queryFn={async () => ITEMS}
        getItemValue={(item) => item.id}
        renderItem={(item) => <span>{item.label}</span>}
        className="w-48"
      />
    );
  },
};
