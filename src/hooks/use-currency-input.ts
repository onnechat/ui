export type Currency = {
  code: string
  symbol: string
}

export const useCurrencyInput = (_props: Record<string, unknown>) => ({
  displayValue: '',
  selectedCurrency: { code: 'BRL', symbol: 'R$' } as Currency,
  currencies: [] as Currency[],
  handleCurrencyChange: (_code: string) => {},
  handleAmountChange: (_e: React.ChangeEvent<HTMLInputElement>) => {},
  handleFocus: (_e: React.FocusEvent<HTMLInputElement>) => {},
  handleBlur: (_e: React.FocusEvent<HTMLInputElement>) => {},
})
