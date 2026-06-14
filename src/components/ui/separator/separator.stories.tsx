import type { Meta, StoryObj } from '@storybook/react-vite'
import { Separator } from './separator'

const meta: Meta<typeof Separator> = {
  title: 'UI/Separator',
  component: Separator,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
}

export default meta

export const Horizontal: StoryObj = {
  render: () => (
    <div className="flex w-72 flex-col gap-3">
      <span className="text-sm">Above</span>
      <Separator />
      <span className="text-sm">Below</span>
    </div>
  ),
}

export const Vertical: StoryObj = {
  render: () => (
    <div className="flex h-8 items-center gap-3">
      <span className="text-sm">Left</span>
      <Separator orientation="vertical" />
      <span className="text-sm">Right</span>
    </div>
  ),
}

export const WithContent: StoryObj = {
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
}
