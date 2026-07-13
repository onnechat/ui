import type { Meta, StoryObj } from '@storybook/react-vite'
import * as React from 'react'
import { expect } from 'storybook/test'

import { Chat } from './chat'
import { Icon } from '@/components/icon'
import { Avatar } from '@/components/ui/avatar'
import { Bubble } from '@/components/ui/bubble'
import { Button } from '@/components/ui/button'
import { DropdownMenu } from '@/components/ui/dropdown-menu'
import { Marker } from '@/components/ui/marker'
import { Message } from '@/components/ui/message'
import { MessageScroller } from '@/components/ui/message-scroller'
import { Tooltip } from '@/components/ui/tooltip'

const meta: Meta<typeof Chat> = {
  title: 'Blocks/Chat',
  component: Chat,
  subcomponents: {
    'Chat.Header': Chat.Header,
    'Chat.Identity': Chat.Identity,
    'Chat.Body': Chat.Body,
    'Chat.Empty': Chat.Empty,
    'Chat.Typing': Chat.Typing,
    'Chat.Composer': Chat.Composer,
  } as Meta<typeof Chat>['subcomponents'],
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
}

export default meta

type Story = StoryObj<typeof meta>

type ChatMsg = { id: string; role: 'me' | 'them'; text: string }

/** Attachment menu reused by both variants, opening upward from the composer. */
function AttachMenu() {
  return (
    <DropdownMenu>
      <DropdownMenu.Trigger asChild>
        <Button variant="ghost" size="icon-sm" aria-label="Anexar arquivo">
          <Icon name="Plus" />
        </Button>
      </DropdownMenu.Trigger>
      <DropdownMenu.Content align="start" side="top">
        <DropdownMenu.Item>
          <Icon name="Image" />
          Foto ou vídeo
        </DropdownMenu.Item>
        <DropdownMenu.Item>
          <Icon name="Paperclip" />
          Arquivo
        </DropdownMenu.Item>
        <DropdownMenu.Item>
          <Icon name="Camera" />
          Câmera
        </DropdownMenu.Item>
      </DropdownMenu.Content>
    </DropdownMenu>
  )
}

/** Consecutive messages from the same sender share one group (one avatar). */
type Group = { id: string; role: 'me' | 'them'; messages: ChatMsg[] }

function groupMessages(messages: ChatMsg[]): Group[] {
  const groups: Group[] = []
  for (const message of messages) {
    const last = groups[groups.length - 1]
    if (last && last.role === message.role) last.messages.push(message)
    else
      groups.push({ id: message.id, role: message.role, messages: [message] })
  }
  return groups
}

/** One row per GROUP: a single avatar + a stack of bubbles from that sender. */
function GroupRow({
  group,
  avatar,
  footer,
}: {
  group: Group
  avatar?: React.ReactNode
  footer?: React.ReactNode
}) {
  const isMe = group.role === 'me'
  return (
    <MessageScroller.Item messageId={group.id} scrollAnchor={isMe}>
      <Message align={isMe ? 'end' : 'start'}>
        {!isMe && avatar && <Message.Avatar>{avatar}</Message.Avatar>}
        <Message.Content>
          <Message.Group>
            {group.messages.map(message => (
              <Bubble key={message.id} variant={isMe ? 'outgoing' : 'incoming'}>
                <Bubble.Content>{message.text}</Bubble.Content>
              </Bubble>
            ))}
          </Message.Group>
          {footer}
        </Message.Content>
      </Message>
    </MessageScroller.Item>
  )
}

const AGENT_REPLIES = [
  'É rápido: vá em Canais → WhatsApp → Conectar e escaneie o QR code. Assim que confirmar, as mensagens já caem aqui.',
  'Consegui reunir o essencial. Quer que eu mande um resumo em tópicos ou já abro um exemplo pronto?',
  'Certo, tenho o suficiente pra seguir. Preparo isso e te aviso assim que estiver pronto. 🙂',
]

