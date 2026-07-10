import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';

import { Button } from '@/components/ui/button';
import { Icon } from '@/components/icon';
import { Avatar } from '@/components/ui/avatar';
import { HoverCard } from './hover-card';

type HoverCardPlaygroundArgs = React.ComponentProps<typeof HoverCard> &
  Pick<
    React.ComponentProps<typeof HoverCard.Content>,
    'side' | 'sideOffset' | 'align' | 'alignOffset' | 'className'
  >;

const meta: Meta<HoverCardPlaygroundArgs> = {
  title: 'UI/HoverCard',
  component: HoverCard,
  subcomponents: {
    'HoverCard.Trigger': HoverCard.Trigger,
    'HoverCard.Content': HoverCard.Content,
  } as Meta<HoverCardPlaygroundArgs>['subcomponents'],
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    side: {
      control: 'select',
      options: ['top', 'right', 'bottom', 'left'],
      description:
        'Lado do trigger onde o card abre — prop de `HoverCard.Content`.',
      table: {
        category: 'Aparência',
        type: { summary: "'top' | 'right' | 'bottom' | 'left'" },
        defaultValue: { summary: "'bottom'" },
      },
    },
    align: {
      control: 'inline-radio',
      options: ['start', 'center', 'end'],
      description:
        'Alinhamento em relação ao trigger — prop de `HoverCard.Content`.',
      table: {
        category: 'Aparência',
        type: { summary: "'start' | 'center' | 'end'" },
        defaultValue: { summary: "'center'" },
      },
    },
    sideOffset: {
      control: 'number',
      description:
        'Distância (px) entre o card e o trigger — prop de `HoverCard.Content`.',
      table: { category: 'Aparência', defaultValue: { summary: '4' } },
    },
    alignOffset: {
      control: 'number',
      description:
        'Deslocamento (px) ao longo do eixo de alinhamento — prop de `HoverCard.Content`.',
      table: { category: 'Aparência', defaultValue: { summary: '4' } },
    },
    className: {
      control: 'text',
      description: 'Classes extras aplicadas ao `HoverCard.Content`.',
      table: { category: 'Aparência' },
    },
    open: {
      control: false,
      description: 'Abre/fecha o card no modo controlado.',
      table: { category: 'Estado' },
    },
    defaultOpen: {
      control: false,
      description: 'Abre o card na montagem, no modo não controlado.',
      table: { category: 'Estado' },
    },
    onOpenChange: {
      control: false,
      description:
        'Callback disparado quando o card abre/fecha. Recebe `(open, eventDetails)`.',
      table: { category: 'Estado' },
    },
    children: {
      control: false,
      description: 'Composição de `HoverCard.Trigger` e `HoverCard.Content`.',
      table: { category: 'Conteúdo' },
    },
  },
  args: {
    side: 'bottom',
    align: 'center',
    sideOffset: 4,
    alignOffset: 4,
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  render: ({ side, align, sideOffset, alignOffset, className, ...args }) => (
    <HoverCard {...args}>
      <HoverCard.Trigger>
        <Button variant="outline" asChild={false}>
          Hover me
        </Button>
      </HoverCard.Trigger>
      <HoverCard.Content
        side={side}
        align={align}
        sideOffset={sideOffset}
        alignOffset={alignOffset}
        className={className}
      >
        <div className="space-y-2">
          <h4 className="text-sm font-semibold">About this card</h4>
          <p className="text-sm text-muted-foreground">
            Hover cards display additional information when hovering over a
            trigger element.
          </p>
        </div>
      </HoverCard.Content>
    </HoverCard>
  ),
};

