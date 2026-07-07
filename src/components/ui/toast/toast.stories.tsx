import type { Meta, StoryObj } from '@storybook/react-vite'
import { toast } from 'sonner'
import { Toaster } from './toast'
import { Button } from '@/components/ui/button'

const meta: Meta<typeof Toaster> = {
  title: 'UI/Toaster',
  component: Toaster,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
  args: {
    position: 'bottom-center',
  },
}

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: (args) => (
    <div className="flex min-h-96 items-center justify-center">
      <Toaster {...args} />
      <Button onClick={() => toast('Event has been created')}>
        Show Toast
      </Button>
    </div>
  ),
}

export const Types: StoryObj = {
  render: (args) => (
    <div className="flex min-h-96 items-center justify-center">
      <Toaster {...args} />
      <div className="flex flex-wrap gap-2">
        <Button onClick={() => toast.success('Changes saved successfully')}>Success</Button>
        <Button variant="destructive" onClick={() => toast.error('Failed to save changes')}>Error</Button>
        <Button variant="secondary" onClick={() => toast.info('New update available')}>Info</Button>
        <Button variant="outline" onClick={() => toast.warning('Your session will expire soon')}>Warning</Button>
        <Button
          variant="outline"
          onClick={() =>
            toast.promise(
              new Promise((resolve) => setTimeout(resolve, 2000)),
              { loading: 'Uploading file...', success: 'File uploaded', error: 'Upload failed' },
            )
          }
        >
          Promise
        </Button>
      </div>
    </div>
  ),
}

export const WithDescription: StoryObj = {
  render: (args) => (
    <div className="flex min-h-96 items-center justify-center">
      <Toaster {...args} />
      <div className="flex flex-wrap gap-2">
        <Button
          variant="outline"
          onClick={() =>
            toast.success('Changes saved', {
              description: 'Your profile has been updated successfully.',
            })
          }
        >
          Success
        </Button>
        <Button
          variant="destructive"
          onClick={() =>
            toast.error('Upload failed', {
              description: 'The file is too large. Maximum size is 5MB.',
            })
          }
        >
          Error
        </Button>
        <Button
          variant="secondary"
          onClick={() =>
            toast.info('New feature', {
              description: 'You can now export reports in PDF format.',
            })
          }
        >
          Info
        </Button>
        <Button
          variant="outline"
          onClick={() =>
            toast.warning('Storage almost full', {
              description: 'You have used 92% of your storage. Upgrade to continue.',
            })
          }
        >
          Warning
        </Button>
      </div>
    </div>
  ),
}

export const Positions: StoryObj = {
  render: () => (
    <div className="flex min-h-96 items-center justify-center">
      <Toaster richColors position="bottom-center" />
      <div className="flex flex-wrap gap-2">
        {(['top-left', 'top-center', 'top-right', 'bottom-left', 'bottom-center', 'bottom-right'] as const).map(
          (pos) => (
            <Button
              key={pos}
              variant="outline"
              onClick={() => toast(`Position: ${pos}`, { position: pos })}
            >
              {pos}
            </Button>
          ),
        )}
      </div>
    </div>
  ),
}

export const RichContent: StoryObj = {
  render: (args) => (
    <div className="flex min-h-96 items-center justify-center">
      <Toaster {...args} />
      <Button
        onClick={() =>
          toast('Friend request', {
            description: 'Jane Cooper wants to add you as a friend.',
            action: { label: 'Accept', onClick: () => toast.success('Friend request accepted') },
            cancel: { label: 'Decline', onClick: () => toast('Friend request declined') },
          })
        }
      >
        Rich Toast
      </Button>
    </div>
  ),
}

export const LoadingState: StoryObj = {
  render: (args) => (
    <div className="flex min-h-96 items-center justify-center">
      <Toaster {...args} />
      <Button
        variant="primary"
        onClick={() =>
          toast.promise(
            new Promise<string>((resolve) => setTimeout(() => resolve('Payment completed'), 1500)),
            {
              loading: 'Processing payment...',
              success: (data) => data,
              error: 'Payment failed',
            },
          )
        }
      >
        Simulate Payment
      </Button>
    </div>
  ),
}
