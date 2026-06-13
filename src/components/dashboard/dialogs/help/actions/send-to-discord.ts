'use server'

import { env } from '@/lib/env'

import { discordService } from '@/services/discord.service'

import { FeedbackType } from '../help.dialog'

interface FeedbackData {
  user: { id?: string; name?: string; email?: string }
  workspace: { id?: string; name?: string; slug?: string }
  environment: {
    pathname: string
    hostname: string
    url: string
    timestamp: string
    timezone: string
    userAgent: string
    language: string
    platform: string
    cookieEnabled: boolean
    onLine: boolean
    screenResolution: string
    viewportSize: string
  }
  app: { version: string }
  browser: { name: string; version: string }
  os: { name: string; version: string }
}

const uploadToDiscord = async ({
  type,
  data,
  message,
}: {
  type: FeedbackType
  data: FeedbackData
  message: string
}) => {
  const getWebhookUrl = () => {
    switch (type) {
      case 'question':
        return {
          color: '#5865F2',
          title: 'Pergunta',
          url: env.services.discord.webhook.question,
        }
      case 'feedback':
        return {
          color: '#57F287',
          title: 'Feedback',
          url: env.services.discord.webhook.feedback,
        }
      case 'bug':
        return {
          color: '#ED4245',
          title: 'Problema Reportado',
          url: env.services.discord.webhook.bug,
        }
    }
  }

  const { url, color, title } = getWebhookUrl()

  if (!url) {
    throw new Error('Discord webhook URL não encontrado.')
  }

  if (!url.includes('discord.com/api/webhooks')) {
    throw new Error(
      'URL do webhook inválida. Deve ser uma URL válida do Discord.',
    )
  }

  const components = [
    ...(type === 'bug'
      ? [
          {
            type: 1,
            components: [
              {
                type: 2,
                style: 5,
                label: 'Origin URL',
                url: data.environment.url,
              },
            ],
          },
        ]
      : []),
  ]

  return await discordService.sendToDiscord({
    webhookUrl: url,
    embed: {
      color,
      title,
      fields: [
        {
          name: 'Mensagem',
          value: message,
        },
        {
          name: '',
          value: '',
        },
        {
          name: 'Reported by',
          value: '',
        },
        {
          name: 'User',
          value: [
            `Name: ${data.user.name}`,
            `Email: ${data.user.email}`,
            `ID: ${data.user.id}`,
          ].join('\n'),
        },
        {
          name: 'Workspace',
          value: [
            `Name: ${data.workspace.name}`,
            `Slug: ${data.workspace.slug}`,
          ].join('\n'),
        },
        {
          name: '',
          value: '',
        },
        {
          name: 'Debug',
          value: '',
        },
        {
          name: 'Device',
          value: [
            `OS: ${data.os.name} ${data.os.version}`,
            `Browser: ${data.browser.name} ${data.browser.version}`,
          ].join('\n'),
        },
        {
          name: 'Screen',
          value: [
            `Resolution: ${data.environment.screenResolution}`,
            `Viewport: ${data.environment.viewportSize}`,
          ].join('\n'),
        },
        {
          name: 'Environment',
          value: [
            `Pathname: ${data.environment.pathname}`,
            `Hostname: ${data.environment.hostname}`,
          ].join('\n'),
        },
      ],
    },
    components,
  })
}

export { uploadToDiscord }
