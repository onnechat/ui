'use client'

import { useEffect, useMemo, useState } from 'react'

import { Icon } from '@/components/icon'
import { SocialIcon } from '@/components/icon/social'

import { AssistantChat, AssistantChatTheme, type ChatMessage } from './chat'

export const ChatPreview = ({
  messages,
  className,
}: {
  messages: ChatMessage[]
  className?: string
}) => {
  const options = useMemo(
    () => [
      {
        label: 'WhatsApp',
        value: 'whatsapp' as const,
        icon: (props: { className?: string }) => (
          <SocialIcon.WhatsApp {...props} />
        ),
      },
      {
        label: 'Instagram',
        value: 'instagram' as const,
        disabled: true,
        icon: (props: { className?: string }) => (
          <SocialIcon.Instagram {...props} />
        ),
      },
      {
        label: 'Messenger',
        value: 'messenger' as const,
        disabled: true,
        icon: (props: { className?: string }) => (
          <SocialIcon.Messenger {...props} />
        ),
      },
      {
        label: 'Webchat',
        value: 'webchat' as const,
        disabled: true,
        icon: (props: { className?: string }) => (
          <Icon name="ChatBot" {...props} />
        ),
      },
    ],
    [],
  )

  const internalMessages: ChatMessage[] = useMemo(() => messages, [messages])

  const [theme, setTheme] = useState<AssistantChatTheme>(
    options.filter((option) => !option.disabled)[0].value,
  )

  const [hasCompletedCycle, setHasCompletedCycle] = useState(false)

  const currentTheme =
    options.find(({ value }) => value === theme) ?? options[0]

  useEffect(() => {
    if (hasCompletedCycle) {
      return
    }

    const activeOptions = options.filter((option) => !option.disabled)

    const currentIndex = activeOptions.findIndex(({ value }) => value === theme)

    const nextIndex = (currentIndex + 1) % activeOptions.length
    const nextTheme = activeOptions[nextIndex].value

    const isCompletingCycle =
      nextIndex === 0 && currentIndex === activeOptions.length - 1

    if (isCompletingCycle) {
      setHasCompletedCycle(true)

      const timer = setTimeout(() => {
        setTheme(nextTheme)
      }, 5000)

      return () => clearTimeout(timer)
    }

    const timer = setTimeout(() => {
      setTheme(nextTheme)
    }, 5000)

    return () => clearTimeout(timer)
  }, [theme, options, hasCompletedCycle])

  return (
    <div className="flex flex-col gap-4 w-full max-lg:max-w-xl">
      {/* <div className="flex items-center gap-1 justify-center lg:justify-end max-sm:w-full sm:overflow-x-visible max-sm:overflow-x-auto snap-mandatory no-scrollbar py-1">
        {options.map(({ label, value, icon }) => {
          const isActive = theme === value
          const IconComponent = () => icon({ className: 'size-3.5 shrink-0' })

          return (
            <Button
              size={isActive ? 'icon' : 'sm'}
              key={value}
              onClick={() => {
                setHasCompletedCycle(false)
                setTheme(value as AssistantChatTheme)
              }}
              className={cn(
                'group relative px-2.5 py-1.5 rounded-full border flex items-center justify-center gap-1.5 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] h-8 shrink-0 cursor-pointer transition-[transform,box-shadow] duration-500 ease-in-out transform',
                isActive
                  ? 'bg-card hover:bg-accent/90 text-foreground border-transparent w-fit min-w-8 animate-in zoom-in-95 duration-300'
                  : 'bg-card/50 text-foreground/25 hover:bg-accent/50 hover:text-foreground/50 border-border/40 w-8 aspect-square hover:border-border/60',
              )}
            >
              <IconComponent />

              {isActive && (
                <span className="leading-none select-none w-fit text-xs animate-in slide-in-from-left-2 fade-in-0 duration-300">
                  {label}
                </span>
              )}
            </Button>
          )
        })}
      </div> */}

      <div className="animate-in fade-in-0 duration-500 ease-in-out">
        <AssistantChat
          theme={theme}
          messages={internalMessages}
          name={currentTheme.label}
          disabled={currentTheme?.disabled}
          icon={currentTheme.icon({ className: 'size-4 shrink-0' })}
          className={className}
        />
      </div>
    </div>
  )
}
