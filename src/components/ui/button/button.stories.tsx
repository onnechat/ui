import type { Meta, StoryObj } from '@storybook/react-vite'
import { fn } from 'storybook/test'
import { Button } from './button'
import { Icon } from '@/components/icon'

const meta: Meta<typeof Button> = {
  title: 'UI/Button',
  component: Button,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  args: {
    children: 'Button',
    onClick: fn(),
  },
}

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Variants: StoryObj = {
  render: () => (
    <div className="flex flex-wrap gap-2">
      <Button variant="default">Default</Button>
      <Button variant="destructive">Destructive</Button>
      <Button variant="success">Success</Button>
      <Button variant="outline">Outline</Button>
      <Button variant="primary">Primary</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="ghost">Ghost</Button>
      <Button variant="link">Link</Button>
    </div>
  ),
}

export const Sizes: StoryObj = {
  render: () => (
    <div className="flex flex-wrap items-center gap-2">
      <Button size="sm">Small</Button>
      <Button size="default">Default</Button>
      <Button size="lg">Large</Button>
    </div>
  ),
}

export const IconSizes: StoryObj = {
  render: () => (
    <div className="flex flex-wrap items-center gap-2">
      <Button size="icon-sm">
        <Icon name="Sun" />
      </Button>
      <Button size="icon">
        <Icon name="Moon" />
      </Button>
    </div>
  ),
}

export const WithIcon: StoryObj = {
  render: () => (
    <div className="flex flex-wrap items-center gap-2">
      <Button size="sm">
        <Icon name="Plus" />
        Add Item
      </Button>
      <Button size="default">
        <Icon name="Plus" />
        Add Item
      </Button>
      <Button size="lg">
        <Icon name="Plus" />
        Add Item
      </Button>
    </div>
  ),
}

export const Loading: StoryObj = {
  render: () => (
    <div className="flex flex-wrap gap-2">
      <Button isLoading>Default</Button>
      <Button isLoading variant="destructive">
        Destructive
      </Button>
      <Button isLoading variant="outline">
        Outline
      </Button>
      <Button isLoading variant="primary">
        Primary
      </Button>
      <Button isLoading variant="secondary">
        Secondary
      </Button>
      <Button isLoading variant="ghost">
        Ghost
      </Button>
    </div>
  ),
}

export const Disabled: StoryObj = {
  render: () => (
    <div className="flex flex-wrap gap-2">
      <Button disabled>Default</Button>
      <Button disabled variant="destructive">
        Destructive
      </Button>
      <Button disabled variant="success">
        Success
      </Button>
      <Button disabled variant="outline">
        Outline
      </Button>
      <Button disabled variant="primary">
        Primary
      </Button>
      <Button disabled variant="secondary">
        Secondary
      </Button>
      <Button disabled variant="ghost">
        Ghost
      </Button>
      <Button disabled variant="link">
        Link
      </Button>
    </div>
  ),
}

export const AsChild: StoryObj = {
  render: () => (
    <div className="flex flex-wrap gap-2">
      <Button asChild>
        <a href="#">Link Button</a>
      </Button>
      <Button asChild variant="primary">
        <a href="#">Primary Link</a>
      </Button>
    </div>
  ),
}