/**
 * Variante com **agente**: o cabeçalho identifica a IA, o corpo é a conversa
 * (balões do assistente à esquerda, do usuário à direita) e — enquanto a
 * resposta é gerada — um `Chat.Typing` aparece logo acima do input, como no
 * Discord. O `Marker` é usado só onde faz sentido: um separador de data.
 */
export const AgentChat: Story = {
  // TODO(a11y): balões outgoing usam o token `primary` (~4.39:1) — débito de tema.
  parameters: { a11y: { test: 'todo' } },
  render: function AgentRender() {
    const [messages, setMessages] = React.useState<ChatMsg[]>([
      {
        id: 'a0',
        role: 'them',
        text: 'Oi! Sou o assistente da Onne. Posso ajudar com conta, cobrança e integrações. Por onde começamos?',
      },
      {
        id: 'u0',
        role: 'me',
        text: 'Como eu conecto o meu número do WhatsApp?',
      },
      {
        id: 'a1',
        role: 'them',
        text: 'É rápido: Canais → WhatsApp → Conectar e escaneie o QR code. Depois disso as mensagens já chegam por aqui.',
      },
    ])
    const [typing, setTyping] = React.useState(false)
    const idRef = React.useRef(2)
    const replyRef = React.useRef(0)

    const send = (text: string) => {
      setMessages(prev => [
        ...prev,
        { id: `u${idRef.current++}`, role: 'me', text },
      ])
      setTyping(true)
      window.setTimeout(() => {
        const reply = AGENT_REPLIES[replyRef.current % AGENT_REPLIES.length]
        replyRef.current += 1
        setTyping(false)
        setMessages(prev => [
          ...prev,
          { id: `a${idRef.current++}`, role: 'them', text: reply },
        ])
      }, 1600)
    }

    return (
      <Tooltip.Provider>
        <Chat>
          <Chat.Header>
            <Chat.Identity
              title="Assistente Onne"
              subtitle="IA · online"
              avatar={
                <Avatar>
                  <Avatar.Fallback className="bg-primary text-primary-foreground">
                    <Icon name="Sparkle" className="size-4" />
                  </Avatar.Fallback>
                </Avatar>
              }
            />
            <Chat.HeaderActions>
              <Tooltip>
                <Tooltip.Trigger asChild>
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    aria-label="Configurações"
                  >
                    <Icon name="Gear" />
                  </Button>
                </Tooltip.Trigger>
                <Tooltip.Content side="bottom">Configurações</Tooltip.Content>
              </Tooltip>
            </Chat.HeaderActions>
          </Chat.Header>

          <Chat.Body>
            <Marker variant="separator">
              <Marker.Content>Hoje</Marker.Content>
            </Marker>

            {groupMessages(messages).map(group => (
              <GroupRow key={group.id} group={group} />
            ))}
          </Chat.Body>

          {typing && <Chat.Typing>Assistente está digitando</Chat.Typing>}

          <Chat.Composer
            onSend={send}
            placeholder="Pergunte alguma coisa…"
            actions={<AttachMenu />}
          />
        </Chat>
      </Tooltip.Provider>
    )
  },
  play: async ({ canvas }) => {
    await expect(canvas.getByText(/por onde começamos/i)).toBeVisible()
    await expect(
      canvas.getByRole('textbox', { name: /pergunte alguma coisa/i }),
    ).toBeVisible()
  },
}

const MARINA_REPLIES = [
  'Boa, faz sentido! Vou ajustar por aqui.',
  'Perfeito, obrigada! 🙌',
  'Fechou! Qualquer coisa a gente se fala.',
]

/**
 * Variante **entre usuários**: avatares nas mensagens recebidas (com o MESMO
 * fundo do balão, pra padronizar), balões enviados à direita com recibo de
 * leitura, e o `Chat.Typing` quando a outra pessoa responde. Aqui o `Marker`
 * aparece no seu lugar certo: uma nota de sistema (conversa protegida) e o
 * separador de data.
 */
