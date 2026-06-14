import type { Meta, StoryObj } from '@storybook/react-vite'
import { Logo } from '@/components/ui/logo/logo'
import { env } from '@/lib/env'
import { products } from '@/config/products'

const onnebook = products.find((p) => p.id === 'onnebook')!

const Wrapper = ({ children, label }: { children: React.ReactNode; label: string }) => (
  <div
    style={{
      padding: '24px',
      borderRadius: '12px',
      background: 'hsl(var(--card))',
      border: '1px solid hsl(var(--border))',
    }}
  >
    <span
      style={{
        fontSize: '12px',
        color: 'hsl(var(--muted-foreground))',
        display: 'block',
        marginBottom: '16px',
      }}
    >
      {label}
    </span>
    {children}
  </div>
)

const Wordmark = () => (
  <span
    style={{
      fontSize: '28px',
      fontWeight: 700,
      background: `linear-gradient(135deg, ${onnebook.colors.gradient.join(', ')})`,
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
    }}
  >
    {env.brand.name}
  </span>
)

const meta: Meta = {
  title: 'Products/Onnebook/Logo',
  parameters: {
    layout: 'padded',
  },
}

export default meta
type Story = StoryObj

export const Default: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', padding: '32px', maxWidth: '400px' }}>
      <Wrapper label="Default">
        <Logo />
      </Wrapper>
      <Wrapper label="Icon Only">
        <Logo variant="icon" />
      </Wrapper>
      <Wrapper label="Wordmark">
        <Wordmark />
      </Wrapper>
    </div>
  ),
}
