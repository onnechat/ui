import * as React from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { Button } from '@/components/ui/button'
import { Icon } from '@/components/icon'
import { DropdownMenu } from './dropdown-menu'

const meta: Meta<typeof DropdownMenu> = {
  title: 'UI/DropdownMenu',
  component: DropdownMenu,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
}

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => (
    <DropdownMenu>
      <DropdownMenu.Trigger asChild>
        <Button variant="outline">Open Menu</Button>
      </DropdownMenu.Trigger>
      <DropdownMenu.Content>
        <DropdownMenu.Group>
          <DropdownMenu.Label>Account</DropdownMenu.Label>
          <DropdownMenu.Item>
            <Icon name="User" className="size-4" />
            Profile
          </DropdownMenu.Item>
          <DropdownMenu.Item>
            <Icon name="Gear" className="size-4" />
            Settings
          </DropdownMenu.Item>
        </DropdownMenu.Group>
        <DropdownMenu.Separator />
        <DropdownMenu.Item>
          <Icon name="CircleLogout" className="size-4" />
          Log out
        </DropdownMenu.Item>
      </DropdownMenu.Content>
    </DropdownMenu>
  ),
}

export const WithShortcuts: Story = {
  render: () => (
    <DropdownMenu>
      <DropdownMenu.Trigger asChild>
        <Button variant="outline">Edit</Button>
      </DropdownMenu.Trigger>
      <DropdownMenu.Content className="w-48">
        <DropdownMenu.Item>
          <Icon name="Undo" className="size-4" />
          Undo
          <DropdownMenu.Shortcut>⌘Z</DropdownMenu.Shortcut>
        </DropdownMenu.Item>
        <DropdownMenu.Item>
          <Icon name="Redo" className="size-4" />
          Redo
          <DropdownMenu.Shortcut>⌘⇧Z</DropdownMenu.Shortcut>
        </DropdownMenu.Item>
        <DropdownMenu.Separator />
        <DropdownMenu.Item>
          <Icon name="Clipboard" className="size-4" />
          Copy
          <DropdownMenu.Shortcut>⌘C</DropdownMenu.Shortcut>
        </DropdownMenu.Item>
        <DropdownMenu.Item>
          <Icon name="Scissors" className="size-4" />
          Cut
          <DropdownMenu.Shortcut>⌘X</DropdownMenu.Shortcut>
        </DropdownMenu.Item>
        <DropdownMenu.Item>
          <Icon name="ClipboardCheck" className="size-4" />
          Paste
          <DropdownMenu.Shortcut>⌘V</DropdownMenu.Shortcut>
        </DropdownMenu.Item>
      </DropdownMenu.Content>
    </DropdownMenu>
  ),
}

export const Destructive: Story = {
  render: () => (
    <DropdownMenu>
      <DropdownMenu.Trigger asChild>
        <Button variant="outline">Actions</Button>
      </DropdownMenu.Trigger>
      <DropdownMenu.Content className="w-48">
        <DropdownMenu.Group>
          <DropdownMenu.Label>Danger Zone</DropdownMenu.Label>
        </DropdownMenu.Group>
        <DropdownMenu.Separator />
        <DropdownMenu.Item variant="destructive">
          <Icon name="Trash" className="size-4" />
          Delete
        </DropdownMenu.Item>
        <DropdownMenu.Item variant="destructive">
          <Icon name="Bomb" className="size-4" />
          Destroy
        </DropdownMenu.Item>
      </DropdownMenu.Content>
    </DropdownMenu>
  ),
}

export const Checkboxes: Story = {
  render: function CheckboxStory() {
    const [showStatus, setShowStatus] = React.useState(true)
    const [showBar, setShowBar] = React.useState(false)

    return (
      <DropdownMenu>
        <DropdownMenu.Trigger asChild>
          <Button variant="outline">View</Button>
        </DropdownMenu.Trigger>
        <DropdownMenu.Content className="w-48">
          <DropdownMenu.Group>
            <DropdownMenu.Label>Appearance</DropdownMenu.Label>
          </DropdownMenu.Group>
          <DropdownMenu.Separator />
          <DropdownMenu.CheckboxItem
            checked={showStatus}
            onCheckedChange={setShowStatus}
          >
            Status Bar
          </DropdownMenu.CheckboxItem>
          <DropdownMenu.CheckboxItem
            checked={showBar}
            onCheckedChange={setShowBar}
          >
            Sidebar
          </DropdownMenu.CheckboxItem>
          <DropdownMenu.CheckboxItem checked disabled>
            Activity Bar
          </DropdownMenu.CheckboxItem>
        </DropdownMenu.Content>
      </DropdownMenu>
    )
  },
}

