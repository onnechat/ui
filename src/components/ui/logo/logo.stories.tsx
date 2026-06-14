import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect } from 'storybook/test'
import { OnneLogo } from '@/components/ui/logo/onne/logo'
import { OnnebookLogo } from '@/components/ui/logo/onnebook/logo'

const meta: Meta<typeof OnnebookLogo> = {
  title: 'UI/Logo',
  component: OnnebookLogo,
  parameters: {
    layout: 'centered',
  },
  tags: ['ai-generated'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'icon'],
    },
  },
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: { variant: 'default' },
}

export const IconOnly: Story = {
  args: { variant: 'icon' },
}

export const OnneLogoDefault: Story = {
  render: () => <OnneLogo />,
}

export const OnneLogoIcon: Story = {
  render: () => <OnneLogo variant="icon" />,
}

export const OnneLogoText: Story = {
  render: () => <OnneLogo variant="text" />,
}
