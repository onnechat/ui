import * as React from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { Icon } from '@/components/icon'
import { Button } from '@/components/ui/button'
import { Collapsible, CollapsibleContent } from './collapsible'

const meta: Meta<typeof Collapsible> = {
  title: 'UI/Collapsible',
  component: Collapsible,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
}

export default meta

function CollapsibleDemo({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = React.useState(false)

  return (
    <Collapsible
      open={open}
      onOpenChange={setOpen}
      className="w-80"
    >
      <button
        type="button"
        className="flex w-full items-center justify-between rounded-lg px-4 py-3 text-sm font-medium hover:bg-muted/50"
        onClick={() => setOpen(!open)}
      >
        <span>Toggle Panel</span>
        <Icon
          name="ChevronDown"
          className="size-4 text-muted-foreground transition-transform duration-200"
          style={{ transform: open ? 'rotate(180deg)' : 'rotate(0deg)' }}
        />
      </button>
      <CollapsibleContent>{children}</CollapsibleContent>
    </Collapsible>
  )
}

export const Default: StoryObj = {
  render: () => (
    <CollapsibleDemo>
      <div className="space-y-2">
        <p className="text-sm text-muted-foreground">
          This content is hidden by default and animates in when toggled.
        </p>
      </div>
    </CollapsibleDemo>
  ),
}

export const RichContent: StoryObj = {
  render: () => (
    <CollapsibleDemo>
      <div className="space-y-3">
        <p className="text-sm text-muted-foreground">
          Collapsible panels can contain rich content including forms, lists,
          and interactive elements.
        </p>
        <div className="flex flex-col gap-2">
          {['Option A', 'Option B', 'Option C'].map((opt) => (
            <label
              key={opt}
              className="flex items-center gap-2 rounded-md border bg-card px-3 py-2 text-sm"
            >
              <input type="radio" name="demo" className="accent-primary" />
              {opt}
            </label>
          ))}
        </div>
        <div className="flex justify-end gap-2 pt-2">
          <Button variant="outline" size="sm">
            Cancel
          </Button>
          <Button variant="primary" size="sm">
            Save
          </Button>
        </div>
      </div>
    </CollapsibleDemo>
  ),
}

export const RowVariant: StoryObj = {
  render: () => {
    const [open, setOpen] = React.useState(false)

    return (
      <Collapsible
        open={open}
        onOpenChange={setOpen}
        variant="row"
        className="w-80"
      >
        <button
          type="button"
          className="flex w-full items-center justify-between px-4 py-3 text-sm font-medium"
          onClick={() => setOpen(!open)}
        >
          Row Variant
          <Icon
            name="ChevronDown"
            className="size-4 text-muted-foreground transition-transform duration-200"
            style={{ transform: open ? 'rotate(180deg)' : 'rotate(0deg)' }}
          />
        </button>
        <CollapsibleContent>
          <div className="px-4 pb-3 pt-1">
            <p className="text-sm text-muted-foreground">
              The row variant has no card background or border — just
              the content padding.
            </p>
          </div>
        </CollapsibleContent>
      </Collapsible>
    )
  },
}
