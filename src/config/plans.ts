export interface Plan {
  id: string
  name: string
  price?: { note?: Record<string, string> }
  disabled?: boolean
  taglineKey: string
  features: Array<{ countKey?: string; translationKey: string; omitWhenZero?: boolean }>
}

export const plans: Plan[] = []

export function getPreviousPlan(index: number): Plan | undefined {
  return plans[index - 1]
}
