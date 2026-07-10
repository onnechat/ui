import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, waitFor } from 'storybook/test';

import { Icon } from '@/components/icon';
import { Button } from '@/components/ui/button';
import { Collapsible, useOptionalCollapsibleContext } from './collapsible';

const meta: Meta<typeof Collapsible> = {
  title: 'UI/Collapsible',
  component: Collapsible,
  subcomponents: {
    'Collapsible.Content': Collapsible.Content,
  } as Meta<typeof Collapsible>['subcomponents'],
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'inline-radio',
      options: ['card', 'row'],
      description:
        'Aparência do painel: `card` tem fundo, borda superior e padding no conteúdo; `row` é neutro.',
      table: {
        category: 'Aparência',
        type: { summary: "'card' | 'row'" },
        defaultValue: { summary: "'card'" },
      },
    },
    defaultOpen: {
      control: 'boolean',
      description: 'Painel aberto inicialmente, no modo não controlado.',
      table: {
        category: 'Estado',
        defaultValue: { summary: 'false' },
      },
    },
    open: {
      control: false,
      description: 'Estado aberto no modo controlado.',
      table: { category: 'Estado' },
    },
    onOpenChange: {
      control: false,
      description: 'Callback disparado quando o painel abre ou fecha.',
      table: { category: 'Estado' },
    },
    expandWhen: {
      control: 'boolean',
      description:
        'Força o painel aberto enquanto a condição for verdadeira (sobrepõe o estado não controlado).',
      table: { category: 'Comportamento' },
    },
    disabled: {
      control: 'boolean',
      description: 'Impede abrir/fechar o painel.',
      table: {
        category: 'Comportamento',
        defaultValue: { summary: 'false' },
      },
    },
    align: {
      control: 'inline-radio',
      options: ['start', 'center'],
      description:
        'Alinhamento repassado via contexto para triggers integrados (ex.: SettingsItem).',
      table: {
        category: 'Aparência',
        type: { summary: "'start' | 'center'" },
        defaultValue: { summary: "'start'" },
      },
    },
    className: {
      control: 'text',
      description: 'Classes extras aplicadas ao container raiz.',
      table: { category: 'Aparência' },
    },
  },
  args: {
    variant: 'card',
    defaultOpen: false,
    disabled: false,
    className: 'w-80',
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

/**
 * O Collapsible não expõe um Trigger próprio (no produto ele é integrado via
 * SettingsItem). Este helper de story usa o contexto público
 * `useOptionalCollapsibleContext` para alternar o painel de forma acessível.
 */
function DemoTrigger({ children }: { children: React.ReactNode }) {
  const ctx = useOptionalCollapsibleContext();
  if (!ctx) return null;

  return (
    <button
      type="button"
      aria-expanded={ctx.open}
      aria-controls={ctx.contentId}
      disabled={ctx.disabled}
      onClick={() => ctx.setOpen(!ctx.open)}
      className="flex w-full items-center justify-between rounded-lg px-4 py-3 text-sm font-medium hover:bg-muted/50 disabled:pointer-events-none disabled:opacity-50"
    >
      <span>{children}</span>
      <Icon
        name="ChevronDown"
        className="size-4 text-muted-foreground transition-transform duration-200"
        style={{ transform: ctx.open ? 'rotate(180deg)' : 'rotate(0deg)' }}
      />
    </button>
  );
}

export const Playground: Story = {
  render: args => (
    <Collapsible {...args}>
      <DemoTrigger>Toggle Panel</DemoTrigger>
      <Collapsible.Content>
        <p className="text-sm text-muted-foreground">
          This content is hidden by default and animates in when toggled.
        </p>
      </Collapsible.Content>
    </Collapsible>
  ),
  play: async ({ canvas, userEvent }) => {
    const trigger = canvas.getByRole('button', { name: 'Toggle Panel' });
    const content = canvas.getByText(
      'This content is hidden by default and animates in when toggled.',
    );

    await expect(trigger).toHaveAttribute('aria-expanded', 'false');
    await expect(content).not.toBeVisible();

    await userEvent.click(trigger);
    await expect(trigger).toHaveAttribute('aria-expanded', 'true');
    await waitFor(() => expect(content).toBeVisible());

    await userEvent.click(trigger);
    await expect(trigger).toHaveAttribute('aria-expanded', 'false');
    await waitFor(() => expect(content).not.toBeVisible());
  },
};

export const RichContent: Story = {
  render: args => (
    <Collapsible {...args}>
      <DemoTrigger>Toggle Panel</DemoTrigger>
      <Collapsible.Content>
        <div className="space-y-3">
          <p className="text-sm text-muted-foreground">
            Collapsible panels can contain rich content including forms, lists,
            and interactive elements.
          </p>
          <div className="flex flex-col gap-2">
            {['Option A', 'Option B', 'Option C'].map(opt => (
              <label
                key={opt}
                className="flex items-center gap-2 rounded-md border bg-card px-3 py-2 text-sm"
              >
                <input type="radio" name="demo" className="accent-primary" />
                {opt}
              </label>
            ))}
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" size="sm">
              Cancel
            </Button>
            <Button variant="primary" size="sm">
              Save
            </Button>
          </div>
        </div>
      </Collapsible.Content>
    </Collapsible>
  ),
};

export const RowVariant: Story = {
  args: {
    variant: 'row',
  },
  render: args => (
    <Collapsible {...args}>
      <DemoTrigger>Row Variant</DemoTrigger>
      <Collapsible.Content>
        <div className="px-4 pb-3 pt-1">
          <p className="text-sm text-muted-foreground">
            The row variant has no card background or border — just the content
            padding.
          </p>
        </div>
      </Collapsible.Content>
    </Collapsible>
  ),
};
