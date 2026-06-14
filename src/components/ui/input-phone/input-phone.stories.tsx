import type { Meta, StoryObj } from '@storybook/react-vite'
import { PhoneInput } from './index'

const meta: Meta<typeof PhoneInput> = {
  title: 'UI/InputPhone',
  component: PhoneInput,
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
  args: { value: '+5511999999999' },
}

export const Disabled: StoryObj<typeof meta> = {
  args: { disabled: true },
}

export const DisableCountrySelect: StoryObj<typeof meta> = {
  args: { disableCountrySelect: true },
}
