import type { Meta, StoryObj } from '@storybook/react-vite'
import { Avatar } from './avatar'

const meta: Meta<typeof Avatar> = {
  title: 'UI/Avatar',
  component: Avatar,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
}

export default meta

type Story = StoryObj<typeof meta>

const IMG = 'https://github.com/shadcn.png'

export const Default: Story = {
  render: () => (
    <Avatar>
      <Avatar.Image src={IMG} />
      <Avatar.Fallback name="Shadcn" />
    </Avatar>
  ),
}

export const Initials: StoryObj = {
  render: () => (
    <div className="flex flex-wrap gap-2">
      <Avatar>
        <Avatar.Fallback name="John Doe" />
      </Avatar>
      <Avatar>
        <Avatar.Fallback name="Maria Silva" />
      </Avatar>
      <Avatar>
        <Avatar.Fallback name="Single" />
      </Avatar>
    </div>
  ),
}

export const CustomFallback: StoryObj = {
  render: () => (
    <div className="flex flex-wrap gap-2">
      <Avatar>
        <Avatar.Image src="/broken.png" />
        <Avatar.Fallback>JD</Avatar.Fallback>
      </Avatar>
      <Avatar className="bg-destructive text-destructive-foreground">
        <Avatar.Image src="/broken.png" />
        <Avatar.Fallback>!!</Avatar.Fallback>
      </Avatar>
    </div>
  ),
}

export const Sizes: StoryObj = {
  render: () => (
    <div className="flex flex-wrap items-center gap-2">
      {[6, 8, 10, 12, 14].map((size) => (
        <Avatar key={size} className={`size-${size}`}>
          <Avatar.Image src={IMG} />
          <Avatar.Fallback name="Shadcn">S</Avatar.Fallback>
        </Avatar>
      ))}
    </div>
  ),
}

export const Group: StoryObj = {
  render: () => (
    <div className="flex -space-x-2">
      {['John Doe', 'Maria Silva', 'Bob Lee', 'Ana Costa'].map((name, i) => (
        <Avatar key={name} className="ring-2 ring-background">
          <Avatar.Image src={i === 0 ? IMG : '/broken.png'} />
          <Avatar.Fallback name={name} />
        </Avatar>
      ))}
    </div>
  ),
}

export const RoundedGroup: StoryObj = {
  render: () => (
    <div className="flex -space-x-2">
      {['John Doe', 'Maria Silva', 'Bob Lee', 'Ana Costa'].map((name, i) => (
        <Avatar key={name} className="ring-2 ring-background rounded-full">
          <Avatar.Image src={i === 0 ? IMG : '/broken.png'} />
          <Avatar.Fallback name={name} />
        </Avatar>
      ))}
    </div>
  ),
}

export const WithStatusIndicator: StoryObj = {
  render: () => (
    <div className="flex flex-wrap gap-4">
      <div className="relative">
        <Avatar>
          <Avatar.Image src={IMG} />
          <Avatar.Fallback name="Online" />
        </Avatar>
        <span className="absolute -bottom-0.5 -right-0.5 size-2.5 rounded-full ring-2 ring-background bg-success" />
      </div>
      <div className="relative">
        <Avatar>
          <Avatar.Image src="/broken.png" />
          <Avatar.Fallback name="Away" />
        </Avatar>
        <span className="absolute -bottom-0.5 -right-0.5 size-2.5 rounded-full ring-2 ring-background bg-warning" />
      </div>
      <div className="relative">
        <Avatar>
          <Avatar.Image src="/broken.png" />
          <Avatar.Fallback name="Offline" />
        </Avatar>
        <span className="absolute -bottom-0.5 -right-0.5 size-2.5 rounded-full ring-2 ring-background bg-muted-foreground" />
      </div>
    </div>
  ),
}
