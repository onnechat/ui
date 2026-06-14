import type { Meta, StoryObj } from '@storybook/react-vite'
import { Textarea } from './textarea'
import { Label } from '@/components/internal/label'

const meta: Meta<typeof Textarea> = {
  title: 'UI/Textarea',
  component: Textarea,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
}

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => <Textarea placeholder="Type your message here..." className="w-80" />,
}

export const WithValue: Story = {
  render: () => (
    <Textarea
      defaultValue="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
      className="w-80"
    />
  ),
}

export const Disabled: Story = {
  render: () => (
    <Textarea
      disabled
      defaultValue="This textarea is disabled and cannot be edited."
      className="w-80"
    />
  ),
}

export const Invalid: Story = {
  render: () => (
    <Textarea
      aria-invalid
      defaultValue="Invalid input content."
      className="w-80"
    />
  ),
}

export const WithLabel: StoryObj = {
  render: () => (
    <div className="flex w-80 flex-col gap-1.5">
      <Label htmlFor="bio">Bio</Label>
      <Textarea id="bio" placeholder="Tell us about yourself..." />
    </div>
  ),
}

export const WithCharacterCount: StoryObj = {
  render: () => {
    const maxLength = 200

    return (
      <div className="flex w-80 flex-col gap-1.5">
        <div className="flex items-center justify-between">
          <Label htmlFor="desc">Description</Label>
          <span className="text-xs text-muted-foreground">0 / {maxLength}</span>
        </div>
        <Textarea
          id="desc"
          maxLength={maxLength}
          placeholder="Brief description..."
        />
      </div>
    )
  },
}

export const CustomRows: StoryObj = {
  render: () => (
    <div className="flex flex-col gap-4">
      <Textarea rows={2} placeholder="2 rows" className="w-80" />
      <Textarea rows={4} placeholder="4 rows (default)" className="w-80" />
      <Textarea rows={8} placeholder="8 rows" className="w-80" />
    </div>
  ),
}

export const FormExample: StoryObj = {
  render: () => (
    <form
      className="flex w-80 flex-col gap-4"
      onSubmit={(e) => {
        e.preventDefault()
        alert('Form submitted')
      }}
    >
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="name">Name</Label>
        <input
          id="name"
          className="flex h-10 w-full rounded-lg border border-input bg-input px-3 py-2 text-sm outline-none transition-[color] focus-visible:ring-[3px] focus-visible:ring-ring/50"
          placeholder="Your name"
        />
      </div>
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="feedback">Feedback</Label>
        <Textarea id="feedback" placeholder="Share your thoughts..." />
      </div>
      <button
        type="submit"
        className="h-10 rounded-lg bg-primary text-primary-foreground px-4 text-sm font-medium"
      >
        Submit
      </button>
    </form>
  ),
}
