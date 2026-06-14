import type { Meta, StoryObj } from '@storybook/react-vite'
import { Tooltip, TooltipContent, TooltipTrigger } from './tooltip'
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
      <TooltipTrigger asChild>
        <Button variant="outline">Hover me</Button>
      </TooltipTrigger>
      <TooltipContent>This is a tooltip</TooltipContent>
    </Tooltip>
  ),
}

export const Positions: StoryObj = {
  render: () => (
    <div className="flex flex-wrap gap-2">
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="outline" size="sm">Top</Button>
        </TooltipTrigger>
        <TooltipContent side="top">Tooltip on top</TooltipContent>
      </Tooltip>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="outline" size="sm">Bottom</Button>
        </TooltipTrigger>
        <TooltipContent side="bottom">Tooltip on bottom</TooltipContent>
      </Tooltip>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="outline" size="sm">Left</Button>
        </TooltipTrigger>
        <TooltipContent side="left">Tooltip on left</TooltipContent>
      </Tooltip>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="outline" size="sm">Right</Button>
        </TooltipTrigger>
        <TooltipContent side="right">Tooltip on right</TooltipContent>
      </Tooltip>
    </div>
  ),
}

export const Alignments: StoryObj = {
  render: () => (
    <div className="flex flex-wrap gap-2">
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="outline" size="sm">Start</Button>
        </TooltipTrigger>
        <TooltipContent side="bottom" align="start">
          Aligned start
        </TooltipContent>
      </Tooltip>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="outline" size="sm">Center</Button>
        </TooltipTrigger>
        <TooltipContent side="bottom" align="center">
          Aligned center
        </TooltipContent>
      </Tooltip>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="outline" size="sm">End</Button>
        </TooltipTrigger>
        <TooltipContent side="bottom" align="end">
          Aligned end
        </TooltipContent>
      </Tooltip>
    </div>
  ),
}

export const CustomColors: StoryObj = {
  render: () => (
    <div className="flex flex-wrap gap-2">
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="destructive" size="sm">Danger</Button>
        </TooltipTrigger>
        <TooltipContent className="bg-destructive text-destructive-foreground">
          This action is irreversible
        </TooltipContent>
      </Tooltip>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="outline" size="sm">Success</Button>
        </TooltipTrigger>
        <TooltipContent className="bg-success text-success-foreground">
          All checks passed
        </TooltipContent>
      </Tooltip>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="secondary" size="sm">Card</Button>
        </TooltipTrigger>
        <TooltipContent className="bg-popover text-popover-foreground border border-border shadow-md">
          Card-styled tooltip
        </TooltipContent>
      </Tooltip>
    </div>
  ),
}

export const LongContent: StoryObj = {
  render: () => (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button variant="outline">Info</Button>
      </TooltipTrigger>
      <TooltipContent className="max-w-64">
        This is a longer tooltip that demonstrates how content wraps when it exceeds reasonable width constraints.
      </TooltipContent>
    </Tooltip>
  ),
}

export const RichContent: StoryObj = {
  render: () => (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button variant="secondary" size="sm">
          ?
        </Button>
      </TooltipTrigger>
      <TooltipContent className="flex flex-col gap-1 max-w-48">
        <span className="font-semibold">Keyboard shortcut</span>
        <span className="text-xs opacity-80">Press Cmd+K to open the command palette.</span>
      </TooltipContent>
    </Tooltip>
  ),
}

export const DisabledTrigger: StoryObj = {
  render: () => (
    <Tooltip>
      <TooltipTrigger asChild>
        <span className="inline-block cursor-default" tabIndex={0}>
          <Button disabled>Disabled button</Button>
        </span>
      </TooltipTrigger>
      <TooltipContent>Complete the form above to enable</TooltipContent>
    </Tooltip>
  ),
}
