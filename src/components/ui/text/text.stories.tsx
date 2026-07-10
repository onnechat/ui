import type { Meta, StoryObj } from '@storybook/react-vite';

import { Cell } from './cell';
import { Phone } from './phone';

const meta: Meta<typeof Cell> = {
  title: 'UI/Text',
  component: Cell,
  subcomponents: {
    'Text.Cell': Cell,
    'Text.Phone': Phone,
  } as Meta<typeof Cell>['subcomponents'],
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  argTypes: {
    children: {
      control: 'text',
      description:
        'Conteúdo do texto. Quando vazio, exibe `emptyText` em itálico esmaecido.',
      table: { category: 'Conteúdo' },
    },
    wrap: {
      control: 'boolean',
      description:
        'Permite quebra de linha. Quando falso, o texto fica em linha única (`nowrap`).',
      table: {
        category: 'Comportamento',
        defaultValue: { summary: 'false' },
      },
    },
    emptyText: {
      control: 'text',
      description: 'Texto exibido quando `children` está vazio.',
      table: {
        category: 'Conteúdo',
        defaultValue: { summary: "'Not defined'" },
      },
    },
    className: {
      control: 'text',
      description: 'Classes extras aplicadas ao `<span>`.',
      table: { category: 'Aparência' },
    },
  },
  args: {
    children: 'John Doe',
    wrap: false,
    emptyText: 'Not defined',
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

// TODO(a11y): o estado vazio do Cell usa `opacity-50`, derrubando o contraste
// do texto "Not defined" para 3.4:1 (violação color-contrast). Corrigir a cor
// no componente cell.tsx.
const A11Y_TODO_EMPTY_STATE = {
  a11y: { test: 'todo' },
} as const;

export const Empty: Story = {
  args: { children: undefined },
  parameters: A11Y_TODO_EMPTY_STATE,
};

export const Wrap: Story = {
  render: () => (
    <div className="w-40 rounded-lg border p-3 text-sm">
      <Cell wrap>
        This is a long text that wraps naturally when it exceeds the container
        width.
      </Cell>
    </div>
  ),
};

export const NoWrap: Story = {
  render: () => (
    <div className="w-40 rounded-lg border p-3 text-sm">
      <Cell wrap={false}>
        This is a long text that truncates because wrap is disabled.
      </Cell>
    </div>
  ),
};

export const WrapVsNoWrap: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-1">
        <span className="text-xs font-medium text-muted-foreground">
          wrap = true
        </span>
        <div className="w-48 rounded-lg border p-3 text-sm">
          <Cell wrap>International Business Machines Corporation</Cell>
        </div>
      </div>
      <div className="flex flex-col gap-1">
        <span className="text-xs font-medium text-muted-foreground">
          wrap = false (default)
        </span>
        <div className="w-48 rounded-lg border p-3 text-sm overflow-hidden">
          <Cell wrap={false}>International Business Machines Corporation</Cell>
        </div>
      </div>
    </div>
  ),
};

export const PhoneNumber: Story = {
  // TODO(a11y): o item com phone={null} exibe o estado vazio do Cell
  // (opacity-50), mesmo problema de contraste da story Empty.
  parameters: A11Y_TODO_EMPTY_STATE,
  render: () => (
    <div className="flex flex-col gap-2">
      {['+5511999999999', '+12125551234', '+442071838750', null].map(
        (phone, i) => (
          <div
            key={i}
            className="flex items-center gap-2 rounded-lg border px-3 py-2 text-sm"
          >
            <Phone phone={phone} />
          </div>
        ),
      )}
    </div>
  ),
};

export const PhoneWithoutFlag: Story = {
  render: () => (
    <div className="rounded-lg border px-3 py-2 text-sm">
      <Phone phone="+5511987654321" flag={false} />
    </div>
  ),
};
