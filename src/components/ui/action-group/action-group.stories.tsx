import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, waitFor, within } from 'storybook/test';

import { ActionGroup } from './action-group';
import type { IconType } from '@/components/icon';

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
