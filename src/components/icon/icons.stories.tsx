import { useMemo, useState } from 'react';

import type { Meta, StoryObj } from '@storybook/react-vite';

import { Icon } from '@/components/icon';
import { Input } from '@/components/ui/input';

import { fillIcons } from './variants';
import type { FillIconName } from './variants';

const iconNames = Object.keys(fillIcons).sort();

const meta: Meta = {
  title: 'UI/Icons',
  parameters: {
    layout: 'centered',
  },
};

export default meta;

function IconGallery() {
  const [search, setSearch] = useState('');

  const filteredIcons = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return iconNames;
    return iconNames.filter((name) => name.toLowerCase().includes(query));
  }, [search]);

  return (
    <div className="flex h-[70vh] w-[42rem] max-w-full flex-col gap-4 p-4">
      <Input
        type="search"
        placeholder={`Search ${iconNames.length} icons…`}
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {filteredIcons.length === 0 ? (
        <div className="flex flex-1 items-center justify-center text-sm text-muted-foreground">
          No icons found for “{search}”
        </div>
      ) : (
        <div className="grid flex-1 auto-rows-min grid-cols-3 gap-2 overflow-y-auto pr-1">
          {filteredIcons.map((name) => (
            <div
              key={name}
              className="flex flex-col items-center justify-center gap-4 rounded-xl bg-card p-4"
            >
              <Icon
                name={name as FillIconName}
                className="size-6 text-muted-foreground"
              />

              <span className="text-sm text-muted-foreground text-center leading-tight break-all">
                {name}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export const Gallery: StoryObj = {
  render: () => <IconGallery />,
};
