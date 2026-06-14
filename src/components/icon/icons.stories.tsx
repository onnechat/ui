import type { Meta, StoryObj } from '@storybook/react-vite';
import { Icon } from '@/components/icon';

import { fillIcons } from './variants';
import type { FillIconName } from './variants';

const iconNames = Object.keys(fillIcons).sort();

const meta: Meta = {
  title: 'UI/Icons',
  parameters: {
    layout: 'fullscreen',
  },
};

export default meta;

export const Gallery: StoryObj = {
  render: () => (
    <div style={{ gridTemplateColumns: 'repeat(3, 1fr)' }} className="grid gap-2 items-start justify-start p-4">
      {iconNames.map((name) => (
        <div
          key={name}
          className="flex flex-col items-center justify-center gap-4 rounded-xl border border-border bg-card p-4"
        >
          <Icon name={name as FillIconName} className="size-6 text-muted-foreground" />

          <span className="text-sm text-muted-foreground text-center leading-tight break-all">
            {name}
          </span>
        </div>
      ))}
    </div>
  ),
};
