import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect } from 'storybook/test'

import { Message } from './message'
import { Avatar } from '@/components/ui/avatar'
import { Bubble } from '@/components/ui/bubble'

const meta: Meta<typeof Message> = {
  title: 'UI/Message',
  component: Message,
  subcomponents: {
    'Message.Avatar': Message.Avatar,
    'Message.Content': Message.Content,
    'Message.Header': Message.Header,
    'Message.Footer': Message.Footer,
    'Message.Group': Message.Group,
  } as Meta<typeof Message>['subcomponents'],
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    align: {
      control: 'inline-radio',
      options: ['start', 'end'],
      description:
        'Lado da linha. `start` = mensagem recebida (outra pessoa); `end` = enviada (usuário atual). Vira o avatar e o conteúdo de lado.',
      table: {
        category: 'Aparência',
        type: { summary: "'start' | 'end'" },
        defaultValue: { summary: "'start'" },
      },
    },
    children: {
      control: false,
      description:
        'Composição livre: `Message.Avatar`, `Message.Content` (com `Message.Header`, `Bubble`, `Message.Footer`).',
      table: { category: 'Conteúdo' },
    },
  },
}

export default meta

type Story = StoryObj<typeof meta>

export const Playground: Story = {
  // TODO(a11y): o balão outgoing usa o token `primary` (~4.39:1) — débito de tema.
  parameters: { a11y: { test: 'todo' } },
  render: () => (
    <div className="flex w-96 flex-col gap-4">
      <Message align="start">
        <Message.Avatar>
          <Avatar>
            <Avatar.Fallback className="bg-card text-card-foreground">
              AS
            </Avatar.Fallback>
          </Avatar>
        </Message.Avatar>
        <Message.Content>
          <Message.Header>Ana Souza</Message.Header>
          <Bubble variant="incoming">
            <Bubble.Content>Oi! Tudo bem por aí?</Bubble.Content>
          </Bubble>
          <Message.Footer>10:32</Message.Footer>
        </Message.Content>
      </Message>

      <Message align="end">
        <Message.Content>
          <Bubble variant="outgoing">
            <Bubble.Content>Tudo ótimo, e com você?</Bubble.Content>
          </Bubble>
          <Message.Footer>10:33 · Lida</Message.Footer>
        </Message.Content>
      </Message>
    </div>
  ),
  play: async ({ canvas }) => {
    await expect(canvas.getByText('Ana Souza')).toBeVisible()
    await expect(canvas.getByText('Oi! Tudo bem por aí?')).toBeVisible()
  },
}

/**
 * Mensagens consecutivas do mesmo remetente ficam agrupadas com espaçamento
 * menor, um único avatar ancorado embaixo e um footer só no fim.
 */
export const Grouped: Story = {
  // TODO(a11y): o balão outgoing usa o token `primary` (~4.39:1) — débito de tema.
  parameters: { a11y: { test: 'todo' } },
  render: () => (
    <div className="flex w-96 flex-col gap-4">
      <Message align="start">
        <Message.Avatar>
          <Avatar>
            <Avatar.Fallback className="bg-card text-card-foreground">
              AS
            </Avatar.Fallback>
          </Avatar>
        </Message.Avatar>
        <Message.Content>
          <Message.Header>Ana Souza</Message.Header>
          <Message.Group>
            <Bubble variant="incoming">
              <Bubble.Content>Consegui terminar a proposta.</Bubble.Content>
            </Bubble>
            <Bubble variant="incoming">
              <Bubble.Content>Te mando o link em seguida.</Bubble.Content>
            </Bubble>
            <Bubble variant="incoming">
              <Bubble.Content>Podemos revisar hoje à tarde?</Bubble.Content>
            </Bubble>
          </Message.Group>
          <Message.Footer>10:41</Message.Footer>
        </Message.Content>
      </Message>

      <Message align="end">
        <Message.Content>
          <Message.Group>
            <Bubble variant="outgoing">
              <Bubble.Content>Perfeito!</Bubble.Content>
            </Bubble>
            <Bubble variant="outgoing">
              <Bubble.Content>Fecho as 15h então.</Bubble.Content>
            </Bubble>
          </Message.Group>
          <Message.Footer>10:42 · Lida</Message.Footer>
        </Message.Content>
      </Message>
    </div>
  ),
}

/**
 * O `Message.Avatar` é `sticky`: num grupo longo do mesmo remetente, ele
 * acompanha o balão visível mais recente enquanto a conversa rola, sem descer
 * até o rodapé (horário). Role a caixa abaixo para ver o avatar grudar embaixo.
 */
export const StickyAvatar: Story = {
  // TODO(a11y): o balão outgoing usa o token `primary` (~4.39:1) — débito de tema.
  parameters: { a11y: { test: 'todo' }, layout: 'padded' },
  render: () => {
    const lines = [
      'Bom dia! Comecei a revisão da proposta.',
      'Ajustei a introdução pra ficar mais direta.',
      'Troquei os números da tabela de preços.',
      'Adicionei um parágrafo sobre o suporte.',
      'Revisei a parte de escopo — tava ambígua.',
      'Coloquei os prazos numa lista, ficou melhor.',
      'Removi aquele trecho repetido do meio.',
      'Corrigi uns errinhos de digitação.',
      'Refiz o resumo executivo do começo.',
      'Deixei os anexos no final, organizados.',
      'Padronizei as fontes e o espaçamento.',
      'Confere quando puder e me diz o que achou. 🙂',
    ]
    return (
      <div className="bg-muted h-96 w-96 overflow-y-auto rounded-2xl p-4">
        <Message align="start">
          <Message.Avatar>
            <Avatar>
              <Avatar.Fallback className="bg-card text-card-foreground">
                AS
              </Avatar.Fallback>
            </Avatar>
          </Message.Avatar>
          <Message.Content>
            <Message.Header>Ana Souza</Message.Header>
            <Message.Group>
              {lines.map(line => (
                <Bubble key={line} variant="incoming">
                  <Bubble.Content>{line}</Bubble.Content>
                </Bubble>
              ))}
            </Message.Group>
            <Message.Footer>10:48</Message.Footer>
          </Message.Content>
        </Message>
      </div>
    )
  },
}

/**
 * As duas variantes de `Bubble`: `incoming` (cor de card) e `outgoing`
 * (primary).
 */
export const BubbleVariants: Story = {
  // TODO(a11y): `outgoing` usa o token `primary` (~4.39:1) — débito de tema.
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
