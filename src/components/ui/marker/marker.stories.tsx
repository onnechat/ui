import type { Meta, StoryObj } from '@storybook/react-vite'
import { AnimatePresence, motion } from 'motion/react'
import * as React from 'react'
import { expect } from 'storybook/test'

import { Marker } from './marker'
import { Icon } from '@/components/icon'
import { Loader } from '@/components/ui/loader'

const meta: Meta<typeof Marker> = {
  title: 'UI/Marker',
  component: Marker,
  subcomponents: {
    'Marker.Icon': Marker.Icon,
    'Marker.Content': Marker.Content,
  } as Meta<typeof Marker>['subcomponents'],
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'inline-radio',
      options: ['default', 'border', 'separator'],
      description:
        'Tipo do marcador: `default` (nota inline), `border` (linha de status com régua inferior) ou `separator` (rótulo centralizado com filete dos dois lados, ex.: quebra de data).',
      table: {
        category: 'Aparência',
        type: { summary: "'default' | 'border' | 'separator'" },
        defaultValue: { summary: "'default'" },
      },
    },
    children: {
      control: false,
      description: 'Normalmente `Marker.Icon` + `Marker.Content`.',
      table: { category: 'Conteúdo' },
    },
  },
}

export default meta

type Story = StoryObj<typeof meta>

export const Playground: Story = {
  render: args => (
    <div className="w-72">
      <Marker {...args}>
        <Marker.Icon>
          <Icon name="Magnifier" />
        </Marker.Icon>
        <Marker.Content>Explorou 4 arquivos</Marker.Content>
      </Marker>
    </div>
  ),
  play: async ({ canvas }) => {
    await expect(canvas.getByText('Explorou 4 arquivos')).toBeVisible()
  },
}

/**
 * As três variantes: `default` (nota inline), `separator` (rótulo com filete dos
 * dois lados) e `border` (linha de status com régua inferior).
 */
export const Variants: Story = {
  render: () => (
    <div className="flex w-72 flex-col gap-4">
      <Marker>
        <Marker.Content>Um marcador padrão para notas inline.</Marker.Content>
      </Marker>

      <Marker variant="separator">
        <Marker.Content>Um marcador separador</Marker.Content>
      </Marker>

      <Marker variant="border">
        <Marker.Content>
          Um marcador de borda para limites de linha.
        </Marker.Content>
      </Marker>
    </div>
  ),
}

/** Estado em andamento: spinner + texto (ex.: compactando, rodando testes). */
export const Status: Story = {
  render: () => (
    <div className="flex w-72 flex-col gap-4">
      <Marker role="status">
        <Marker.Icon>
          <Loader variant="button" />
        </Marker.Icon>
        <Marker.Content>Compactando conversa</Marker.Content>
      </Marker>

      <Marker role="status">
        <Marker.Icon>
          <Loader variant="button" />
        </Marker.Icon>
        <Marker.Content>Rodando testes</Marker.Content>
      </Marker>
    </div>
  ),
}

/** Efeito shimmer no texto enquanto o agente pensa/lê. */
export const Shimmer: Story = {
  render: () => (
    <div className="flex w-72 flex-col gap-4">
      <Marker role="status">
        <Marker.Content className="shimmer">Pensando…</Marker.Content>
      </Marker>

      <Marker role="status">
        <Marker.Content className="shimmer">Lendo 4 arquivos</Marker.Content>
      </Marker>
    </div>
  ),
}

/** Separador de data: rótulo centralizado com filete dos dois lados. */
export const Separator: Story = {
  render: () => (
    <div className="flex w-72 flex-col gap-4">
      <Marker variant="separator">
        <Marker.Content>Hoje</Marker.Content>
      </Marker>

      <Marker>
        <Marker.Content>Trabalhou por 42s</Marker.Content>
      </Marker>

      <Marker>
        <Marker.Content>Conversa compactada</Marker.Content>
      </Marker>
    </div>
  ),
}

/** Linha de status com régua inferior e ícone. */
export const Border: Story = {
  render: () => (
    <div className="flex w-72 flex-col gap-4">
      <Marker variant="border">
        <Marker.Icon>
          <Icon name="CodeBranch" />
        </Marker.Icon>
        <Marker.Content>Mudou para release-candidate</Marker.Content>
      </Marker>

      <Marker variant="border">
        <Marker.Icon>
          <Icon name="Magnifier" />
        </Marker.Icon>
        <Marker.Content>Revisou 8 arquivos relacionados</Marker.Content>
      </Marker>

      <Marker variant="border">
        <Marker.Icon>
          <Icon name="Note" />
        </Marker.Icon>
        <Marker.Content>Abriu as notas de implementação</Marker.Content>
      </Marker>
    </div>
  ),
}

