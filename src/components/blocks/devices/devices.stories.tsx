import type { Meta, StoryObj } from '@storybook/react-vite';
import { Safari } from './safari';

const meta: Meta<typeof Safari> = {
  title: 'Blocks/Devices',
  component: Safari,
  parameters: { layout: 'fullscreen' },
  tags: ['ai-generated'],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    url: 'https://example.com',
    children: (
      <div className="flex items-center justify-center h-64 text-muted-foreground">
        Content area
      </div>
    ),
  },
};

export const LongUrl: Story = {
  args: {
    url: 'https://subdomain.example.com/very/long/path/to/resource',
    children: (
      <div className="flex items-center justify-center h-64 text-muted-foreground">
        Dashboard preview
      </div>
    ),
  },
};