export const RadioGroup: Story = {
  render: function RadioStory() {
    const [position, setPosition] = React.useState('bottom')

    return (
      <DropdownMenu>
        <DropdownMenu.Trigger asChild>
          <Button variant="outline">Position</Button>
        </DropdownMenu.Trigger>
        <DropdownMenu.Content className="w-44">
          <DropdownMenu.Group>
            <DropdownMenu.Label>Panel Position</DropdownMenu.Label>
          </DropdownMenu.Group>
          <DropdownMenu.Separator />
          <DropdownMenu.RadioGroup
            value={position}
            onValueChange={setPosition}
          >
            <DropdownMenu.RadioItem value="top">Top</DropdownMenu.RadioItem>
            <DropdownMenu.RadioItem value="bottom">
              Bottom
            </DropdownMenu.RadioItem>
            <DropdownMenu.RadioItem value="left">Left</DropdownMenu.RadioItem>
            <DropdownMenu.RadioItem value="right">Right</DropdownMenu.RadioItem>
          </DropdownMenu.RadioGroup>
        </DropdownMenu.Content>
      </DropdownMenu>
    )
  },
}

export const Submenu: Story = {
  render: () => (
    <DropdownMenu>
      <DropdownMenu.Trigger asChild>
        <Button variant="outline">Share</Button>
      </DropdownMenu.Trigger>
      <DropdownMenu.Content className="w-48">
        <DropdownMenu.Item>
          <Icon name="Link" className="size-4" />
          Copy link
        </DropdownMenu.Item>
        <DropdownMenu.Sub>
          <DropdownMenu.SubTrigger>
            <Icon name="Nodes" className="size-4" />
            Share via
          </DropdownMenu.SubTrigger>
          <DropdownMenu.Portal>
            <DropdownMenu.SubContent className="w-40">
              <DropdownMenu.Item>
                <Icon name="Envelope" className="size-4" />
                Email
              </DropdownMenu.Item>
              <DropdownMenu.Item>
                <Icon name="Message" className="size-4" />
                Message
              </DropdownMenu.Item>
              <DropdownMenu.Separator />
              <DropdownMenu.Item>
                <Icon name="Sitemap" className="size-4" />
                More...
              </DropdownMenu.Item>
            </DropdownMenu.SubContent>
          </DropdownMenu.Portal>
        </DropdownMenu.Sub>
        <DropdownMenu.Separator />
        <DropdownMenu.Item>
          <Icon name="Bookmark" className="size-4" />
          Save
          <DropdownMenu.Shortcut>⌘S</DropdownMenu.Shortcut>
        </DropdownMenu.Item>
      </DropdownMenu.Content>
    </DropdownMenu>
  ),
}

export const Insets: Story = {
  render: () => (
    <DropdownMenu>
      <DropdownMenu.Trigger asChild>
        <Button variant="outline">Inset</Button>
      </DropdownMenu.Trigger>
      <DropdownMenu.Content className="w-48">
        <DropdownMenu.Group>
          <DropdownMenu.Label inset>Actions</DropdownMenu.Label>
          <DropdownMenu.Item inset>
            <Icon name="Pencil" className="size-4" />
            Edit
          </DropdownMenu.Item>
          <DropdownMenu.Item inset>
            <Icon name="Copy" className="size-4" />
            Duplicate
          </DropdownMenu.Item>
        </DropdownMenu.Group>
        <DropdownMenu.Separator />
        <DropdownMenu.Group>
          <DropdownMenu.Label inset>Danger</DropdownMenu.Label>
          <DropdownMenu.Item inset variant="destructive">
            <Icon name="Trash" className="size-4" />
            Delete
          </DropdownMenu.Item>
        </DropdownMenu.Group>
      </DropdownMenu.Content>
    </DropdownMenu>
  ),
}

export const DisabledItems: Story = {
  render: () => (
    <DropdownMenu>
      <DropdownMenu.Trigger asChild>
        <Button variant="outline">Options</Button>
      </DropdownMenu.Trigger>
      <DropdownMenu.Content className="w-44">
        <DropdownMenu.Item>
          <Icon name="Eye" className="size-4" />
          View
        </DropdownMenu.Item>
        <DropdownMenu.Item disabled>
          <Icon name="Pencil" className="size-4" />
          Edit
        </DropdownMenu.Item>
        <DropdownMenu.Item disabled>
          <Icon name="Trash" className="size-4" />
          Delete
        </DropdownMenu.Item>
        <DropdownMenu.Separator />
        <DropdownMenu.Item>
          <Icon name="Nodes" className="size-4" />
          Share
        </DropdownMenu.Item>
      </DropdownMenu.Content>
    </DropdownMenu>
  ),
}

export const WithPortal: Story = {
  render: () => (
    <DropdownMenu>
      <DropdownMenu.Trigger asChild>
        <Button variant="outline">Portal</Button>
      </DropdownMenu.Trigger>
      <DropdownMenu.Portal>
        <DropdownMenu.Content className="w-48">
          <DropdownMenu.Item>
            <Icon name="User" className="size-4" />
            Profile
          </DropdownMenu.Item>
          <DropdownMenu.Item>
            <Icon name="Gear" className="size-4" />
            Settings
          </DropdownMenu.Item>
          <DropdownMenu.Item>
            <Icon name="CircleLogout" className="size-4" />
            Log out
          </DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu>
  ),
}
