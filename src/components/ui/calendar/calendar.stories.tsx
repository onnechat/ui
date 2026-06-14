import * as React from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { Calendar } from './calendar'

const meta: Meta<typeof Calendar> = {
  title: 'UI/Calendar',
  component: Calendar,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
}

export default meta

export const Default: StoryObj = {
  render: () => <Calendar mode="single" />,
}

export const WithSelected: StoryObj = {
  render: () => (
    <Calendar
      mode="single"
      selected={new Date(2024, 5, 15)}
      defaultMonth={new Date(2024, 5)}
    />
  ),
}

export const WithRange: StoryObj = {
  render: () => (
    <Calendar
      mode="range"
      selected={{
        from: new Date(2024, 5, 10),
        to: new Date(2024, 5, 20),
      }}
      defaultMonth={new Date(2024, 5)}
    />
  ),
}

export const MultipleMonths: StoryObj = {
  render: () => (
    <Calendar
      mode="single"
      numberOfMonths={2}
      defaultMonth={new Date(2024, 5)}
    />
  ),
}

export const DisabledPast: StoryObj = {
  render: () => {
    const today = new Date()
    return (
      <Calendar
        mode="single"
        disabled={{ before: today }}
        defaultMonth={today}
      />
    )
  },
}
