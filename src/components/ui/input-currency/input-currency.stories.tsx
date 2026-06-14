import type { Meta, StoryObj } from '@storybook/react-vite'
import { CurrencyInput } from './index'

const meta: Meta<typeof CurrencyInput> = {
  title: 'UI/InputCurrency',
  component: CurrencyInput,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
}

export default meta

export const Default: StoryObj<typeof meta> = {
  args: {},
}

export const WithValue: StoryObj<typeof meta> = {
  args: { value: 1500 },
}

export const Disabled: StoryObj<typeof meta> = {
  args: { disabled: true },
}

export const WithPlaceholder: StoryObj<typeof meta> = {
  args: { placeholder: '0.00' },
}

export const DisableCurrencySelect: StoryObj<typeof meta> = {
  args: { disableCurrencySelect: true },
}

export const NoCentsMode: StoryObj<typeof meta> = {
  args: { centsMode: false },
}
