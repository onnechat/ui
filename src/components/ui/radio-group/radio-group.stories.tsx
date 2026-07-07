import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect } from 'storybook/test';
import { RadioGroup } from './radio-group';
import { Label } from '@/components/ui/label';

const meta: Meta<typeof RadioGroup> = {
  title: 'UI/RadioGroup',
  component: RadioGroup,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs', 'new'],
};

export default meta;

export const Default: StoryObj<typeof meta> = {
  args: {
    defaultValue: 'option-1',
  },
  render: (args) => (
    <RadioGroup {...args}>
      <div className="flex items-center gap-2">
        <RadioGroup.Item value="option-1" id="r1" />
        <Label htmlFor="r1">Default</Label>
      </div>
      <div className="flex items-center gap-2">
        <RadioGroup.Item value="option-2" id="r2" />
        <Label htmlFor="r2">Comfortable</Label>
      </div>
      <div className="flex items-center gap-2">
        <RadioGroup.Item value="option-3" id="r3" />
        <Label htmlFor="r3">Compact</Label>
      </div>
    </RadioGroup>
  ),
  play: async ({ canvas }) => {
    const radio = canvas.getByRole('radio', { name: 'Default' });
    await expect(radio).toBeChecked();
  },
};

export const Horizontal: StoryObj<typeof meta> = {
  args: {
    defaultValue: 'light',
  },
  render: (args) => (
    <RadioGroup {...args} className="flex gap-4">
      <div className="flex items-center gap-2">
        <RadioGroup.Item value="light" id="h1" />
        <Label htmlFor="h1">Light</Label>
      </div>
      <div className="flex items-center gap-2">
        <RadioGroup.Item value="dark" id="h2" />
        <Label htmlFor="h2">Dark</Label>
      </div>
      <div className="flex items-center gap-2">
        <RadioGroup.Item value="system" id="h3" />
        <Label htmlFor="h3">System</Label>
      </div>
    </RadioGroup>
  ),
  play: async ({ canvas }) => {
    const items = canvas.getAllByRole('radio');
    await expect(items).toHaveLength(3);
  },
};

export const Disabled: StoryObj<typeof meta> = {
  render: () => (
    <RadioGroup defaultValue="a" disabled>
      <div className="flex items-center gap-2">
        <RadioGroup.Item value="a" id="d1" />
        <Label htmlFor="d1">Option A</Label>
      </div>
      <div className="flex items-center gap-2">
        <RadioGroup.Item value="b" id="d2" />
        <Label htmlFor="d2">Option B</Label>
      </div>
    </RadioGroup>
  ),
};
