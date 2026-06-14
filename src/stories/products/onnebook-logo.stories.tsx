import type { Meta, StoryObj } from '@storybook/react-vite'
import { OnnebookLogo } from '@/components/ui/logo/onnebook/logo'
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
        <OnnebookLogo />
      </Wrapper>
      <Wrapper label="Icon Only">
        <OnnebookLogo variant="icon" />
      </Wrapper>
      <Wrapper label="Wordmark">
        <OnnebookLogo variant="text" />
      </Wrapper>
    </div>
  ),
}
