import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, within } from 'storybook/test';
import { Popover, PopoverContent, PopoverTrigger } from './popover';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const meta: Meta<typeof Popover> = {
  title: 'UI/Popover',
  component: Popover,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs', 'new'],
};

export default meta;

export const Default: StoryObj<typeof meta> = {
  render: () => (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline">Open Popover</Button>
      </PopoverTrigger>
      <PopoverContent className="w-64">
        <div className="grid gap-2">
          <h4 className="font-medium">Popover Title</h4>
          <p className="text-sm text-muted-foreground">
            This is a basic popover with some content.
          </p>
        </div>
      </PopoverContent>
    </Popover>
  ),
  play: async ({ canvas, canvasElement }) => {
    await userEvent.click(canvas.getByRole('button'));
    const body = within(canvasElement.ownerDocument.body);
    await expect(await body.findByText('Popover Title')).toBeInTheDocument();
  },
};

export const WithForm: StoryObj<typeof meta> = {
  render: () => (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline">Edit</Button>
      </PopoverTrigger>
      <PopoverContent className="w-72">
        <div className="grid gap-3">
          <div className="grid gap-1">
            <Label htmlFor="width">Width</Label>
            <Input id="width" defaultValue="100%" />
          </div>
          <div className="grid gap-1">
            <Label htmlFor="height">Height</Label>
            <Input id="height" defaultValue="25px" />
          </div>
          <Button variant="primary" size="sm" className="w-full mt-2">
            Apply
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  ),
  play: async ({ canvas, canvasElement }) => {
    await userEvent.click(canvas.getByRole('button'));
    const body = within(canvasElement.ownerDocument.body);
    await expect(await body.findByLabelText('Width')).toBeInTheDocument();
  },
};

export const WithArrow: StoryObj<typeof meta> = {
  render: () => (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost">With Arrow</Button>
      </PopoverTrigger>
      <PopoverContent className="w-48" showArrow>
        <p className="text-sm text-muted-foreground">
          This popover has an arrow pointing to the trigger.
        </p>
      </PopoverContent>
    </Popover>
  ),
  play: async ({ canvas, canvasElement }) => {
    await userEvent.click(canvas.getByRole('button'));
    const body = within(canvasElement.ownerDocument.body);
    await expect(await body.findByText(/arrow/)).toBeInTheDocument();
  },
};
