import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, waitFor, within } from 'storybook/test';

import { Select } from './select';

const meta: Meta<typeof Select> = {
  title: 'UI/Select',
  component: Select,
  subcomponents: {
    'Select.Trigger': Select.Trigger,
    'Select.Value': Select.Value,
    'Select.Content': Select.Content,
    'Select.Group': Select.Group,
    'Select.Label': Select.Label,
    'Select.Item': Select.Item,
    'Select.Separator': Select.Separator,
  } as Meta<typeof Select>['subcomponents'],
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs', 'new'],
  argTypes: {
    disabled: {
      control: 'boolean',
      description: 'Desabilita o trigger e impede a abertura do popup.',
      table: { category: 'Comportamento', defaultValue: { summary: 'false' } },
    },
    defaultValue: {
      control: 'select',
      options: ['apple', 'banana', 'orange'],
      description: 'Valor selecionado inicialmente, no modo não controlado.',
      table: { category: 'Estado' },
    },
    value: {
      control: false,
      description: 'Valor selecionado no modo controlado.',
      table: { category: 'Estado' },
    },
    onValueChange: {
      control: false,
      description:
        'Callback disparado quando a seleção muda. Recebe o novo valor como `string`.',
      table: { category: 'Estado' },
    },
    open: {
      control: false,
      description: 'Visibilidade do popup no modo controlado.',
      table: { category: 'Estado' },
    },
    defaultOpen: {
      control: false,
      description: 'Abre o popup na montagem, no modo não controlado.',
      table: { category: 'Estado' },
    },
    onOpenChange: {
      control: false,
      description:
        'Callback disparado quando o popup abre ou fecha. Recebe `boolean`.',
      table: { category: 'Estado' },
    },
  },
  args: {
    disabled: false,
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  render: args => (
    <Select {...args}>
      <Select.Trigger aria-label="Fruit" className="w-48">
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
  play: async ({ canvas, userEvent }) => {
    const trigger = canvas.getByRole('combobox');
    await userEvent.click(trigger);

    // O listbox renderiza em portal no body, fora do canvas da story.
    const body = within(document.body);
    const option = await body.findByRole('option', { name: 'Banana' });
    await userEvent.click(option);

    await waitFor(() => expect(trigger).toHaveTextContent('Banana'));
    await expect(trigger).toHaveAttribute('aria-expanded', 'false');
  },
};

export const WithGroups: Story = {
  // TODO(a11y): placeholder usa text-muted-foreground/50 sobre bg-input
  // (contraste 2.2 — estilo do componente, não da story).
  parameters: { a11y: { test: 'todo' } },
  render: args => (
    <Select {...args}>
      <Select.Trigger aria-label="Food" className="w-48">
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

export const Disabled: Story = {
  // TODO(a11y): placeholder usa text-muted-foreground/50 sobre bg-input
  // (contraste 2.2 — estilo do componente, não da story).
  parameters: { a11y: { test: 'todo' } },
  render: args => (
    <Select {...args}>
      <Select.Trigger aria-label="Option" className="w-48">
        <Select.Value placeholder="Disabled select" />
      </Select.Trigger>
      <Select.Content>
        <Select.Item value="a">Option A</Select.Item>
        <Select.Item value="b" disabled>
          Option B (disabled)
        </Select.Item>
        <Select.Item value="c">Option C</Select.Item>
      </Select.Content>
    </Select>
  ),
};

export const DefaultValue: Story = {
  args: {
    defaultValue: 'banana',
  },
  render: args => (
    <Select {...args}>
      <Select.Trigger aria-label="Fruit" className="w-48">
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
