import type { Meta, StoryObj } from '@storybook/react-vite'
import { Cell } from './cell'
import { Phone } from './phone'

const meta: Meta<typeof Cell> = {
  title: 'UI/Text',
  component: Cell,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
}

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: { children: 'John Doe' },
}

export const Empty: Story = {
  args: { children: undefined },
}

export const Wrap: StoryObj = {
  render: () => (
    <div className="w-40 rounded-lg border p-3 text-sm">
      <Cell wrap>
        This is a long text that wraps naturally when it exceeds the container
        width.
      </Cell>
    </div>
  ),
}

export const NoWrap: StoryObj = {
  render: () => (
    <div className="w-40 rounded-lg border p-3 text-sm">
      <Cell wrap={false}>
        This is a long text that truncates because wrap is disabled.
      </Cell>
    </div>
  ),
}

export const WrapVsNoWrap: StoryObj = {
  render: () => (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-1">
        <span className="text-xs font-medium text-muted-foreground">wrap = true</span>
        <div className="w-48 rounded-lg border p-3 text-sm">
          <Cell wrap>
            International Business Machines Corporation
          </Cell>
        </div>
      </div>
      <div className="flex flex-col gap-1">
        <span className="text-xs font-medium text-muted-foreground">wrap = false (default)</span>
        <div className="w-48 rounded-lg border p-3 text-sm overflow-hidden">
          <Cell wrap={false}>
            International Business Machines Corporation
          </Cell>
        </div>
      </div>
    </div>
  ),
}

export const PhoneNumber: StoryObj = {
  render: () => (
    <div className="flex flex-col gap-2">
      {['+5511999999999', '+12125551234', '+442071838750', null].map((phone, i) => (
        <div key={i} className="flex items-center gap-2 rounded-lg border px-3 py-2 text-sm">
          <Phone phone={phone} />
        </div>
      ))}
    </div>
  ),
}

export const PhoneWithoutFlag: StoryObj = {
  render: () => (
    <div className="rounded-lg border px-3 py-2 text-sm">
      <Phone phone="+5511987654321" flag={false} />
    </div>
  ),
}
