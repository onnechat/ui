import type { Meta, StoryObj } from '@storybook/react-vite'
import { products } from '@/config/products'

const onnebook = products.find((p) => p.id === 'onnebook')!

const ColorSwatch = ({ color, label, foreground }: { color: string; label: string; foreground?: string }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '8px 0' }}>
    <div style={{ width: '40px', height: '40px', borderRadius: '8px', backgroundColor: color, border: '1px solid hsl(var(--border))', flexShrink: 0 }} />
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      <span style={{ fontWeight: 600, fontSize: '14px' }}>{label}</span>
      <span style={{ fontSize: '12px', color: 'hsl(var(--muted-foreground))' }}>{color}</span>
    </div>
  </div>
)

const GradientBar = ({ colors }: { colors: string[] }) => (
  <div style={{ display: 'flex', borderRadius: '8px', overflow: 'hidden', border: '1px solid hsl(var(--border))', height: '48px', width: '100%', maxWidth: '400px' }}>
    {colors.map((color, i) => (
      <div key={i} style={{ flex: 1, backgroundColor: color }} />
    ))}
  </div>
)

const meta: Meta = {
  title: 'Products/Onnebook/Colors',
  parameters: {
    layout: 'padded',
  },
}

export default meta
type Story = StoryObj

export const Palette: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px', padding: '32px', maxWidth: '500px' }}>
      <section>
        <h3 style={{ fontSize: '14px', fontWeight: 600, marginBottom: '12px', color: 'hsl(var(--muted-foreground))' }}>
          Brand Colors
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {onnebook.colors.palette.map((c) => (
            <ColorSwatch key={c.name} color={c.color} label={c.name} />
          ))}
        </div>
      </section>

      <section>
        <h3 style={{ fontSize: '14px', fontWeight: 600, marginBottom: '12px', color: 'hsl(var(--muted-foreground))' }}>
          Gradient
        </h3>
        <GradientBar colors={onnebook.colors.gradient} />
        <div style={{ display: 'flex', flexDirection: 'column', marginTop: '8px' }}>
          {onnebook.colors.gradient.map((color, i) => (
            <ColorSwatch key={i} color={color} label={`Gradient ${i + 1}`} />
          ))}
        </div>
      </section>
    </div>
  ),
}
