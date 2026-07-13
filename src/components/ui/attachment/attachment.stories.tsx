import type { Meta, StoryObj } from '@storybook/react-vite'
import { AnimatePresence, motion } from 'motion/react'
import * as React from 'react'
import { expect } from 'storybook/test'

import { Attachment } from './attachment'
import { Icon } from '@/components/icon'

const meta: Meta<typeof Attachment> = {
  title: 'UI/Attachment',
  component: Attachment,
  subcomponents: {
    'Attachment.Media': Attachment.Media,
    'Attachment.Content': Attachment.Content,
    'Attachment.Title': Attachment.Title,
    'Attachment.Description': Attachment.Description,
    'Attachment.Progress': Attachment.Progress,
    'Attachment.Actions': Attachment.Actions,
    'Attachment.Action': Attachment.Action,
    'Attachment.Group': Attachment.Group,
  } as Meta<typeof Attachment>['subcomponents'],
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    state: {
      control: 'select',
      options: ['idle', 'uploading', 'processing', 'error', 'done'],
      description:
        'Estado do arquivo. Cada estado sinaliza na mídia e na descrição: `idle` (fila, anel tracejado + pip de upload), `uploading` (seta subindo + barra de progresso com %), `processing` (spinner + barra indeterminada), `done` (check verde) e `error` (alerta + tom destrutivo).',
      table: {
        category: 'Estado',
        type: {
          summary: "'idle' | 'uploading' | 'processing' | 'error' | 'done'",
        },
        defaultValue: { summary: "'done'" },
      },
    },
    size: {
      control: 'inline-radio',
      options: ['default', 'sm', 'xs'],
      description: 'Tamanho do cartão e da mídia.',
      table: {
        category: 'Aparência',
        type: { summary: "'default' | 'sm' | 'xs'" },
        defaultValue: { summary: "'default'" },
      },
    },
    orientation: {
      control: 'inline-radio',
      options: ['horizontal', 'vertical'],
      description: 'Layout do cartão.',
      table: {
        category: 'Aparência',
        type: { summary: "'horizontal' | 'vertical'" },
        defaultValue: { summary: "'horizontal'" },
      },
    },
    children: {
      control: false,
      table: { category: 'Conteúdo' },
    },
  },
}

export default meta

type Story = StoryObj<typeof meta>

export const Playground: Story = {
  args: { state: 'done', size: 'default', orientation: 'horizontal' },
  render: args => (
    <Attachment {...args} className="w-72">
      <Attachment.Media>
        <Icon name="File" />
      </Attachment.Media>
      <Attachment.Content>
        <Attachment.Title>relatorio-de-vendas.pdf</Attachment.Title>
        <Attachment.Description>PDF · 2,4 MB</Attachment.Description>
      </Attachment.Content>
      <Attachment.Actions>
        <Attachment.Action aria-label="Baixar relatorio-de-vendas.pdf">
          <Icon name="Download" />
        </Attachment.Action>
        <Attachment.Action aria-label="Remover relatorio-de-vendas.pdf">
          <Icon name="Trash" />
        </Attachment.Action>
      </Attachment.Actions>
    </Attachment>
  ),
  play: async ({ canvas }) => {
    await expect(canvas.getByText('relatorio-de-vendas.pdf')).toBeVisible()
  },
}

/**
 * Cada estado sinaliza sozinho: `idle` espera na fila (anel tracejado + pip de
 * upload), `uploading` mostra a seta subindo + barra de progresso com o
 * percentual, `processing` roda o spinner + barra indeterminada, `done` cravou
 * o check e `error` pinta o cartão de destrutivo com alerta e ação de retry.
 */
export const States: Story = {
  // TODO(a11y): o token `destructive` (#fb2c36) não atinge 4.5:1 em texto pequeno
  // — mesmo débito de tema já sinalizado nas outras stories da lib.
  parameters: { a11y: { test: 'todo' } },
  render: () => (
    <div className="flex flex-col gap-3">
      <Attachment state="idle" className="w-80">
        <Attachment.Media>
          <Icon name="File" />
        </Attachment.Media>
        <Attachment.Content>
          <Attachment.Title>contrato.docx</Attachment.Title>
          <Attachment.Description>
            Pronto para enviar · 180 KB
          </Attachment.Description>
        </Attachment.Content>
      </Attachment>

      <Attachment state="uploading" className="w-80">
        <Attachment.Media>
          <Icon name="File" />
        </Attachment.Media>
        <Attachment.Content>
          <Attachment.Title>contrato.docx</Attachment.Title>
          <Attachment.Description>Enviando · 62%</Attachment.Description>
        </Attachment.Content>
        <Attachment.Progress value={62} />
      </Attachment>

      <Attachment state="processing" className="w-80">
        <Attachment.Media>
          <Icon name="File" />
        </Attachment.Media>
        <Attachment.Content>
          <Attachment.Title>contrato.docx</Attachment.Title>
          <Attachment.Description>
            Processando documento…
          </Attachment.Description>
        </Attachment.Content>
        <Attachment.Progress />
      </Attachment>

      <Attachment state="done" className="w-80">
        <Attachment.Media>
          <Icon name="File" />
        </Attachment.Media>
        <Attachment.Content>
          <Attachment.Title>contrato.docx</Attachment.Title>
          <Attachment.Description>
            Enviado · DOCX · 180 KB
          </Attachment.Description>
        </Attachment.Content>
        <Attachment.Actions>
          <Attachment.Action aria-label="Baixar contrato.docx">
            <Icon name="Download" />
          </Attachment.Action>
        </Attachment.Actions>
      </Attachment>

      <Attachment state="error" className="w-80">
        <Attachment.Media>
          <Icon name="File" />
        </Attachment.Media>
        <Attachment.Content>
          <Attachment.Title>contrato.docx</Attachment.Title>
          <Attachment.Description>
            Falha no envio. Tente de novo.
          </Attachment.Description>
        </Attachment.Content>
        <Attachment.Actions>
          <Attachment.Action aria-label="Tentar enviar contrato.docx de novo">
            <Icon name="ArrowRotate" />
          </Attachment.Action>
        </Attachment.Actions>
      </Attachment>
    </div>
  ),
  play: async ({ canvas }) => {
    await expect(canvas.getByText('Enviando · 62%')).toBeVisible()
    await expect(
      canvas.getByText('Falha no envio. Tente de novo.'),
    ).toBeVisible()
  },
}

