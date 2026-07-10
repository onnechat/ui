import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn } from 'storybook/test';

import { Switch } from './switch';
import { Label } from '@/components/ui/label';

const meta: Meta<typeof Switch> = {
  title: 'UI/Switch',
  component: Switch,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    defaultChecked: {
      control: 'boolean',
      description: 'Estado inicial, no modo não controlado.',
      table: { category: 'Estado', defaultValue: { summary: 'false' } },
    },
    checked: {
      control: false,
      description: 'Estado ligado/desligado no modo controlado.',
      table: { category: 'Estado' },
    },
    onCheckedChange: {
      control: false,
      description:
        'Callback disparado ao alternar. Recebe o novo `boolean` e os detalhes do evento.',
      table: { category: 'Estado' },
    },
    disabled: {
      control: 'boolean',
      description: 'Desabilita a interação com o switch.',
      table: { category: 'Comportamento', defaultValue: { summary: 'false' } },
    },
    readOnly: {
      control: 'boolean',
      description: 'Impede a alternância, mantendo o switch focável.',
      table: { category: 'Comportamento', defaultValue: { summary: 'false' } },
    },
    required: {
      control: 'boolean',
      description: 'Marca o campo como obrigatório em formulários.',
      table: { category: 'Comportamento', defaultValue: { summary: 'false' } },
    },
    name: {
      control: 'text',
      description: 'Nome do campo para submissão em formulários.',
      table: { category: 'Comportamento' },
    },
    value: {
      control: 'text',
      description: 'Valor submetido com o formulário quando ligado.',
      table: { category: 'Comportamento', defaultValue: { summary: "'on'" } },
    },
    'aria-label': {
      control: 'text',
      description:
        'Rótulo acessível. Use quando não houver um `<Label>` visível associado.',
      table: { category: 'Conteúdo' },
    },
    className: {
      control: 'text',
      description: 'Classes extras aplicadas ao switch.',
      table: { category: 'Aparência' },
    },
  },
  args: {
    defaultChecked: false,
    disabled: false,
    'aria-label': 'Toggle',
    onCheckedChange: fn(),
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  play: async ({ canvas, userEvent }) => {
    const switchEl = canvas.getByRole('switch');
    await expect(switchEl).toHaveAttribute('aria-checked', 'false');

    await userEvent.click(switchEl);
    await expect(switchEl).toHaveAttribute('aria-checked', 'true');
    await expect(switchEl).toHaveAttribute('data-checked');

    await userEvent.click(switchEl);
    await expect(switchEl).toHaveAttribute('aria-checked', 'false');
  },
};

export const Checked: Story = {
  args: {
    defaultChecked: true,
  },
};

export const Disabled: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <Switch disabled aria-label="Disabled off" />
      <Switch disabled defaultChecked aria-label="Disabled on" />
    </div>
  ),
};

export const WithLabel: Story = {
  render: () => (
    <div className="flex items-center space-x-2">
      <Switch id="airplane-mode" />
      <Label htmlFor="airplane-mode">Airplane Mode</Label>
    </div>
  ),
};

export const LabelChecked: Story = {
  render: () => (
    <div className="flex items-center space-x-2">
      <Switch id="notifications" defaultChecked />
      <Label htmlFor="notifications">Notifications</Label>
    </div>
  ),
};

export const FormExample: Story = {
  // TODO(a11y): o botão primário (bg-primary + texto branco) tem contraste
  // 4.39 < 4.5 — cor vem do token do tema, não da story.
  parameters: { a11y: { test: 'todo' } },
  render: () => (
    <form
      className="flex flex-col gap-4"
      onSubmit={e => {
        e.preventDefault();
        const data = new FormData(e.currentTarget);
        alert(
          JSON.stringify({
            marketing: data.get('marketing'),
            security: data.get('security'),
          }),
        );
      }}
    >
      <div className="flex flex-col gap-3">
        <div className="flex items-center space-x-2">
          <Switch id="marketing" name="marketing" value="1" defaultChecked />
          <Label htmlFor="marketing">Marketing emails</Label>
        </div>
        <div className="flex items-center space-x-2">
          <Switch id="security" name="security" value="1" />
          <Label htmlFor="security">Security alerts</Label>
        </div>
      </div>
      <button
        type="submit"
        className="h-9 rounded-lg bg-primary text-primary-foreground px-4 text-sm font-medium"
      >
        Save Preferences
      </button>
    </form>
  ),
};
