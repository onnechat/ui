import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect } from 'storybook/test';
import { Select } from './select';

const meta: Meta<typeof Select> = {
  title: 'UI/Select',
  component: Select,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs', 'new'],
};

export default meta;

export const Default: StoryObj<typeof meta> = {
  render: () => (
    <Select>
      <Select.Trigger className="w-48">
        <Select.Value placeholder="Select an option" />
      </Select.Trigger>
      <Select.Content>
        <Select.Group>
          <Select.Label>Fruits</Select.Label>
          <Select.Item value="apple">Apple</Select.Item>
          <Select.Item value="banana">Banana</Select.Item>
          <Select.Item value="orange">Orange</Select.Item>
        </Select.Group>
      </Select.Content>
    </Select>
  ),
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('combobox')).toBeVisible();
  },
};

export const WithGroups: StoryObj<typeof meta> = {
  render: () => (
    <Select>
      <Select.Trigger className="w-48">
        <Select.Value placeholder="Select food" />
      </Select.Trigger>
      <Select.Content>
        <Select.Group>
          <Select.Label>Fruits</Select.Label>
          <Select.Item value="apple">Apple</Select.Item>
          <Select.Item value="banana">Banana</Select.Item>
        </Select.Group>
        <Select.Group>
          <Select.Label>Vegetables</Select.Label>
          <Select.Item value="carrot">Carrot</Select.Item>
          <Select.Item value="broccoli">Broccoli</Select.Item>
        </Select.Group>
      </Select.Content>
    </Select>
  ),
};

export const Disabled: StoryObj<typeof meta> = {
  render: () => (
    <Select>
      <Select.Trigger className="w-48">
        <Select.Value placeholder="Disabled select" />
      </Select.Trigger>
      <Select.Content>
        <Select.Item value="a">Option A</Select.Item>
        <Select.Item value="b" disabled>Option B (disabled)</Select.Item>
        <Select.Item value="c">Option C</Select.Item>
      </Select.Content>
    </Select>
  ),
};

export const DefaultValue: StoryObj<typeof meta> = {
  render: () => (
    <Select defaultValue="banana">
      <Select.Trigger className="w-48">
        <Select.Value placeholder="Select an option" />
      </Select.Trigger>
      <Select.Content>
        <Select.Item value="apple">Apple</Select.Item>
        <Select.Item value="banana">Banana</Select.Item>
        <Select.Item value="orange">Orange</Select.Item>
      </Select.Content>
    </Select>
  ),
};