/**
 * Ciclo de vida real de um upload: fila → enviando (progresso subindo) →
 * processando → concluído, e recomeça. Mostra como os estados se encadeiam.
 */
export const Lifecycle: Story = {
  render: function LifecycleRender() {
    const [state, setState] = React.useState<
      'idle' | 'uploading' | 'processing' | 'done'
    >('idle')
    const [pct, setPct] = React.useState(0)

    React.useEffect(() => {
      if (state === 'idle') {
        const t = setTimeout(() => setState('uploading'), 900)
        return () => clearTimeout(t)
      }
      if (state === 'uploading') {
        const t = setInterval(() => {
          setPct(prev => {
            if (prev >= 100) {
              clearInterval(t)
              setState('processing')
              return 100
            }
            return prev + 4
          })
        }, 120)
        return () => clearInterval(t)
      }
      if (state === 'processing') {
        const t = setTimeout(() => setState('done'), 1600)
        return () => clearTimeout(t)
      }
      if (state === 'done') {
        const t = setTimeout(() => {
          setPct(0)
          setState('idle')
        }, 2200)
        return () => clearTimeout(t)
      }
    }, [state])

    const description =
      state === 'idle'
        ? 'Pronto para enviar · 4,2 MB'
        : state === 'uploading'
          ? `Enviando · ${pct}%`
          : state === 'processing'
            ? 'Processando documento…'
            : 'Enviado · PDF · 4,2 MB'

    const showProgress = state === 'uploading' || state === 'processing'

    return (
      // `gap-y-0` so the flex-wrap doesn't reserve a phantom row gap while the
      // progress is collapsed — the motion wrapper owns all the vertical space
      // and animates it, so the card grows/shrinks smoothly instead of jumping.
      <Attachment state={state} className="w-80 gap-y-0">
        <Attachment.Media>
          <Icon name="File" />
        </Attachment.Media>
        <Attachment.Content>
          <Attachment.Title>apresentacao-final.pdf</Attachment.Title>
          <Attachment.Description>{description}</Attachment.Description>
        </Attachment.Content>
        <AnimatePresence initial={false}>
          {showProgress && (
            <motion.div
              key="progress"
              className="basis-full overflow-hidden"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.28, ease: [0.32, 0.72, 0, 1] }}
            >
              <div className="pt-2">
                <Attachment.Progress
                  value={state === 'uploading' ? pct : undefined}
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </Attachment>
    )
  },
}

/** Miniatura de imagem via `Media` com `variant="image"`. */
export const ImageMedia: Story = {
  render: () => (
    <Attachment className="w-72">
      <Attachment.Media variant="image">
        <img
          alt="Prévia"
          src="data:image/svg+xml;utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='40' height='40'%3E%3Crect width='40' height='40' fill='%23b8b8b8'/%3E%3Crect x='8' y='22' width='10' height='10' fill='%23fff' opacity='.7'/%3E%3Ccircle cx='27' cy='14' r='5' fill='%23fff' opacity='.7'/%3E%3C/svg%3E"
        />
      </Attachment.Media>
      <Attachment.Content>
        <Attachment.Title>captura-de-tela.png</Attachment.Title>
        <Attachment.Description>PNG · 840 KB</Attachment.Description>
      </Attachment.Content>
    </Attachment>
  ),
}

/** Vários anexos numa linha rolável com fade nas bordas. */
export const Group: Story = {
  // TODO(a11y): o `mask-image` do scroll-fade reduz a opacidade nas bordas, o que
  // o axe lê como contraste insuficiente nos itens das pontas (falso-positivo).
  parameters: { a11y: { test: 'todo' } },
  render: () => (
    <Attachment.Group className="w-80">
      {['orcamento.xlsx', 'briefing.pdf', 'logo.svg', 'notas.txt'].map(name => (
        <Attachment key={name} size="sm" className="w-52">
          <Attachment.Media size="sm">
            <Icon name="File" />
          </Attachment.Media>
          <Attachment.Content>
            <Attachment.Title>{name}</Attachment.Title>
            <Attachment.Description>Arquivo</Attachment.Description>
          </Attachment.Content>
        </Attachment>
      ))}
    </Attachment.Group>
  ),
}
