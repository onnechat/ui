import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect } from 'storybook/test'

import { TypingIndicator } from './typing-indicator'
import { Bubble } from '@/components/ui/bubble'

const meta: Meta<typeof TypingIndicator> = {
  title: 'UI/TypingIndicator',
  component: TypingIndicator,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: 'inline-radio',
      options: ['sm', 'default', 'lg'],
      description: 'Escala os pontos e o texto.',
      table: {
        category: 'Aparência',
        type: { summary: "'sm' | 'default' | 'lg'" },
        defaultValue: { summary: "'default'" },
      },
    },
    label: {
      control: 'text',
      description:
        'Texto após os pontos (ex.: "Marina está digitando"). Também aceito via `children`.',
      table: { category: 'Conteúdo' },
    },
  },
}

export default meta

type Story = StoryObj<typeof meta>

export const Playground: Story = {
  args: { label: 'Marina está digitando' },
  play: async ({ canvas }) => {
    await expect(canvas.getByText('Marina está digitando')).toBeVisible()
  },
}

/** Só os pontos, sem rótulo — bom pra encaixar dentro de um balão. */
export const DotsOnly: Story = {
  render: () => <TypingIndicator aria-label="Digitando" />,
}

/** `sm` / `default` / `lg` escalam pontos e texto juntos. */
export const Sizes: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <TypingIndicator size="sm" label="Pequeno" />
      <TypingIndicator size="default" label="Padrão" />
      <TypingIndicator size="lg" label="Grande" />
    </div>
  ),
}

/**
 * Dentro de um `Bubble` incoming: o padrão "assistente compondo a resposta"
 * (estilo ChatGPT), com os pontos no lugar do texto.
 */
export const InBubble: Story = {
  render: () => (
    <Bubble variant="incoming">
      <TypingIndicator aria-label="Assistente está digitando" />
    </Bubble>
  ),
}