/** Marcadores inline com ícone. */
export const WithIcon: Story = {
  render: () => (
    <div className="flex w-72 flex-col gap-4">
      <Marker>
        <Marker.Icon>
          <Icon name="CodeBranch" />
        </Marker.Icon>
        <Marker.Content>Mudou para uma nova branch</Marker.Content>
      </Marker>

      <Marker>
        <Marker.Icon>
          <Icon name="Magnifier" />
        </Marker.Icon>
        <Marker.Content>Explorou 4 arquivos</Marker.Content>
      </Marker>

      <Marker>
        <Marker.Icon>
          <Icon name="BookOpen" />
        </Marker.Icon>
        <Marker.Content>Sincronização concluída</Marker.Content>
      </Marker>
    </div>
  ),
}

/**
 * Com `render`, o marcador vira um link ou botão clicável — mantendo o layout
 * de ícone + conteúdo e ganhando estados de hover/foco.
 */
export const LinksAndButtons: Story = {
  render: () => (
    <div className="flex w-72 flex-col gap-4">
      <Marker render={<a href="#" />}>
        <Marker.Icon>
          <Icon name="CodeBranch" />
        </Marker.Icon>
        <Marker.Content>Ver o pull request</Marker.Content>
      </Marker>

      <Marker render={<button type="button" />}>
        <Marker.Icon>
          <Icon name="Undo" />
        </Marker.Icon>
        <Marker.Content>Reverter esta alteração</Marker.Content>
      </Marker>
    </div>
  ),
  play: async ({ canvas }) => {
    await expect(
      canvas.getByRole('link', { name: /ver o pull request/i }),
    ).toBeVisible()
    await expect(
      canvas.getByRole('button', { name: /reverter esta alteração/i }),
    ).toBeVisible()
  },
}

/**
 * Toggle de "pensamento" do agente: o Marker vira um botão (via `render`) com
 * um chevron que gira, e a área abaixo revela todo o raciocínio com uma
 * animação suave (motion). Fechado mostra só o resumo.
 */
function AgentThinking({
  label,
  streaming = false,
  defaultOpen = false,
  children,
}: {
  label: string
  streaming?: boolean
  defaultOpen?: boolean
  children: React.ReactNode
}) {
  const [open, setOpen] = React.useState(defaultOpen)

  return (
    <div className="w-full">
      <Marker
        render={
          <button
            type="button"
            onClick={() => setOpen(prev => !prev)}
            aria-expanded={open}
          />
        }
        className="w-fit justify-start gap-1.5"
      >
        <Marker.Icon>
          <Icon
            name="ChevronDown"
            className={
              open
                ? 'rotate-0 transition-transform'
                : '-rotate-90 transition-transform'
            }
          />
        </Marker.Icon>
        <Marker.Content
          className={streaming ? 'shimmer' : undefined}
          aria-live={streaming ? 'polite' : undefined}
        >
          {label}
        </Marker.Content>
      </Marker>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="thought"
            className="overflow-hidden"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.32, 0.72, 0, 1] }}
          >
            <div className="text-muted-foreground border-border/70 mt-1 ml-2 flex flex-col gap-2 border-l pl-4 text-xs leading-relaxed">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

const THOUGHTS = [
  'Vou quebrar o pedido em partes antes de responder.',
  'Conferi se já existe algo parecido no código — achei o Marker, dá pra reaproveitar a variante interativa como gatilho.',
  'Preciso separar o caso em que o raciocínio ainda está chegando (streaming) do já concluído.',
  'Fecho por padrão ao terminar pra não poluir o histórico, mas deixo o toggle pra quem quiser auditar.',
]

/**
 * Pensamento concluído: fechado por padrão ("Pensou por 8s"). Abra o toggle
 * para ver todo o raciocínio do agente.
 */
export const Thinking: Story = {
  render: () => (
    <div className="w-80">
      <AgentThinking label="Pensou por 8s">
        {THOUGHTS.map((thought, index) => (
          <p key={index}>{thought}</p>
        ))}
      </AgentThinking>
    </div>
  ),
  play: async ({ canvas, userEvent }) => {
    const toggle = canvas.getByRole('button', { name: /pensou por 8s/i })
    await expect(toggle).toHaveAttribute('aria-expanded', 'false')
    await userEvent.click(toggle)
    await expect(toggle).toHaveAttribute('aria-expanded', 'true')
    await expect(
      canvas.getByText(/vou quebrar o pedido em partes/i),
    ).toBeInTheDocument()
  },
}

/**
 * Pensamento em andamento: rótulo com shimmer ("Pensando…") e o raciocínio
 * parcial já visível enquanto os tokens chegam.
 */
export const ThinkingStreaming: Story = {
  render: () => (
    <div className="w-80">
      <AgentThinking label="Pensando…" streaming defaultOpen>
        {THOUGHTS.slice(0, 2).map((thought, index) => (
          <p key={index}>{thought}</p>
        ))}
        <p className="shimmer">Analisando os casos de borda…</p>
      </AgentThinking>
    </div>
  ),
}
