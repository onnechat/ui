import type { Meta, StoryObj } from '@storybook/react-vite'
import { fn } from 'storybook/test'
import { Switch } from './switch'
import { Label } from '@/components/ui/label'

const meta: Meta<typeof Switch> = {
  title: 'UI/Switch',
  component: Switch,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  args: {
    onCheckedChange: fn(),
  },
}

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Checked: Story = {
  args: {
    defaultChecked: true,
  },
}

export const Disabled: StoryObj = {
  render: () => (
    <div className="flex items-center gap-4">
      <Switch disabled />
      <Switch disabled defaultChecked />
    </div>
  ),
}

export const WithLabel: StoryObj = {
  render: () => (
    <div className="flex items-center space-x-2">
      <Switch id="airplane-mode" />
      <Label htmlFor="airplane-mode">Airplane Mode</Label>
    </div>
  ),
}

export const LabelChecked: StoryObj = {
  render: () => (
    <div className="flex items-center space-x-2">
      <Switch id="notifications" defaultChecked />
      <Label htmlFor="notifications">Notifications</Label>
    </div>
  ),
}

export const FormExample: StoryObj = {
  render: () => (
    <form
      className="flex flex-col gap-4"
      onSubmit={(e) => {
        e.preventDefault()
        const data = new FormData(e.currentTarget)
        alert(JSON.stringify({ marketing: data.get('marketing'), security: data.get('security') }))
      }}
    >
      <div className="flex flex-col gap-3">
        <div className="flex items-center space-x-2">
          <Switch id="marketing" name="marketing" value="1" defaultChecked />
          <Label htmlFor="marketing">Marketing emails</Label>
        </div>
        <div className="flex items-center space-x-2">
          <Switch id="security" name="security" value="1" />
          <Label htmlFor="security">Security alerts</Label>
        </div>
      </div>
      <button
        type="submit"
        className="h-9 rounded-lg bg-primary text-primary-foreground px-4 text-sm font-medium"
      >
        Save Preferences
      </button>
    </form>
  ),
}
