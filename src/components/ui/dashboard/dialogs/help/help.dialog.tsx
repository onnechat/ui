'use client'

import { useEffect, useState } from 'react'

import { toast } from 'sonner'
import { create } from 'zustand'

import { cn } from '@/lib/cn'
import { version } from '@/lib/version'

import { useWorkspaceStore } from '@/stores/workspace-store'

import { useCustomMutation } from '@/hooks/use-custom-mutation'
import { useMe } from '@/hooks/user/use-me'

import { ANIMATION } from '@/constants/animations'

import { Dialog } from '@/components/ui/dialog'
import { Icon, type IconType } from '@/components/icon'

import { Label } from '@/components/internal/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/internal/select'
import { Textarea } from '@/components/internal/textarea'

import { uploadToDiscord } from './actions/send-to-discord'

interface HelpDialogStore {
  isOpen: boolean
  open: () => void
  close: () => void
  toggle: () => void
}

const _internalStore = create<HelpDialogStore>((set) => ({
  isOpen: false,
  open: () => set({ isOpen: true }),
  close: () => set({ isOpen: false }),
  toggle: () => set((state) => ({ isOpen: !state.isOpen })),
}))

export type FeedbackType = 'feedback' | 'bug' | 'question'

export interface ScreenshotData {
  file: File
  preview: string
}

const HelpDialog = () => {
  const { me } = useMe()
  const { workspace } = useWorkspaceStore()

  const { isOpen, close, toggle } = _internalStore()

  const [type, setType] = useState<FeedbackType>('question')
  const [message, setMessage] = useState('')

  const { isPending, mutate: handleSubmit } = useCustomMutation({
    mutationFn: async () => {
      if (!message.trim()) {
        toast.error('emptyMessage')
        return
      }

      try {
        const data = collectEnvironmentData()

        const { ok } = await uploadToDiscord({
          type,
          data,
          message,
        })

        if (!ok) {
          throw new Error()
        }

        toast.success(
          type === 'feedback'
            ? 'feedbackSuccess'
            : type === 'bug'
              ? 'bugReportSuccess'
              : 'questionSuccess',
        )

        close()
      } catch {
        toast.error('sendError')
      }
    },
    onSuccess: () => {
      setTimeout(() => {
        setType('question')
        setMessage('')
      }, ANIMATION.DURATION)
    },
  })

  const collectEnvironmentData = () => {
    const now = new Date()
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone

    const hostname = window.location.hostname
    const pathname = window.location.pathname.replace(hostname, '')

    const url = window.location.href

    return {
      user: {
        id: me?.id,
        name: me?.name,
        email: me?.email,
      },
      workspace: {
        id: workspace?.id,
        name: workspace?.name,
        slug: workspace?.slug,
      },
      environment: {
        pathname,
        hostname,
        url,
        timestamp: now.toISOString(),
        timezone,
        userAgent: navigator.userAgent,
        language: navigator.language,
        platform: navigator.platform,
        cookieEnabled: navigator.cookieEnabled,
        onLine: navigator.onLine,
        screenResolution: `${screen.width}x${screen.height}`,
        viewportSize: `${window.innerWidth}x${window.innerHeight}`,
      },
      app: {
        version: version.semver,
      },
      browser: {
        name: getBrowserName(),
        version: getBrowserVersion(),
      },
      os: {
        name: getOSName(),
        version: getOSVersion(),
      },
    }
  }

  const getBrowserName = (): string => {
    const userAgent = navigator.userAgent

    if (userAgent.includes('Chrome')) return 'Chrome'
    if (userAgent.includes('Firefox')) return 'Firefox'
    if (userAgent.includes('Safari')) return 'Safari'
    if (userAgent.includes('Edge')) return 'Edge'
    if (userAgent.includes('Opera')) return 'Opera'

    return 'Unknown'
  }

  const getBrowserVersion = (): string => {
    const userAgent = navigator.userAgent
    const match = userAgent.match(/(Chrome|Firefox|Safari|Edge|Opera)\/(\d+)/)

    return match ? match[2] : 'Unknown'
  }

  const getOSName = (): string => {
    const userAgent = navigator.userAgent

    if (userAgent.includes('Windows')) return 'Windows'
    if (userAgent.includes('Mac')) return 'macOS'
    if (userAgent.includes('Linux')) return 'Linux'
    if (userAgent.includes('Android')) return 'Android'
    if (userAgent.includes('iOS')) return 'iOS'

    return 'Unknown'
  }

  const getOSVersion = (): string => {
    const userAgent = navigator.userAgent
    const match = userAgent.match(/(\w+\/\d+\.\d+)/)

    return match ? match[1] : 'Unknown'
  }

  useEffect(() => {
    if (isOpen) return

    setTimeout(() => {
      setType('question')
      setMessage('')
    }, ANIMATION.DURATION)
  }, [isOpen])

  return (
    <Dialog
      title={`title.${type}`}
      description={`description.${type}`}
      isOpen={isOpen}
      onOpenChange={toggle}
      actions={[
        {
          label: 'actions.send',
          isLoading: isPending,
          variant: 'primary',
          onClick: () => handleSubmit(),
          disabled: isPending || !message.trim(),
        },
      ]}
    >
      <div className="space-y-3">
        <Label htmlFor="type">
          {'fields.type'}
          <span className="text-destructive">*</span>
        </Label>
        <Select
          value={type}
          onValueChange={(value: FeedbackType) => setType(value)}
        >
          <SelectTrigger id="type" className="bg-input">
            <SelectValue placeholder={'placeholders.type'} />
          </SelectTrigger>

          <SelectContent>
            {[
              {
                value: 'question',
                label: 'types.question',
                icon: 'CircleQuestion',
                color: 'var(--info)',
              },
              {
                value: 'feedback',
                label: 'types.feedback',
                icon: 'ChatBubble',
                color: 'var(--success)',
              },
              {
                value: 'bug',
                label: 'types.bug',
                icon: 'AlertWarning',
                color: 'var(--destructive)',
              },
            ].map((item) => (
              <SelectItem key={item.value} value={item.value}>
                <div className="flex items-center gap-2">
                  <Icon
                    name={item.icon as IconType}
                    style={
                      {
                        '--type-color': item.color,
                      } as React.CSSProperties
                    }
                    className={cn('h-4 w-4', 'text-(--type-color)')}
                  />

                  <span>{item.label}</span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-3">
        <Label htmlFor="message">
          {'fields.message'}
          <span className="text-destructive">*</span>
        </Label>

        <Textarea
          id="message"
          rows={6}
          value={message}
          className="resize-none"
          onChange={(e) => setMessage(e.target.value)}
          placeholder={`placeholders.message.${type}`}
        />
      </div>
    </Dialog>
  )
}

HelpDialog.displayName = 'HelpDialog'

export const useHelpDialog = () => {
  const { isOpen, open, close, toggle } = _internalStore()

  return {
    isOpen,
    open,
    close,
    toggle,
  }
}

export { HelpDialog }
