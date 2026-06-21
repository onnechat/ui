import type { Meta, StoryObj } from '@storybook/react-vite'
import { OnneLogo } from '@/components/ui/logo/onne/logo'

const Wrapper = ({ children, label }: { children: React.ReactNode; label: string }) => (
  <div
    style={{
      padding: '24px',
      borderRadius: '12px',
      background: 'var--card)',
      border: '1px solid var--border)',
    }}
  >
    <span
      style={{
        fontSize: '12px',
        color: 'var--muted-foreground)',
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
  title: 'Products/Onne/Logo',
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
        <OnneLogo />
      </Wrapper>
      <Wrapper label="Icon">
        <OnneLogo variant="icon" />
      </Wrapper>
      <Wrapper label="Text">
        <OnneLogo variant="text" />
      </Wrapper>
    </div>
  ),
}
