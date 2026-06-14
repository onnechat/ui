import * as React from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { Icon } from '@/components/icon'
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from './command'

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
        <CommandInput placeholder="Type a command or search…" />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup heading="Suggestions">
            <CommandItem onSelect={() => {}}>
              <Icon name="Calendar" className="size-4" />
              Calendar
            </CommandItem>
            <CommandItem onSelect={() => {}}>
              <Icon name="Envelope" className="size-4" />
              Mail
            </CommandItem>
            <CommandItem onSelect={() => {}}>
              <Icon name="Gear" className="size-4" />
              Settings
            </CommandItem>
          </CommandGroup>
          <CommandSeparator />
          <CommandGroup heading="People">
            <CommandItem onSelect={() => {}}>
              <Icon name="User" className="size-4" />
              John Doe
            </CommandItem>
            <CommandItem onSelect={() => {}}>
              <Icon name="User" className="size-4" />
              Jane Smith
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </Command>
    </div>
  ),
}

export const WithShortcuts: StoryObj = {
  render: () => (
    <div className="w-full max-w-md">
      <Command>
        <CommandInput placeholder="Search actions…" />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup heading="Actions">
            <CommandItem onSelect={() => {}}>
              <Icon name="Copy" className="size-4" />
              Copy
              <CommandShortcut>⌘C</CommandShortcut>
            </CommandItem>
            <CommandItem onSelect={() => {}}>
              <Icon name="ClipboardCheck" className="size-4" />
              Paste
              <CommandShortcut>⌘V</CommandShortcut>
            </CommandItem>
            <CommandItem onSelect={() => {}}>
              <Icon name="Magnifier" className="size-4" />
              Search
              <CommandShortcut>⌘F</CommandShortcut>
            </CommandItem>
            <CommandItem onSelect={() => {}}>
              <Icon name="Undo" className="size-4" />
              Undo
              <CommandShortcut>⌘Z</CommandShortcut>
            </CommandItem>
            <CommandItem onSelect={() => {}}>
              <Icon name="Redo" className="size-4" />
              Redo
              <CommandShortcut>⌘⇧Z</CommandShortcut>
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </Command>
    </div>
  ),
}

export const WithDisabledItems: StoryObj = {
  render: () => (
    <div className="w-full max-w-md">
      <Command>
        <CommandInput placeholder="Type to filter…" />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup heading="Available">
            <CommandItem onSelect={() => {}}>
              <Icon name="Eye" className="size-4" />
              View
            </CommandItem>
            <CommandItem onSelect={() => {}}>
              <Icon name="Pencil" className="size-4" />
              Edit
            </CommandItem>
          </CommandGroup>
          <CommandSeparator />
          <CommandGroup heading="Unavailable">
            <CommandItem disabled onSelect={() => {}}>
              <Icon name="Trash" className="size-4" />
              Delete
            </CommandItem>
            <CommandItem disabled onSelect={() => {}}>
              <Icon name="Bomb" className="size-4" />
              Destroy
            </CommandItem>
          </CommandGroup>
        </CommandList>
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
          <CommandInput placeholder="Search items…" />
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup heading="Items">
              {items.map((item) => (
                <CommandItem key={item.label} value={item.label} onSelect={() => {}}>
                  <Icon name="Dots" className="size-4" />
                  {item.label}
                  <span className="ml-auto text-xs text-muted-foreground">
                    {item.category}
                  </span>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
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
        <button
          type="button"
          className="inline-flex items-center gap-2 rounded-lg border bg-card px-4 py-2 text-sm font-medium shadow-sm hover:bg-accent"
          onClick={() => setOpen(true)}
        >
          <Icon name="Magnifier" className="size-4" />
          Open Command Palette
          <kbd className="ml-4 inline-flex items-center gap-1 rounded border bg-muted px-1.5 py-0.5 font-mono text-[0.7em] text-muted-foreground">
            ⌘K
          </kbd>
        </button>

        <CommandDialog
          open={open}
          onOpenChange={setOpen}
          title="Command Palette"
          description="Search for commands…"
        >
          <CommandInput placeholder="Type a command or search…" />
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup heading="Navigation">
              <CommandItem
                onSelect={() => {
                  setOpen(false)
                }}
              >
                <Icon name="User" className="size-4" />
                Profile
                <CommandShortcut>⌘P</CommandShortcut>
              </CommandItem>
              <CommandItem
                onSelect={() => {
                  setOpen(false)
                }}
              >
                <Icon name="Gear" className="size-4" />
                Settings
                <CommandShortcut>⌘,</CommandShortcut>
              </CommandItem>
              <CommandItem
                onSelect={() => {
                  setOpen(false)
                }}
              >
                <Icon name="Envelope" className="size-4" />
                Messages
                <CommandShortcut>⌘M</CommandShortcut>
              </CommandItem>
            </CommandGroup>
            <CommandSeparator />
            <CommandGroup heading="Actions">
              <CommandItem
                onSelect={() => {
                  setOpen(false)
                }}
              >
                <Icon name="Plus" className="size-4" />
                New file
                <CommandShortcut>⌘N</CommandShortcut>
              </CommandItem>
              <CommandItem
                onSelect={() => {
                  setOpen(false)
                }}
              >
                <Icon name="Magnifier" className="size-4" />
                Find in files
                <CommandShortcut>⌘⇧F</CommandShortcut>
              </CommandItem>
            </CommandGroup>
          </CommandList>
        </CommandDialog>
      </>
    )
  },
}
