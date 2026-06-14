import * as React from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from './drawer'

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
      <DrawerTrigger asChild>
        <Button variant="outline">Open Drawer</Button>
      </DrawerTrigger>
      <DrawerContent title="Drawer Title">
        <div className="p-4 pb-8">
          <p className="text-sm text-muted-foreground">
            This is a basic drawer with content.
          </p>
        </div>
      </DrawerContent>
    </Drawer>
  ),
}

export const WithHeaderAndFooter: StoryObj = {
  render: () => (
    <Drawer>
      <DrawerTrigger asChild>
        <Button variant="outline">Edit Profile</Button>
      </DrawerTrigger>
      <DrawerContent title="Edit Profile" showDivider>
        <DrawerHeader>
          <DrawerTitle>Edit Profile</DrawerTitle>
          <DrawerDescription>
            Make changes to your profile here. Click save when done.
          </DrawerDescription>
        </DrawerHeader>
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
        <DrawerFooter>
          <Button variant="primary">Save changes</Button>
          <DrawerClose asChild>
            <Button variant="outline">Cancel</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  ),
}

export const TopDirection: StoryObj = {
  render: () => (
    <Drawer direction="top">
      <DrawerTrigger asChild>
        <Button variant="outline">Open Top</Button>
      </DrawerTrigger>
      <DrawerContent title="Top Drawer">
        <div className="p-4 pb-8">
          <p className="text-sm text-muted-foreground">
            This drawer slides in from the top.
          </p>
        </div>
      </DrawerContent>
    </Drawer>
  ),
}

export const LeftDirection: StoryObj = {
  render: () => (
    <Drawer direction="left">
      <DrawerTrigger asChild>
        <Button variant="outline">Open Left</Button>
      </DrawerTrigger>
      <DrawerContent title="Left Drawer">
        <DrawerHeader>
          <DrawerTitle>Navigation</DrawerTitle>
        </DrawerHeader>
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
      </DrawerContent>
    </Drawer>
  ),
}

export const RightDirection: StoryObj = {
  render: () => (
    <Drawer direction="right">
      <DrawerTrigger asChild>
        <Button variant="outline">Open Right</Button>
      </DrawerTrigger>
      <DrawerContent title="Right Drawer">
        <DrawerHeader>
          <DrawerTitle>Details</DrawerTitle>
          <DrawerDescription>Additional information about the selected item.</DrawerDescription>
        </DrawerHeader>
        <div className="space-y-3 p-4">
          {['Created', 'Modified', 'Size', 'Owner'].map((field) => (
            <div key={field} className="flex justify-between text-sm">
              <span className="text-muted-foreground">{field}</span>
              <span className="font-medium">—</span>
            </div>
          ))}
        </div>
      </DrawerContent>
    </Drawer>
  ),
}

export const Confirmation: StoryObj = {
  render: () => (
    <Drawer>
      <DrawerTrigger asChild>
        <Button variant="destructive">Delete Account</Button>
      </DrawerTrigger>
      <DrawerContent title="Delete Account" showDivider>
        <DrawerHeader>
          <DrawerTitle>Are you absolutely sure?</DrawerTitle>
          <DrawerDescription>
            This action cannot be undone. This will permanently delete your
            account and remove your data from our servers.
          </DrawerDescription>
        </DrawerHeader>
        <DrawerFooter>
          <Button variant="destructive">Yes, delete my account</Button>
          <DrawerClose asChild>
            <Button variant="outline">Cancel</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  ),
}
