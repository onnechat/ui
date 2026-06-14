import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn, expect, userEvent } from 'storybook/test';
import { Checkbox } from './checkbox';
import { Label } from '@/components/internal/label';

const meta: Meta<typeof Checkbox> = {
  title: 'UI/Checkbox',
  component: Checkbox,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  args: {
    onCheckedChange: fn(),
  },
};

export default meta;

export const Default: StoryObj<typeof meta> = {
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('checkbox')).toBeVisible();
  },
};

export const Checked: StoryObj<typeof meta> = {
  args: {
    checked: true,
  },
};

export const Indeterminate: StoryObj<typeof meta> = {
  args: {
    indeterminate: true,
  },
};

export const Disabled: StoryObj<typeof meta> = {
  args: {
    disabled: true,
  },
};

export const DisabledChecked: StoryObj<typeof meta> = {
  args: {
    disabled: true,
    checked: true,
  },
};

export const WithLabel: StoryObj = {
  render: () => (
    <div className="flex items-center gap-2">
      <Checkbox id="terms" onCheckedChange={fn()} />
      <Label htmlFor="terms">Accept terms and conditions</Label>
    </div>
  ),
  play: async ({ canvas }) => {
    const checkbox = canvas.getByRole('checkbox');
    await userEvent.click(checkbox);
    await expect(checkbox).toBeChecked();
  },
};

export const WithDescription: StoryObj = {
  render: () => (
    <div className="flex items-start gap-2">
      <Checkbox id="notifications" onCheckedChange={fn()} className="-mt-0.5" />
      <div className="grid gap-1">
        <Label htmlFor="notifications">Enable notifications</Label>
        <p className="text-sm text-muted-foreground">
          You can enable or disable notifications at any time.
        </p>
      </div>
    </div>
  ),
};

export const Group: StoryObj = {
  render: () => (
    <div className="grid gap-3">
      <p className="text-sm font-medium">Select items to display</p>
      {['Hard disks', 'External disks', 'CDs, DVDs, and iPods', 'Connected servers'].map(
        (label) => (
          <div key={label} className="flex items-center gap-2">
            <Checkbox id={label} onCheckedChange={fn()} />
            <Label htmlFor={label}>{label}</Label>
          </div>
        ),
      )}
    </div>
  ),
};