export const DirectChat: Story = {
  // TODO(a11y): balões outgoing usam o token `primary` (~4.39:1) — débito de tema.
  parameters: { a11y: { test: 'todo' } },
  render: function DirectRender() {
    const [messages, setMessages] = React.useState<ChatMsg[]>([
      {
        id: 'd0',
        role: 'them',
        text: 'Oi! Conseguiu ver a proposta que te mandei?',
      },
      { id: 'd1', role: 'me', text: 'Consegui sim, tô revisando agora.' },
      { id: 'd2', role: 'them', text: 'Perfeito. Qualquer ajuste é só falar.' },
    ])
    const [typing, setTyping] = React.useState(false)
    const idRef = React.useRef(3)
    const replyRef = React.useRef(0)

    const send = (text: string) => {
      setMessages(prev => [
        ...prev,
        { id: `m${idRef.current++}`, role: 'me', text },
      ])
      setTyping(true)
      window.setTimeout(() => {
        const reply = MARINA_REPLIES[replyRef.current % MARINA_REPLIES.length]
        replyRef.current += 1
        setTyping(false)
        setMessages(prev => [
          ...prev,
          { id: `t${idRef.current++}`, role: 'them', text: reply },
        ])
      }, 1800)
    }

    const avatar = (
      <Avatar className="size-7">
        <Avatar.Fallback className="bg-card text-card-foreground text-xs">
          ML
        </Avatar.Fallback>
      </Avatar>
    )
    const groups = groupMessages(messages)
    const lastMineGroup = [...groups].reverse().find(g => g.role === 'me')

    return (
      <Chat>
        <Chat.Header>
          <Chat.Identity
            title="Marina Lopes"
            subtitle="online"
            avatar={
              <Avatar>
                <Avatar.Fallback className="bg-card text-card-foreground">
                  ML
                </Avatar.Fallback>
              </Avatar>
            }
          />
          <Chat.HeaderActions>
            <Button
              variant="ghost"
              size="icon-sm"
              aria-label="Buscar na conversa"
            >
              <Icon name="Magnifier" />
            </Button>
          </Chat.HeaderActions>
        </Chat.Header>

        <Chat.Body>
          <Marker>
            <Marker.Icon>
              <Icon name="ShieldCheck" />
            </Marker.Icon>
            <Marker.Content>
              As mensagens desta conversa são protegidas
            </Marker.Content>
          </Marker>

          <Marker variant="separator">
            <Marker.Content>Hoje</Marker.Content>
          </Marker>

          {groups.map(group => (
            <GroupRow
              key={group.id}
              group={group}
              avatar={group.role === 'them' ? avatar : undefined}
              footer={
                group.id === lastMineGroup?.id ? (
                  <Message.Footer>
                    <Icon
                      name="CheckDouble"
                      className="text-primary size-3.5"
                    />
                    Lida
                  </Message.Footer>
                ) : undefined
              }
            />
          ))}
        </Chat.Body>

        {typing && <Chat.Typing>Marina está digitando</Chat.Typing>}

        <Chat.Composer onSend={send} actions={<AttachMenu />} />
      </Chat>
    )
  },
  play: async ({ canvas }) => {
    await expect(canvas.getByText(/conseguiu ver a proposta/i)).toBeVisible()
  },
}

/** Conversa vazia: o `Chat.Empty` convida a começar. */
export const Empty: Story = {
  render: () => (
    <Chat>
      <Chat.Header>
        <Chat.Identity
          title="Assistente Onne"
          subtitle="IA · pronto para começar"
          avatar={
            <Avatar>
              <Avatar.Fallback className="bg-primary text-primary-foreground">
                <Icon name="Sparkle" className="size-4" />
              </Avatar.Fallback>
            </Avatar>
          }
        />
      </Chat.Header>
      <Chat.Body>
        <Chat.Empty
          icon="Message"
          title="Comece uma conversa"
          description="Pergunte qualquer coisa ou anexe um arquivo para o assistente analisar."
        />
      </Chat.Body>
      <Chat.Composer
        placeholder="Escreva a primeira mensagem…"
        actions={<AttachMenu />}
      />
    </Chat>
  ),
  play: async ({ canvas }) => {
    await expect(canvas.getByText('Comece uma conversa')).toBeVisible()
  },
}
