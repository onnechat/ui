import type { Meta, StoryObj } from '@storybook/react-vite';

import { ScrollArea } from './scroll-area';

const meta: Meta<typeof ScrollArea> = {
  title: 'UI/ScrollArea',
  component: ScrollArea,
  subcomponents: {
    'ScrollArea.ScrollBar': ScrollArea.ScrollBar,
  } as Meta<typeof ScrollArea>['subcomponents'],
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    children: {
      control: false,
      description:
        'Conteúdo rolável, renderizado dentro do viewport. A barra vertical e o canto já vêm embutidos.',
      table: { category: 'Conteúdo' },
    },
    className: {
      control: 'text',
      description:
        'Classes extras aplicadas ao container raiz — defina aqui as dimensões da área visível (ex.: `h-72 w-64`).',
      table: { category: 'Aparência' },
    },
  },
  args: {
    className: 'h-72 w-64 rounded-lg border',
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

const TAGS = Array.from({ length: 50 }, (_, i) => `Tag ${i + 1}`);

export const Playground: Story = {
  render: args => (
    <ScrollArea {...args}>
      <div className="flex flex-col gap-2 p-4">
        <h4 className="mb-2 text-sm font-medium">Tags</h4>
        {TAGS.map(tag => (
          <div
            key={tag}
            className="rounded-md border bg-card px-3 py-2 text-sm"
          >
            {tag}
          </div>
        ))}
      </div>
    </ScrollArea>
  ),
};

export const WithLongContent: Story = {
  args: {
    className: 'h-48 w-80 rounded-lg border',
  },
  render: args => (
    <ScrollArea {...args}>
      <div className="space-y-2 p-4">
        <h4 className="text-sm font-medium">Terms of Service</h4>
        {Array.from({ length: 5 }, (_, i) => (
          <p key={i} className="text-sm leading-relaxed text-muted-foreground">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
            ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
            aliquip ex ea commodo consequat.
          </p>
        ))}
      </div>
    </ScrollArea>
  ),
};

export const HorizontalScroll: Story = {
  args: {
    className: 'w-80 rounded-lg border',
  },
  render: args => (
    <ScrollArea {...args}>
      <div className="flex gap-2 p-4" style={{ width: 800 }}>
        {Array.from({ length: 20 }, (_, i) => (
          <div
            key={i}
            className="flex h-24 w-28 shrink-0 items-center justify-center rounded-lg border bg-card text-sm font-medium"
          >
            Card {i + 1}
          </div>
        ))}
      </div>
    </ScrollArea>
  ),
};