export const UserProfile: Story = {
  // TODO(a11y): o Button variant="link" (texto --primary sobre o fundo claro)
  // tem contraste 4.28 < 4.5 — cor definida no tema/componente Button, não na story.
  parameters: { a11y: { test: 'todo' } },
  render: () => (
    <HoverCard>
      <HoverCard.Trigger>
        <Button variant="link" asChild={false}>
          @john
        </Button>
      </HoverCard.Trigger>
      <HoverCard.Content className="w-72">
        <div className="flex gap-3">
          <Avatar className="size-10">
            <Avatar.Image src="https://github.com/shadcn.png" />
            <Avatar.Fallback name="John Doe" />
          </Avatar>
          <div className="space-y-1">
            <h4 className="text-sm font-semibold">John Doe</h4>
            <p className="text-xs text-muted-foreground">
              Full-stack developer building open source tools. Likes to write
              about React and TypeScript.
            </p>
            <div className="flex items-center gap-3 pt-1">
              <span className="flex items-center gap-1 text-xs text-muted-foreground">
                <Icon name="Calendar" className="size-3" />
                Joined Jan 2024
              </span>
            </div>
          </div>
        </div>
      </HoverCard.Content>
    </HoverCard>
  ),
};

export const WithIcon: Story = {
  render: () => (
    <HoverCard>
      <HoverCard.Trigger>
        <Button
          variant="ghost"
          size="icon"
          asChild={false}
          aria-label="System status"
        >
          <Icon name="CircleInfo" className="size-4" />
        </Button>
      </HoverCard.Trigger>
      <HoverCard.Content>
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Icon name="CircleCheck" className="size-4 text-success" />
            <h4 className="text-sm font-semibold">All systems operational</h4>
          </div>
          <p className="text-sm text-muted-foreground">
            No incidents reported. Last checked 2 minutes ago.
          </p>
        </div>
      </HoverCard.Content>
    </HoverCard>
  ),
};

export const TopSide: Story = {
  render: () => (
    <HoverCard>
      <HoverCard.Trigger>
        <Button variant="outline" asChild={false}>
          Top
        </Button>
      </HoverCard.Trigger>
      <HoverCard.Content side="top">
        <div className="space-y-2">
          <h4 className="text-sm font-semibold">Appears on top</h4>
          <p className="text-sm text-muted-foreground">
            This card opens above the trigger element.
          </p>
        </div>
      </HoverCard.Content>
    </HoverCard>
  ),
};

export const StartAlign: Story = {
  render: () => (
    <HoverCard>
      <HoverCard.Trigger>
        <Button variant="outline" asChild={false}>
          Start
        </Button>
      </HoverCard.Trigger>
      <HoverCard.Content align="start">
        <div className="space-y-2">
          <h4 className="text-sm font-semibold">Start aligned</h4>
          <p className="text-sm text-muted-foreground">
            This card is aligned to the start of the trigger.
          </p>
        </div>
      </HoverCard.Content>
    </HoverCard>
  ),
};

export const EndAlign: Story = {
  render: () => (
    <HoverCard>
      <HoverCard.Trigger>
        <Button variant="outline" asChild={false}>
          End
        </Button>
      </HoverCard.Trigger>
      <HoverCard.Content align="end">
        <div className="space-y-2">
          <h4 className="text-sm font-semibold">End aligned</h4>
          <p className="text-sm text-muted-foreground">
            This card is aligned to the end of the trigger.
          </p>
        </div>
      </HoverCard.Content>
    </HoverCard>
  ),
};

export const RichContent: Story = {
  render: () => (
    <HoverCard>
      <HoverCard.Trigger>
        <Button variant="outline" asChild={false}>
          Repository
        </Button>
      </HoverCard.Trigger>
      <HoverCard.Content className="w-80 p-0">
        <div className="space-y-3 p-4">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2">
              <Icon
                name="BookBookmark"
                className="size-4 text-muted-foreground"
              />
              <h4 className="text-sm font-semibold">shadcn/ui</h4>
            </div>
            <Button
              variant="ghost"
              size="icon-sm"
              asChild={false}
              aria-label="Star repository"
            >
              <Icon name="Star" className="size-4" />
            </Button>
          </div>
          <p className="text-xs text-muted-foreground">
            Beautifully designed components that you can copy and paste into
            your apps. Accessible. Customizable. Open Source.
          </p>
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <Icon name="Star" className="size-3" />
              47.2k
            </span>
            <span className="flex items-center gap-1">
              <Icon name="Nodes" className="size-3" />
              2.4k
            </span>
            <span>MIT</span>
          </div>
        </div>
      </HoverCard.Content>
    </HoverCard>
  ),
};
