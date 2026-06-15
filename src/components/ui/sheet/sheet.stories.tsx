import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, within } from 'storybook/test';
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
  SheetClose,
} from './sheet';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const meta: Meta<typeof Sheet> = {
  title: 'UI/Sheet',
  component: Sheet,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs', 'new'],
};

export default meta;

export const Right: StoryObj<typeof meta> = {
  render: () => (
    <Sheet>
      <SheetTrigger render={<Button variant="outline">Open Sheet (Right)</Button>} />
      <SheetContent side="right">
        <SheetHeader>
          <SheetTitle>Sheet Title</SheetTitle>
          <SheetDescription>
            This is a sheet that slides in from the right.
          </SheetDescription>
        </SheetHeader>
        <div className="flex-1 px-4">
          <p className="text-sm text-muted-foreground">Sheet content goes here.</p>
        </div>
        <SheetFooter>
          <SheetClose render={<Button variant="outline">Cancel</Button>} />
          <SheetClose render={<Button variant="primary">Save</Button>} />
        </SheetFooter>
      </SheetContent>
    </Sheet>
  ),
  play: async ({ canvas, canvasElement, userEvent }) => {
    await userEvent.click(canvas.getByRole('button', { name: /open sheet/i }));
    const body = within(canvasElement.ownerDocument.body);
    await expect(await body.findByRole('heading', { name: 'Sheet Title' })).toBeVisible();
  },
};

export const Left: StoryObj<typeof meta> = {
  render: () => (
    <Sheet>
      <SheetTrigger render={<Button variant="outline">Open Sheet (Left)</Button>} />
      <SheetContent side="left">
        <SheetHeader>
          <SheetTitle>Navigation</SheetTitle>
        </SheetHeader>
        <div className="flex flex-col gap-1 px-4">
          {['Home', 'Products', 'About', 'Contact'].map((label) => (
            <SheetClose key={label} render={<Button variant="ghost" className="justify-start">{label}</Button>} />
          ))}
        </div>
      </SheetContent>
    </Sheet>
  ),
  play: async ({ canvas, canvasElement, userEvent }) => {
    await userEvent.click(canvas.getByRole('button', { name: /left/i }));
    const body = within(canvasElement.ownerDocument.body);
    await expect(await body.findByRole('heading', { name: 'Navigation' })).toBeVisible();
  },
};

export const Top: StoryObj<typeof meta> = {
  render: () => (
    <Sheet>
      <SheetTrigger render={<Button variant="outline">Open Sheet (Top)</Button>} />
      <SheetContent side="top">
        <SheetHeader>
          <SheetTitle>Notifications</SheetTitle>
          <SheetDescription>You have 3 new notifications.</SheetDescription>
        </SheetHeader>
      </SheetContent>
    </Sheet>
  ),
  play: async ({ canvas, canvasElement, userEvent }) => {
    await userEvent.click(canvas.getByRole('button', { name: /top/i }));
    const body = within(canvasElement.ownerDocument.body);
    await expect(await body.findByRole('heading', { name: 'Notifications' })).toBeVisible();
  },
};

export const Bottom: StoryObj<typeof meta> = {
  render: () => (
    <Sheet>
      <SheetTrigger render={<Button variant="outline">Open Sheet (Bottom)</Button>} />
      <SheetContent side="bottom">
        <SheetHeader>
          <SheetTitle>Quick Actions</SheetTitle>
        </SheetHeader>
        <div className="flex gap-2 px-4">
          <Button variant="primary" className="flex-1">Share</Button>
          <Button variant="outline" className="flex-1">Download</Button>
        </div>
      </SheetContent>
    </Sheet>
  ),
  play: async ({ canvas, canvasElement, userEvent }) => {
    await userEvent.click(canvas.getByRole('button', { name: /bottom/i }));
    const body = within(canvasElement.ownerDocument.body);
    await expect(await body.findByRole('heading', { name: 'Quick Actions' })).toBeVisible();
  },
};

export const WithForm: StoryObj<typeof meta> = {
  render: () => (
    <Sheet>
      <SheetTrigger render={<Button variant="outline">Edit Profile</Button>} />
      <SheetContent side="right">
        <SheetHeader>
          <SheetTitle>Edit Profile</SheetTitle>
          <SheetDescription>
            Make changes to your profile. Click save when done.
          </SheetDescription>
        </SheetHeader>
        <div className="flex flex-col gap-4 px-4">
          <Input placeholder="Name" />
          <Input placeholder="Email" type="email" />
        </div>
        <SheetFooter>
          <SheetClose render={<Button variant="outline">Cancel</Button>} />
          <Button variant="primary">Save</Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  ),
  play: async ({ canvas, canvasElement, userEvent }) => {
    await userEvent.click(canvas.getByRole('button', { name: /edit profile/i }));
    const body = within(canvasElement.ownerDocument.body);
    await expect(await body.findByPlaceholderText('Name')).toBeVisible();
  },
};
