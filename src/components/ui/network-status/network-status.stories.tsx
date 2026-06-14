import * as React from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { Icon } from '@/components/icon'
import { NetworkStatus } from './network-status'

const meta: Meta<typeof NetworkStatus> = {
  title: 'UI/NetworkStatus',
  component: NetworkStatus,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
}

export default meta

type Story = StoryObj<typeof meta>

function OfflineBanner() {
  return (
    <div className="flex items-center gap-2 rounded-b-xl border border-destructive/20 border-t-0 bg-destructive/10 px-4 py-2 text-xs font-medium text-destructive shadow-sm">
      <Icon name="WifiOff" className="size-3.5 shrink-0" />
      <span>offline</span>
    </div>
  )
}

function BackOnlineBanner() {
  return (
    <div className="flex items-center gap-2 rounded-b-xl border border-success/20 border-t-0 bg-success/15 px-4 py-2 text-xs font-medium text-success shadow-sm">
      <Icon name="Wifi" className="size-3.5 shrink-0" />
      <span>back</span>
    </div>
  )
}

export const Default: Story = {
  render: () => (
    <div className="flex min-h-80 items-start justify-center bg-background pt-4">
      <NetworkStatus />
      <p className="mt-20 text-sm text-muted-foreground">
        The banner appears at the top when offline or reconnecting.
        Disconnect your network to see it live.
      </p>
    </div>
  ),
}

export const Offline: Story = {
  render: () => (
    <div className="flex min-h-40 items-start justify-center bg-background pt-4">
      <OfflineBanner />
    </div>
  ),
}

export const BackOnline: Story = {
  render: () => (
    <div className="flex min-h-40 items-start justify-center bg-background pt-4">
      <BackOnlineBanner />
    </div>
  ),
}

export const BothStates: Story = {
  render: () => (
    <div className="flex min-h-40 flex-col items-center gap-8 bg-background pt-4">
      <OfflineBanner />
      <BackOnlineBanner />
    </div>
  ),
}
