import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, within } from 'storybook/test';
import { Sheet } from './sheet';
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
      <Sheet.Trigger asChild>
        <Button variant="outline">Open Sheet (Right)</Button>
      </Sheet.Trigger>
      <Sheet.Content side="right">
        <Sheet.Header>
          <Sheet.Title>Sheet Title</Sheet.Title>
          <Sheet.Description>
            This is a sheet that slides in from the right.
          </Sheet.Description>
        </Sheet.Header>
        <div className="flex-1 px-4">
          <p className="text-sm text-muted-foreground">Sheet content goes here.</p>
        </div>
        <Sheet.Footer>
          <Sheet.Close asChild>
            <Button variant="outline">Cancel</Button>
          </Sheet.Close>
          <Sheet.Close asChild>
            <Button variant="primary">Save</Button>
          </Sheet.Close>
        </Sheet.Footer>
      </Sheet.Content>
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
      <Sheet.Trigger asChild>
        <Button variant="outline">Open Sheet (Left)</Button>
      </Sheet.Trigger>
      <Sheet.Content side="left">
        <Sheet.Header>
          <Sheet.Title>Navigation</Sheet.Title>
        </Sheet.Header>
        <div className="flex flex-col gap-1 px-4">
          {['Home', 'Products', 'About', 'Contact'].map((label) => (
            <Sheet.Close key={label} asChild>
              <Button variant="ghost" className="justify-start">{label}</Button>
            </Sheet.Close>
          ))}
        </div>
      </Sheet.Content>
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
      <Sheet.Trigger asChild>
        <Button variant="outline">Open Sheet (Top)</Button>
      </Sheet.Trigger>
      <Sheet.Content side="top">
        <Sheet.Header>
          <Sheet.Title>Notifications</Sheet.Title>
          <Sheet.Description>You have 3 new notifications.</Sheet.Description>
        </Sheet.Header>
      </Sheet.Content>
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
      <Sheet.Trigger asChild>
        <Button variant="outline">Open Sheet (Bottom)</Button>
      </Sheet.Trigger>
      <Sheet.Content side="bottom">
        <Sheet.Header>
          <Sheet.Title>Quick Actions</Sheet.Title>
        </Sheet.Header>
        <div className="flex gap-2 px-4">
          <Button variant="primary" className="flex-1">Share</Button>
          <Button variant="outline" className="flex-1">Download</Button>
        </div>
      </Sheet.Content>
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
      <Sheet.Trigger asChild>
        <Button variant="outline">Edit Profile</Button>
      </Sheet.Trigger>
      <Sheet.Content side="right">
        <Sheet.Header>
          <Sheet.Title>Edit Profile</Sheet.Title>
          <Sheet.Description>
            Make changes to your profile. Click save when done.
          </Sheet.Description>
        </Sheet.Header>
        <div className="flex flex-col gap-4 px-4">
          <Input placeholder="Name" />
          <Input placeholder="Email" type="email" />
        </div>
        <Sheet.Footer>
          <Sheet.Close asChild>
            <Button variant="outline">Cancel</Button>
          </Sheet.Close>
          <Button variant="primary">Save</Button>
        </Sheet.Footer>
      </Sheet.Content>
    </Sheet>
  ),
  play: async ({ canvas, canvasElement, userEvent }) => {
    await userEvent.click(canvas.getByRole('button', { name: /edit profile/i }));
    const body = within(canvasElement.ownerDocument.body);
    await expect(await body.findByPlaceholderText('Name')).toBeVisible();
  },
};
