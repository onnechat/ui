import * as React from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { Icon } from '@/components/icon'
import { Button } from '@/components/ui/button'
import { Kbd } from '@/components/ui/kbd'
import { Command } from './command'

const meta: Meta<typeof Command> = {
  title: 'UI/Command',
  component: Command,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
}

export default meta

export const Default: StoryObj = {
  render: () => (
    <div className="w-full max-w-md">
      <Command>
        <Command.Input placeholder="Type a command or search…" />
        <Command.List>
          <Command.Empty>No results found.</Command.Empty>
          <Command.Group heading="Suggestions">
            <Command.Item onSelect={() => {}}>
              <Icon name="Calendar" className="size-4" />
              Calendar
            </Command.Item>
            <Command.Item onSelect={() => {}}>
              <Icon name="Envelope" className="size-4" />
              Mail
            </Command.Item>
            <Command.Item onSelect={() => {}}>
              <Icon name="Gear" className="size-4" />
              Settings
            </Command.Item>
          </Command.Group>
          <Command.Group heading="People">
            <Command.Item onSelect={() => {}}>
              <Icon name="User" className="size-4" />
              John Doe
            </Command.Item>
            <Command.Item onSelect={() => {}}>
              <Icon name="User" className="size-4" />
              Jane Smith
            </Command.Item>
          </Command.Group>
        </Command.List>
      </Command>
    </div>
  ),
}

export const WithShortcuts: StoryObj = {
  render: () => (
    <div className="w-full max-w-md">
      <Command>
        <Command.Input placeholder="Search actions…" />
        <Command.List>
          <Command.Empty>No results found.</Command.Empty>
          <Command.Group heading="Actions">
            <Command.Item onSelect={() => {}}>
              <Icon name="Copy" className="size-4" />
              Copy
              <Command.Shortcut>⌘C</Command.Shortcut>
            </Command.Item>
            <Command.Item onSelect={() => {}}>
              <Icon name="ClipboardCheck" className="size-4" />
              Paste
              <Command.Shortcut>⌘V</Command.Shortcut>
            </Command.Item>
            <Command.Item onSelect={() => {}}>
              <Icon name="Magnifier" className="size-4" />
              Search
              <Command.Shortcut>⌘F</Command.Shortcut>
            </Command.Item>
            <Command.Item onSelect={() => {}}>
              <Icon name="Undo" className="size-4" />
              Undo
              <Command.Shortcut>⌘Z</Command.Shortcut>
            </Command.Item>
            <Command.Item onSelect={() => {}}>
              <Icon name="Redo" className="size-4" />
              Redo
              <Command.Shortcut>⌘⇧Z</Command.Shortcut>
            </Command.Item>
          </Command.Group>
        </Command.List>
      </Command>
    </div>
  ),
}

export const WithDisabledItems: StoryObj = {
  render: () => (
    <div className="w-full max-w-md">
      <Command>
        <Command.Input placeholder="Type to filter…" />
        <Command.List>
          <Command.Empty>No results found.</Command.Empty>
          <Command.Group heading="Available">
            <Command.Item onSelect={() => {}}>
              <Icon name="Eye" className="size-4" />
              View
            </Command.Item>
            <Command.Item onSelect={() => {}}>
              <Icon name="Pencil" className="size-4" />
              Edit
            </Command.Item>
          </Command.Group>
          <Command.Group heading="Unavailable">
            <Command.Item disabled onSelect={() => {}}>
              <Icon name="Trash" className="size-4" />
              Delete
            </Command.Item>
            <Command.Item disabled onSelect={() => {}}>
              <Icon name="Bomb" className="size-4" />
              Destroy
            </Command.Item>
          </Command.Group>
        </Command.List>
      </Command>
    </div>
  ),
}

export const Filtering: StoryObj = {
  render: function FilteringStory() {
    const items = [
      { label: 'Apple', category: 'Fruits' },
      { label: 'Banana', category: 'Fruits' },
      { label: 'Cherry', category: 'Fruits' },
      { label: 'Carrot', category: 'Vegetables' },
      { label: 'Broccoli', category: 'Vegetables' },
      { label: 'Chicken', category: 'Meat' },
      { label: 'Salmon', category: 'Fish' },
    ]

    return (
      <div className="w-full max-w-md">
        <Command>
          <Command.Input placeholder="Search items…" />
          <Command.List>
            <Command.Empty>No results found.</Command.Empty>
            <Command.Group heading="Items">
              {items.map((item) => (
                <Command.Item key={item.label} value={item.label} onSelect={() => {}}>
                  <Icon name="Dots" className="size-4" />
                  {item.label}
                  <span className="ml-auto text-xs text-muted-foreground">
                    {item.category}
                  </span>
                </Command.Item>
              ))}
            </Command.Group>
          </Command.List>
        </Command>
      </div>
    )
  },
}

export const DialogMode: StoryObj = {
  render: () => {
    const [open, setOpen] = React.useState(false)

    return (
      <>
        <Button variant="outline" onClick={() => setOpen(true)}>
          <Icon name="Magnifier" className="size-4" />
          Open Command Palette
          <Kbd keys={['Mod', 'K']} className="ml-2" />
        </Button>

        <Command.Dialog
          open={open}
          onOpenChange={setOpen}
          title="Command Palette"
          description="Search for commands…"
        >
          <Command.Input placeholder="Type a command or search…" />
          <Command.List>
            <Command.Empty>No results found.</Command.Empty>
            <Command.Group heading="Navigation" className="pb-4">
              <Command.Item
                onSelect={() => {
                  setOpen(false)
                }}
              >
                <Icon name="User" className="size-4" />
                Profile
                <Command.Shortcut>⌘P</Command.Shortcut>
              </Command.Item>
              <Command.Item
                onSelect={() => {
                  setOpen(false)
                }}
              >
                <Icon name="Gear" className="size-4" />
                Settings
                <Command.Shortcut>⌘,</Command.Shortcut>
              </Command.Item>
              <Command.Item
                onSelect={() => {
                  setOpen(false)
                }}
              >
                <Icon name="Envelope" className="size-4" />
                Messages
                <Command.Shortcut>⌘M</Command.Shortcut>
              </Command.Item>
            </Command.Group>
            <Command.Group heading="Actions" className="pb-4">
              <Command.Item
                onSelect={() => {
                  setOpen(false)
                }}
              >
                <Icon name="Plus" className="size-4" />
                New file
                <Command.Shortcut>⌘N</Command.Shortcut>
              </Command.Item>
              <Command.Item
                onSelect={() => {
                  setOpen(false)
                }}
              >
                <Icon name="Magnifier" className="size-4" />
                Find in files
                <Command.Shortcut>⌘⇧F</Command.Shortcut>
              </Command.Item>
            </Command.Group>
          </Command.List>

          <Command.Footer />
        </Command.Dialog>
      </>
    )
  },
}
