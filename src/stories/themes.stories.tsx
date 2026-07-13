import type { Meta, StoryObj } from '@storybook/react-vite'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'

/**
 * Temas customizados da lib. Troque o tema no seletor da toolbar (ícone de
 * paleta) — `light`, `dark`, `cream`, `claude`, `midnight`, `matrix`. Cada tema
 * re-skina só as SUPERFÍCIES; o `--primary` continua `var(--brand-red)`, então
 * um produto rebranda todos os temas de uma vez sobrescrevendo `--brand-red`.
 */
const meta: Meta = {
  title: 'Introduction/Themes',
  parameters: {
    layout: 'centered',
    // Vitrine de tokens: expõe superfícies de marca (primary etc.) de propósito.
    a11y: { test: 'todo' },
  },
  tags: ['autodocs'],
}

export default meta

type Story = StoryObj

const SURFACES = [
  { name: 'background', className: 'bg-background border' },
  { name: 'card', className: 'bg-card' },
  { name: 'popover', className: 'bg-popover' },
  { name: 'muted', className: 'bg-muted' },
  { name: 'secondary', className: 'bg-secondary' },
  { name: 'accent', className: 'bg-accent' },
  { name: 'sidebar', className: 'bg-sidebar' },
  { name: 'border', className: 'bg-border' },
]

const ACCENTS = [
  { name: 'primary', className: 'bg-primary' },
  { name: 'destructive', className: 'bg-destructive' },
  { name: 'success', className: 'bg-success' },
  { name: 'warning', className: 'bg-warning' },
  { name: 'info', className: 'bg-info' },
]

function Swatch({ name, className }: { name: string; className: string }) {
  return (
    <div className="flex flex-col items-center gap-1.5">
      <div className={`size-14 rounded-xl ${className}`} />
      <span className="text-muted-foreground text-xs">{name}</span>
    </div>
  )
}

/** Paleta de superfícies e acentos do tema ativo. */
export const Palette: Story = {
  render: () => (
    <div className="bg-background text-foreground flex flex-col gap-6 rounded-2xl p-6">
      <div>
        <p className="text-muted-foreground mb-3 text-xs font-medium">
          Superfícies
        </p>
        <div className="flex flex-wrap gap-4">
          {SURFACES.map(s => (
            <Swatch key={s.name} {...s} />
          ))}
        </div>
      </div>
      <div>
        <p className="text-muted-foreground mb-3 text-xs font-medium">Acentos</p>
        <div className="flex flex-wrap gap-4">
          {ACCENTS.map(s => (
            <Swatch key={s.name} {...s} />
          ))}
        </div>
      </div>
    </div>
  ),
}

/** Componentes reais sob o tema ativo — troque o tema na toolbar. */
export const Components: Story = {
  render: () => (
    <div className="bg-background flex w-80 flex-col gap-4 rounded-2xl p-6">
      <Card>
        <Card.Content className="flex flex-col gap-3">
          <p className="text-foreground text-sm font-medium">Novo agendamento</p>
          <Input placeholder="Nome do cliente" />
          <div className="flex flex-wrap gap-1.5">
            <Badge>Confirmado</Badge>
            <Badge variant="secondary">Rascunho</Badge>
            <Badge variant="destructive">Cancelado</Badge>
          </div>
          <div className="flex gap-2">
            <Button variant="primary" size="sm">
              Salvar
            </Button>
            <Button variant="secondary" size="sm">
              Cancelar
            </Button>
          </div>
        </Card.Content>
      </Card>
    </div>
  ),
}
