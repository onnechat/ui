import * as React from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { Button } from '@/components/ui/button'
import { Icon } from '@/components/icon'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { HoverCard, HoverCardContent, HoverCardTrigger } from './hover-card'

const meta: Meta<typeof HoverCard> = {
  title: 'UI/HoverCard',
  component: HoverCard,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
}

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => (
    <HoverCard>
      <HoverCardTrigger>
        <Button variant="link" asChild={false}>Hover me</Button>
      </HoverCardTrigger>
      <HoverCardContent>
        <div className="space-y-2">
          <h4 className="text-sm font-semibold">About this card</h4>
          <p className="text-sm text-muted-foreground">
            Hover cards display additional information when hovering over a
            trigger element.
          </p>
        </div>
      </HoverCardContent>
    </HoverCard>
  ),
}

export const UserProfile: Story = {
  render: () => (
    <HoverCard>
      <HoverCardTrigger>
        <Button variant="link" asChild={false}>@john</Button>
      </HoverCardTrigger>
      <HoverCardContent className="w-72">
        <div className="flex gap-3">
          <Avatar className="size-10">
            <AvatarImage src="https://github.com/shadcn.png" />
            <AvatarFallback name="John Doe" />
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
      </HoverCardContent>
    </HoverCard>
  ),
}

export const WithIcon: Story = {
  render: () => (
    <HoverCard>
      <HoverCardTrigger>
        <Button variant="ghost" size="icon" asChild={false}>
          <Icon name="CircleInfo" className="size-4" />
        </Button>
      </HoverCardTrigger>
      <HoverCardContent>
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Icon name="CircleCheck" className="size-4 text-success" />
            <h4 className="text-sm font-semibold">All systems operational</h4>
          </div>
          <p className="text-sm text-muted-foreground">
            No incidents reported. Last checked 2 minutes ago.
          </p>
        </div>
      </HoverCardContent>
    </HoverCard>
  ),
}

export const TopSide: Story = {
  render: () => (
    <HoverCard>
      <HoverCardTrigger>
        <Button variant="outline" asChild={false}>Top</Button>
      </HoverCardTrigger>
      <HoverCardContent side="top">
        <div className="space-y-2">
          <h4 className="text-sm font-semibold">Appears on top</h4>
          <p className="text-sm text-muted-foreground">
            This card opens above the trigger element.
          </p>
        </div>
      </HoverCardContent>
    </HoverCard>
  ),
}

export const StartAlign: Story = {
  render: () => (
    <HoverCard>
      <HoverCardTrigger>
        <Button variant="outline" asChild={false}>Start</Button>
      </HoverCardTrigger>
      <HoverCardContent align="start">
        <div className="space-y-2">
          <h4 className="text-sm font-semibold">Start aligned</h4>
          <p className="text-sm text-muted-foreground">
            This card is aligned to the start of the trigger.
          </p>
        </div>
      </HoverCardContent>
    </HoverCard>
  ),
}

export const EndAlign: Story = {
  render: () => (
    <HoverCard>
      <HoverCardTrigger>
        <Button variant="outline" asChild={false}>End</Button>
      </HoverCardTrigger>
      <HoverCardContent align="end">
        <div className="space-y-2">
          <h4 className="text-sm font-semibold">End aligned</h4>
          <p className="text-sm text-muted-foreground">
            This card is aligned to the end of the trigger.
          </p>
        </div>
      </HoverCardContent>
    </HoverCard>
  ),
}

export const RichContent: Story = {
  render: () => (
    <HoverCard>
      <HoverCardTrigger>
        <Button variant="outline" asChild={false}>Repository</Button>
      </HoverCardTrigger>
      <HoverCardContent className="w-80 p-0">
        <div className="space-y-3 p-4">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2">
              <Icon name="BookBookmark" className="size-4 text-muted-foreground" />
              <h4 className="text-sm font-semibold">shadcn/ui</h4>
            </div>
            <Button variant="ghost" size="icon-sm" asChild={false}>
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
            <span>
              MIT
            </span>
          </div>
        </div>
      </HoverCardContent>
    </HoverCard>
  ),
}
