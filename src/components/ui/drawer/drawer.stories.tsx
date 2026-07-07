import * as React from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Drawer } from './drawer'

const meta: Meta<typeof Drawer> = {
  title: 'UI/Drawer',
  component: Drawer,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
}

export default meta

export const Default: StoryObj = {
  render: () => (
    <Drawer>
      <Drawer.Trigger asChild>
        <Button variant="outline">Open Drawer</Button>
      </Drawer.Trigger>
      <Drawer.Content title="Drawer Title">
        <div className="p-4 pb-8">
          <p className="text-sm text-muted-foreground">
            This is a basic drawer with content.
          </p>
        </div>
      </Drawer.Content>
    </Drawer>
  ),
}

export const WithHeaderAndFooter: StoryObj = {
  render: () => (
    <Drawer>
      <Drawer.Trigger asChild>
        <Button variant="outline">Edit Profile</Button>
      </Drawer.Trigger>
      <Drawer.Content title="Edit Profile" showDivider>
        <Drawer.Header>
          <Drawer.Title>Edit Profile</Drawer.Title>
          <Drawer.Description>
            Make changes to your profile here. Click save when done.
          </Drawer.Description>
        </Drawer.Header>
        <div className="flex flex-col gap-4 p-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Name</label>
            <Input placeholder="Your name" defaultValue="John Doe" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Email</label>
            <Input placeholder="Your email" defaultValue="john@example.com" />
          </div>
        </div>
        <Drawer.Footer>
          <Button variant="primary">Save changes</Button>
          <Drawer.Close asChild>
            <Button variant="outline">Cancel</Button>
          </Drawer.Close>
        </Drawer.Footer>
      </Drawer.Content>
    </Drawer>
  ),
}

export const TopDirection: StoryObj = {
  render: () => (
    <Drawer direction="top">
      <Drawer.Trigger asChild>
        <Button variant="outline">Open Top</Button>
      </Drawer.Trigger>
      <Drawer.Content title="Top Drawer">
        <div className="p-4 pb-8">
          <p className="text-sm text-muted-foreground">
            This drawer slides in from the top.
          </p>
        </div>
      </Drawer.Content>
    </Drawer>
  ),
}

export const LeftDirection: StoryObj = {
  render: () => (
    <Drawer direction="left">
      <Drawer.Trigger asChild>
        <Button variant="outline">Open Left</Button>
      </Drawer.Trigger>
      <Drawer.Content title="Left Drawer">
        <Drawer.Header>
          <Drawer.Title>Navigation</Drawer.Title>
        </Drawer.Header>
        <div className="flex flex-col gap-2 p-4">
          {['Home', 'Search', 'Settings', 'Profile'].map((item) => (
            <button
              key={item}
              className="flex items-center gap-3 rounded-lg p-3 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground"
            >
              {item}
            </button>
          ))}
        </div>
      </Drawer.Content>
    </Drawer>
  ),
}

export const RightDirection: StoryObj = {
  render: () => (
    <Drawer direction="right">
      <Drawer.Trigger asChild>
        <Button variant="outline">Open Right</Button>
      </Drawer.Trigger>
      <Drawer.Content title="Right Drawer">
        <Drawer.Header>
          <Drawer.Title>Details</Drawer.Title>
          <Drawer.Description>Additional information about the selected item.</Drawer.Description>
        </Drawer.Header>
        <div className="space-y-3 p-4">
          {['Created', 'Modified', 'Size', 'Owner'].map((field) => (
            <div key={field} className="flex justify-between text-sm">
              <span className="text-muted-foreground">{field}</span>
              <span className="font-medium">—</span>
            </div>
          ))}
        </div>
      </Drawer.Content>
    </Drawer>
  ),
}

export const Confirmation: StoryObj = {
  render: () => (
    <Drawer>
      <Drawer.Trigger asChild>
        <Button variant="destructive">Delete Account</Button>
      </Drawer.Trigger>
      <Drawer.Content title="Delete Account" showDivider>
        <Drawer.Header>
          <Drawer.Title>Are you absolutely sure?</Drawer.Title>
          <Drawer.Description>
            This action cannot be undone. This will permanently delete your
            account and remove your data from our servers.
          </Drawer.Description>
        </Drawer.Header>
        <Drawer.Footer>
          <Button variant="destructive">Yes, delete my account</Button>
          <Drawer.Close asChild>
            <Button variant="outline">Cancel</Button>
          </Drawer.Close>
        </Drawer.Footer>
      </Drawer.Content>
    </Drawer>
  ),
}
