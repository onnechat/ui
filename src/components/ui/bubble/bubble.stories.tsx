import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect } from 'storybook/test'

import { Bubble } from './bubble'

const meta: Meta<typeof Bubble> = {
  title: 'UI/Bubble',
  component: Bubble,
  subcomponents: {
    'Bubble.Content': Bubble.Content,
    'Bubble.Actions': Bubble.Actions,
  } as Meta<typeof Bubble>['subcomponents'],
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'inline-radio',
      options: ['incoming', 'outgoing'],
      description:
        'Superfície do balão: `incoming` (recebida, cor de card) ou `outgoing` (enviada, primary).',
      table: {
        category: 'Aparência',
        type: { summary: "'incoming' | 'outgoing'" },
        defaultValue: { summary: "'incoming'" },
      },
    },
    children: {
      control: false,
      description: 'Normalmente `Bubble.Content` e, opcionalmente, `Bubble.Actions`.',
      table: { category: 'Conteúdo' },
    },
  },
}

export default meta

type Story = StoryObj<typeof meta>

export const Playground: Story = {
  args: { variant: 'incoming' },
  render: args => (
    <Bubble {...args}>
      <Bubble.Content>Como posso te ajudar hoje?</Bubble.Content>
    </Bubble>
  ),
  play: async ({ canvas }) => {
    await expect(canvas.getByText('Como posso te ajudar hoje?')).toBeVisible()
  },
}

/**
 * As duas variantes: `incoming` (cor de card) e `outgoing` (primary).
 */
export const Variants: Story = {
  // TODO(a11y): o token `primary` (brand-red) fica em ~4.39:1 com texto branco —
  // débito de tema já sinalizado nas outras stories da lib.
  parameters: { a11y: { test: 'todo' } },
  render: () => (
    <div className="flex w-80 flex-col items-start gap-3">
      <Bubble variant="incoming">
        <Bubble.Content>Mensagem recebida (incoming)</Bubble.Content>
      </Bubble>
      <Bubble variant="outgoing" className="self-end">
        <Bubble.Content>Mensagem enviada (outgoing)</Bubble.Content>
      </Bubble>
    </div>
  ),
}
