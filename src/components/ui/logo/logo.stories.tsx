import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect } from 'storybook/test'
import { Logo, HoldingLogo } from './logo'

const meta: Meta<typeof Logo> = {
  title: 'UI/Logo',
  component: Logo,
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

export const HoldingLogoDefault: Story = {
  render: () => <HoldingLogo />,
}

export const HoldingLogoIcon: Story = {
  render: () => <HoldingLogo variant="icon" />,
}

export const HoldingLogoText: Story = {
  render: () => <HoldingLogo variant="text" />,
}
