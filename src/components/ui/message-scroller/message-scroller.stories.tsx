import type { Meta, StoryObj } from '@storybook/react-vite'
import * as React from 'react'
import { expect } from 'storybook/test'

import { MessageScroller } from './message-scroller'
import { Avatar } from '@/components/ui/avatar'
import { Bubble } from '@/components/ui/bubble'
import { Marker } from '@/components/ui/marker'
import { Message } from '@/components/ui/message'

type Turn = { id: string; mine: boolean; text: string }

const conversation: Turn[] = [
  {
    id: 'm1',
    mine: false,
    text: 'Oi! Vi que você abriu um chamado sobre o faturamento.',
  },
  { id: 'm2', mine: false, text: 'Deixa eu conferir aqui rapidinho.' },
  {
    id: 'm3',
    mine: true,
    text: 'Isso! A última fatura veio com um valor diferente.',
  },
  {
    id: 'm4',
    mine: false,
    text: 'Achei — houve um ajuste proporcional do upgrade de plano.',
  },
  {
    id: 'm5',
    mine: false,
    text: 'O detalhamento vai por e-mail em instantes.',
  },
  { id: 'm6', mine: true, text: 'Ah, faz sentido.' },
  { id: 'm7', mine: true, text: 'Recebi o e-mail, obrigado!' },
  { id: 'm8', mine: true, text: 'E se eu quiser voltar pro plano anterior?' },
  {
    id: 'm9',
    mine: false,
    text: 'Dá pra fazer em Configurações → Plano, a qualquer momento.',
  },
  {
    id: 'm10',
    mine: false,
    text: 'O crédito proporcional entra na próxima fatura.',
  },
  {
    id: 'm11',
    mine: true,
    text: 'Perfeito. Por enquanto vou manter o upgrade.',
  },
  { id: 'm12', mine: false, text: 'Combinado! Qualquer coisa é só chamar. 🙂' },
]

/**
 * Groups consecutive turns from the same sender — the avatar and a single
 * `Message.Group` then render once per group, not once per message.
 */
type Group = { id: string; mine: boolean; messages: Turn[] }

function groupTurns(turns: Turn[]): Group[] {
  const groups: Group[] = []
  for (const turn of turns) {
    const last = groups[groups.length - 1]
    if (last && last.mine === turn.mine) last.messages.push(turn)
    else groups.push({ id: turn.id, mine: turn.mine, messages: [turn] })
  }
  return groups
}

const meta: Meta<typeof MessageScroller> = {
  title: 'UI/MessageScroller',
  component: MessageScroller,
  subcomponents: {
    'MessageScroller.Provider': MessageScroller.Provider,
    'MessageScroller.Viewport': MessageScroller.Viewport,
    'MessageScroller.Content': MessageScroller.Content,
    'MessageScroller.Item': MessageScroller.Item,
    'MessageScroller.Button': MessageScroller.Button,
  } as Meta<typeof MessageScroller>['subcomponents'],
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
}

export default meta

type Story = StoryObj<typeof meta>

/** Incoming avatar shares the incoming bubble surface (`bg-card`). */
function Ana() {
  return (
    <Avatar className="size-7">
      <Avatar.Fallback className="bg-card text-card-foreground text-xs">
        AS
      </Avatar.Fallback>
    </Avatar>
  )
}

/** One row per GROUP: a single avatar + a stack of bubbles from that sender. */
function GroupRow({ group }: { group: Group }) {
  return (
    <MessageScroller.Item messageId={group.id} scrollAnchor={group.mine}>
      <Message align={group.mine ? 'end' : 'start'}>
        {!group.mine && (
          <Message.Avatar>
            <Ana />
          </Message.Avatar>
        )}
        <Message.Content>
          <Message.Group>
            {group.messages.map(message => (
              <Bubble
                key={message.id}
                variant={group.mine ? 'outgoing' : 'incoming'}
              >
                <Bubble.Content>{message.text}</Bubble.Content>
              </Bubble>
            ))}
          </Message.Group>
        </Message.Content>
      </Message>
    </MessageScroller.Item>
  )
}

/**
 * Conversa completa numa moldura de altura fixa. Mensagens seguidas do mesmo
 * remetente ficam num só grupo, com **um avatar por grupo** (que fica sticky
 * enquanto o grupo passa). Role para cima e o botão "ir para a última" aparece.
 */
export const Playground: Story = {
  // TODO(a11y): balões outgoing usam o token `primary` (~4.39:1) — débito de tema.
  parameters: { a11y: { test: 'todo' } },
  render: () => (
    <MessageScroller.Provider autoScroll defaultScrollPosition="end">
      <MessageScroller className="bg-muted h-[28rem] w-96 overflow-hidden rounded-2xl">
        <MessageScroller.Viewport>
          <MessageScroller.Content>
            <Marker variant="separator">
              <Marker.Content>Hoje</Marker.Content>
            </Marker>
            {groupTurns(conversation).map(group => (
              <GroupRow key={group.id} group={group} />
            ))}
          </MessageScroller.Content>
        </MessageScroller.Viewport>
        <MessageScroller.Button />
      </MessageScroller>
    </MessageScroller.Provider>
  ),
  play: async ({ canvas }) => {
    await expect(
      canvas.getByRole('region', { name: 'Mensagens' }),
    ).toBeVisible()
    await expect(
      canvas.getByText('Recebi o e-mail, obrigado!'),
    ).toBeInTheDocument()
  },
}

/**
 * Auto-scroll durante o streaming: as mensagens vão chegando (uma a cada ~1,3s)
 * e, como o `autoScroll` está ligado e o leitor está no fim, o viewport gruda no
 * fundo e acompanha cada nova mensagem. Mensagens seguidas do mesmo remetente
 * se juntam no grupo aberto em vez de repetir o avatar.
 */
export const Streaming: Story = {
  // TODO(a11y): balões outgoing usam o token `primary` (~4.39:1) — débito de tema.
  parameters: { a11y: { test: 'todo' } },
  render: function StreamingRender() {
    const [count, setCount] = React.useState(3)

    React.useEffect(() => {
      if (count >= conversation.length) return
      const t = window.setTimeout(() => setCount(prev => prev + 1), 1300)
      return () => window.clearTimeout(t)
    }, [count])

    return (
      <MessageScroller.Provider autoScroll defaultScrollPosition="end">
        <MessageScroller className="bg-muted h-[28rem] w-96 overflow-hidden rounded-2xl">
          <MessageScroller.Viewport>
            <MessageScroller.Content aria-busy={count < conversation.length}>
              <Marker variant="separator">
                <Marker.Content>Hoje</Marker.Content>
              </Marker>
              {groupTurns(conversation.slice(0, count)).map(group => (
                <GroupRow key={group.id} group={group} />
              ))}
            </MessageScroller.Content>
          </MessageScroller.Viewport>
          <MessageScroller.Button />
        </MessageScroller>
      </MessageScroller.Provider>
    )
  },
  play: async ({ canvas }) => {
    await expect(
      canvas.getByRole('region', { name: 'Mensagens' }),
    ).toBeVisible()
  },
}
