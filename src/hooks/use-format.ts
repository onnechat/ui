export function useFormat() {
  return {
    currency: (value: number, _options?: Record<string, unknown>) =>
      value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }),
  }
}
