import type { Meta, StoryObj } from '@storybook/react-vite';

import { Separator } from './separator';

const meta: Meta<typeof Separator> = {
  title: 'UI/Separator',
  component: Separator,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    orientation: {
      control: 'inline-radio',
      options: ['horizontal', 'vertical'],
      description: 'Direção do separador.',
      table: {
        category: 'Aparência',
        type: { summary: "'horizontal' | 'vertical'" },
        defaultValue: { summary: "'horizontal'" },
      },
    },
    className: {
      control: 'text',
      description: 'Classes extras aplicadas ao separador.',
      table: { category: 'Aparência' },
    },
  },
  args: {
    orientation: 'horizontal',
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  render: args =>
    args.orientation === 'vertical' ? (
      <div className="flex h-8 items-center gap-3">
        <span className="text-sm">Left</span>
        <Separator {...args} />
        <span className="text-sm">Right</span>
      </div>
    ) : (
      <div className="flex w-72 flex-col gap-3">
        <span className="text-sm">Above</span>
        <Separator {...args} />
        <span className="text-sm">Below</span>
      </div>
    ),
};

export const Horizontal: Story = {
  render: () => (
    <div className="flex w-72 flex-col gap-3">
      <span className="text-sm">Above</span>
      <Separator />
      <span className="text-sm">Below</span>
    </div>
  ),
};

export const Vertical: Story = {
  render: () => (
    <div className="flex h-8 items-center gap-3">
      <span className="text-sm">Left</span>
      <Separator orientation="vertical" />
      <span className="text-sm">Right</span>
    </div>
  ),
};

export const WithContent: Story = {
  render: () => (
    <div className="w-80 space-y-3">
      <div className="space-y-1">
        <h4 className="text-sm font-medium">Section One</h4>
        <p className="text-sm text-muted-foreground">
          Content above the separator.
        </p>
      </div>
      <Separator />
      <div className="space-y-1">
        <h4 className="text-sm font-medium">Section Two</h4>
        <p className="text-sm text-muted-foreground">
          Content below the separator.
        </p>
      </div>
    </div>
  ),
};
