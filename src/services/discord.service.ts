export const discordService = {
  sendToDiscord: async (_params: {
    webhookUrl: string
    embed: { color: string; title: string; fields: Array<{ name: string; value: string }> }
    components: unknown[]
  }) => ({ ok: true }),
}
