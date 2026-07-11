import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, waitFor, within } from 'storybook/test';

import { ActionGroup } from './action-group';
import { Button } from '@/components/ui/button';
import { Icon, type IconType } from '@/components/icon';

const onEdit = fn();

const meta: Meta<typeof ActionGroup> = {
  title: 'UI/ActionGroup',
  component: ActionGroup,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
  argTypes: {
    items: {
      control: false,
      description:
        'Grupos de ações do menu (matriz de grupos, separados visualmente). Cada item aceita `label`, `icon`, `onClick`, `href`, `disabled`, `variant` e `className`.',
      table: { category: 'Conteúdo' },
    },
    align: {
      control: 'inline-radio',
      options: ['start', 'center', 'end'],
      description: 'Alinhamento do menu em relação ao trigger.',
      table: {
        category: 'Comportamento',
        type: { summary: "'start' | 'center' | 'end'" },
        defaultValue: { summary: "'end'" },
      },
    },
    disabled: {
      control: 'boolean',
      description:
        'Desabilita o trigger. O grupo também fica desabilitado automaticamente quando não há itens.',
      table: {
        category: 'Estado',
        defaultValue: { summary: 'false' },
      },
    },
    children: {
      control: false,
      description:
        'Trigger customizado do menu. Quando omitido, um botão de ícone padrão é renderizado.',
      table: { category: 'Conteúdo' },
    },
    triggerAriaLabel: {
      control: 'text',
      description:
        'Nome acessível (`aria-label`) do botão padrão de ícone. Ignorado quando um trigger customizado é passado via `children`.',
      table: {
        category: 'Acessibilidade',
        defaultValue: { summary: "'Actions'" },
      },
    },
    className: {
      control: 'text',
      description: 'Classes extras aplicadas ao trigger.',
      table: { category: 'Aparência' },
    },
  },
  args: {
    disabled: false,
    align: 'end',
    items: [
      [
        { label: 'Edit', icon: 'Pen3' as IconType, onClick: onEdit },
        { label: 'Duplicate', icon: 'Copy' as IconType, onClick: fn() },
      ],
      [
        {
          label: 'Delete',
          icon: 'Trash' as IconType,
          onClick: fn(),
          variant: 'destructive',
        },
      ],
    ],
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  render: args => (
    <div className="flex justify-center">
      <ActionGroup {...args} />
    </div>
  ),
  play: async ({ canvas, canvasElement, userEvent }) => {
    onEdit.mockClear();

    await userEvent.click(canvas.getByRole('button'));

    // O conteúdo do menu é portado para fora do canvas da story.
    const body = within(canvasElement.ownerDocument.body);
    const editItem = await body.findByRole('menuitem', { name: 'Edit' });
    await userEvent.click(editItem);

    await waitFor(() => expect(onEdit).toHaveBeenCalledOnce());
  },
};

/**
 * Um único grupo de ações — sem divisórias, o caso mais simples.
 */
export const SingleGroup: Story = {
  args: {
    align: 'start',
    items: [
      [
        { label: 'Copiar', icon: 'Copy' as IconType, onClick: fn() },
        { label: 'Copiar link', icon: 'Link' as IconType, onClick: fn() },
        { label: 'Favoritar', icon: 'Bookmark' as IconType, onClick: fn() },
      ],
    ],
  },
  render: args => (
    <div className="flex justify-center">
      <ActionGroup {...args} />
    </div>
  ),
};

/**
 * Vários grupos são separados por uma divisória automaticamente — útil para
 * agrupar ações por afinidade e isolar as destrutivas no fim. Só o primeiro e o
 * último item das extremidades recebem cantos arredondados (edge-to-edge).
 */
export const MultipleGroups: Story = {
  args: {
    align: 'start',
    items: [
      [
        { label: 'Editar', icon: 'Pen3' as IconType, onClick: fn() },
        { label: 'Duplicar', icon: 'Copy' as IconType, onClick: fn() },
      ],
      [
        { label: 'Compartilhar', icon: 'Nodes' as IconType, onClick: fn() },
        { label: 'Copiar link', icon: 'Link' as IconType, onClick: fn() },
      ],
      [
        { label: 'Baixar', icon: 'Download' as IconType, onClick: fn() },
        {
          label: 'Excluir',
          icon: 'Trash' as IconType,
          onClick: fn(),
          variant: 'destructive',
        },
      ],
    ],
  },
  render: args => (
    <div className="flex justify-center">
      <ActionGroup {...args} />
    </div>
  ),
};

/**
 * Trigger customizado via `children` — substitui o botão de ícone padrão por
 * qualquer elemento (aqui um botão com rótulo). O `triggerAriaLabel` é ignorado
 * quando há trigger próprio.
 */
export const CustomTrigger: Story = {
  args: {
    align: 'start',
    items: [
      [
        { label: 'Renomear', icon: 'Pen3' as IconType, onClick: fn() },
        { label: 'Duplicar', icon: 'Copy' as IconType, onClick: fn() },
        { label: 'Mover para...', icon: 'Nodes' as IconType, onClick: fn() },
      ],
    ],
  },
  render: args => (
    <div className="flex justify-center">
      <ActionGroup {...args}>
        <Button variant="outline">
          <Icon name="Gear" />
          Opções
          <Icon name="ChevronDown" />
        </Button>
      </ActionGroup>
    </div>
  ),
  play: async ({ canvas, canvasElement, userEvent }) => {
    await userEvent.click(canvas.getByRole('button', { name: /opções/i }));

    const body = within(canvasElement.ownerDocument.body);
    await waitFor(() =>
      expect(body.getByRole('menuitem', { name: 'Renomear' })).toBeVisible(),
    );
  },
};

/**
 * Itens indisponíveis no contexto ficam atenuados via `disabled` no item.
 */
export const DisabledItems: Story = {
  args: {
    align: 'start',
    items: [
      [
        { label: 'Visualizar', icon: 'Eye' as IconType, onClick: fn() },
        {
          label: 'Editar',
          icon: 'Pen3' as IconType,
          onClick: fn(),
          disabled: true,
        },
      ],
      [
        {
          label: 'Excluir',
          icon: 'Trash' as IconType,
          onClick: fn(),
          variant: 'destructive',
          disabled: true,
        },
      ],
    ],
  },
  render: args => (
    <div className="flex justify-center">
      <ActionGroup {...args} />
    </div>
  ),
};

/**
 * Com `disabled` (ou quando não há nenhum item), o trigger padrão fica
 * desabilitado e exibe um cadeado no canto.
 */
export const Disabled: Story = {
  args: { disabled: true },
  render: args => (
    <div className="flex justify-center">
      <ActionGroup {...args} />
    </div>
  ),
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('button')).toBeDisabled();
  },
};

/**
 * `align` controla de que lado o menu abre em relação ao trigger:
 * `start`, `center` ou `end` (padrão).
 */
export const Alignments: Story = {
  render: () => {
    const items = [
      [
        { label: 'Editar', icon: 'Pen3' as IconType, onClick: fn() },
        { label: 'Duplicar', icon: 'Copy' as IconType, onClick: fn() },
      ],
    ];

    return (
      <div className="flex items-start justify-center gap-16">
        <ActionGroup align="start" items={items} triggerAriaLabel="Início" />
        <ActionGroup align="center" items={items} triggerAriaLabel="Centro" />
        <ActionGroup align="end" items={items} triggerAriaLabel="Fim" />
      </div>
    );
  },
};
