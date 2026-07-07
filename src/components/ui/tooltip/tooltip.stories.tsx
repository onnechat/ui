import type { Meta, StoryObj } from '@storybook/react-vite'
import { Tooltip } from './tooltip'
import { Button } from '@/components/ui/button'

const meta: Meta<typeof Tooltip> = {
  title: 'UI/Tooltip',
  component: Tooltip,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
}

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => (
    <Tooltip>
      <Tooltip.Trigger asChild>
        <Button variant="outline">Hover me</Button>
      </Tooltip.Trigger>
      <Tooltip.Content>This is a tooltip</Tooltip.Content>
    </Tooltip>
  ),
}

export const Positions: StoryObj = {
  render: () => (
    <div className="flex flex-wrap gap-2">
      <Tooltip>
        <Tooltip.Trigger asChild>
          <Button variant="outline" size="sm">Top</Button>
        </Tooltip.Trigger>
        <Tooltip.Content side="top">Tooltip on top</Tooltip.Content>
      </Tooltip>
      <Tooltip>
        <Tooltip.Trigger asChild>
          <Button variant="outline" size="sm">Bottom</Button>
        </Tooltip.Trigger>
        <Tooltip.Content side="bottom">Tooltip on bottom</Tooltip.Content>
      </Tooltip>
      <Tooltip>
        <Tooltip.Trigger asChild>
          <Button variant="outline" size="sm">Left</Button>
        </Tooltip.Trigger>
        <Tooltip.Content side="left">Tooltip on left</Tooltip.Content>
      </Tooltip>
      <Tooltip>
        <Tooltip.Trigger asChild>
          <Button variant="outline" size="sm">Right</Button>
        </Tooltip.Trigger>
        <Tooltip.Content side="right">Tooltip on right</Tooltip.Content>
      </Tooltip>
    </div>
  ),
}

export const Alignments: StoryObj = {
  render: () => (
    <div className="flex flex-wrap gap-2">
      <Tooltip>
        <Tooltip.Trigger asChild>
          <Button variant="outline" size="sm">Start</Button>
        </Tooltip.Trigger>
        <Tooltip.Content side="bottom" align="start">
          Aligned start
        </Tooltip.Content>
      </Tooltip>
      <Tooltip>
        <Tooltip.Trigger asChild>
          <Button variant="outline" size="sm">Center</Button>
        </Tooltip.Trigger>
        <Tooltip.Content side="bottom" align="center">
          Aligned center
        </Tooltip.Content>
      </Tooltip>
      <Tooltip>
        <Tooltip.Trigger asChild>
          <Button variant="outline" size="sm">End</Button>
        </Tooltip.Trigger>
        <Tooltip.Content side="bottom" align="end">
          Aligned end
        </Tooltip.Content>
      </Tooltip>
    </div>
  ),
}

export const CustomColors: StoryObj = {
  render: () => (
    <div className="flex flex-wrap gap-2">
      <Tooltip>
        <Tooltip.Trigger asChild>
          <Button variant="destructive" size="sm">Danger</Button>
        </Tooltip.Trigger>
        <Tooltip.Content className="bg-destructive text-destructive-foreground">
          This action is irreversible
        </Tooltip.Content>
      </Tooltip>
      <Tooltip>
        <Tooltip.Trigger asChild>
          <Button variant="outline" size="sm">Success</Button>
        </Tooltip.Trigger>
        <Tooltip.Content className="bg-success text-success-foreground">
          All checks passed
        </Tooltip.Content>
      </Tooltip>
      <Tooltip>
        <Tooltip.Trigger asChild>
          <Button variant="secondary" size="sm">Card</Button>
        </Tooltip.Trigger>
        <Tooltip.Content className="bg-popover text-popover-foreground border border-border shadow-md">
          Card-styled tooltip
        </Tooltip.Content>
      </Tooltip>
    </div>
  ),
}

export const LongContent: StoryObj = {
  render: () => (
    <Tooltip>
      <Tooltip.Trigger asChild>
        <Button variant="outline">Info</Button>
      </Tooltip.Trigger>
      <Tooltip.Content className="max-w-64">
        This is a longer tooltip that demonstrates how content wraps when it exceeds reasonable width constraints.
      </Tooltip.Content>
    </Tooltip>
  ),
}

export const RichContent: StoryObj = {
  render: () => (
    <Tooltip>
      <Tooltip.Trigger asChild>
        <Button variant="secondary" size="sm">
          ?
        </Button>
      </Tooltip.Trigger>
      <Tooltip.Content className="flex flex-col gap-1 max-w-48">
        <span className="font-semibold">Keyboard shortcut</span>
        <span className="text-xs opacity-80">Press Cmd+K to open the command palette.</span>
      </Tooltip.Content>
    </Tooltip>
  ),
}

export const DisabledTrigger: StoryObj = {
  render: () => (
    <Tooltip>
      <Tooltip.Trigger asChild>
        <span className="inline-block cursor-default" tabIndex={0}>
          <Button disabled>Disabled button</Button>
        </span>
      </Tooltip.Trigger>
      <Tooltip.Content>Complete the form above to enable</Tooltip.Content>
    </Tooltip>
  ),
}
