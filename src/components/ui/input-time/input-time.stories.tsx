import type { Meta, StoryObj } from '@storybook/react-vite'
import { InputTime } from './input-time'

const meta: Meta<typeof InputTime> = {
  title: 'UI/InputTime',
  component: InputTime,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    type: {
      control: 'select',
      options: ['date', 'time', 'datetime-local'],
    },
    defaultType: {
      control: 'select',
      options: ['date', 'time', 'datetime-local'],
    },
    align: {
      control: 'select',
      options: ['start', 'center', 'end'],
    },
    onChange: { control: false },
    onTypeChange: { control: false },
  },
}

export default meta

export const Default: StoryObj<typeof meta> = {
  args: {},
}

export const Date: StoryObj<typeof meta> = {
  args: { type: 'date' },
}

export const Time: StoryObj<typeof meta> = {
  args: { type: 'time' },
}

export const DateTimeLocal: StoryObj<typeof meta> = {
  args: { type: 'datetime-local' },
}

export const WithValue: StoryObj<typeof meta> = {
  args: { type: 'date', defaultValue: '2026-06-14' },
}
