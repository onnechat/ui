import { z } from 'zod'

export function createSchemas(
  _tSchema: (key: string, params?: Record<string, unknown>) => string,
) {
  return {
    REGISTER: z.object({
      firstName: z.string(),
      lastName: z.string(),
      email: z.string().email(),
      phone: z.string(),
      password: z.string().min(8),
    }),
  }
}
