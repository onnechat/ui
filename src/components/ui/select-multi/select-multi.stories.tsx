import * as React from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { SelectMulti } from './select-multi'

type Item = { id: string; label: string; group: string }

const OPTIONS: Item[] = [
  { id: '1', label: 'Apple', group: 'Fruits' },
  { id: '2', label: 'Banana', group: 'Fruits' },
  { id: '3', label: 'Cherry', group: 'Fruits' },
  { id: '4', label: 'Carrot', group: 'Vegetables' },
  { id: '5', label: 'Broccoli', group: 'Vegetables' },
  { id: '6', label: 'Spinach', group: 'Vegetables' },
  { id: '7', label: 'Chicken', group: 'Meat' },
  { id: '8', label: 'Beef', group: 'Meat' },
  { id: '9', label: 'Salmon', group: 'Fish' },
  { id: '10', label: 'Tuna', group: 'Fish' },
]

const meta: Meta<typeof SelectMulti> = {
  title: 'UI/SelectMulti',
  component: SelectMulti,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
}

export default meta

export const Default: StoryObj<typeof meta> = {
  render: () => {
    const [values, setValues] = React.useState<string[]>([])
    return (
      <SelectMulti
        values={values}
        onValuesChange={setValues}
        options={OPTIONS}
        getItemValue={(item) => item.id}
        renderItem={(item) => <span>{item.label}</span>}
        getBadgeLabel={(item) => item.label}
        placeholder="Select items…"
        className="w-56"
      />
    )
  },
}

export const Preselected: StoryObj<typeof meta> = {
  render: () => {
    const [values, setValues] = React.useState<string[]>(['1', '3', '5'])
    return (
      <SelectMulti
        values={values}
        onValuesChange={setValues}
        options={OPTIONS}
        getItemValue={(item) => item.id}
        renderItem={(item) => <span>{item.label}</span>}
        getBadgeLabel={(item) => item.label}
        placeholder="Select items…"
        className="w-56"
      />
    )
  },
}

export const ManySelected: StoryObj<typeof meta> = {
  render: () => {
    const [values, setValues] = React.useState<string[]>([
      '1', '2', '4', '5', '7', '8', '9',
    ])
    return (
      <SelectMulti
        values={values}
        onValuesChange={setValues}
        options={OPTIONS}
        getItemValue={(item) => item.id}
        renderItem={(item) => <span>{item.label}</span>}
        getBadgeLabel={(item) => item.label}
        placeholder="Select items…"
        className="w-56"
      />
    )
  },
}

export const WithCustomFilter: StoryObj<typeof meta> = {
  render: () => {
    const [values, setValues] = React.useState<string[]>([])
    return (
      <SelectMulti
        values={values}
        onValuesChange={setValues}
        options={OPTIONS}
        getItemValue={(item) => item.id}
        renderItem={(item) => (
          <div className="flex flex-col gap-0.5">
            <span>{item.label}</span>
            <span className="text-xs text-muted-foreground">{item.group}</span>
          </div>
        )}
        getBadgeLabel={(item) => item.label}
        filterFn={(item, search) =>
          item.label.toLowerCase().includes(search) ||
          item.group.toLowerCase().includes(search)
        }
        placeholder="Search by name or group…"
        searchPlaceholder="Apples, Vegetables…"
        className="w-56"
      />
    )
  },
}

export const CustomBadgeLabel: StoryObj<typeof meta> = {
  render: () => {
    const [values, setValues] = React.useState<string[]>(['1', '4'])
    return (
      <SelectMulti
        values={values}
        onValuesChange={setValues}
        options={OPTIONS}
        getItemValue={(item) => item.id}
        renderItem={(item) => <span>{item.label}</span>}
        getBadgeLabel={(item) => `${item.label} (${item.group})`}
        placeholder="Select items…"
        className="w-64"
      />
    )
  },
}

export const Disabled: StoryObj<typeof meta> = {
  render: () => {
    const [values, setValues] = React.useState<string[]>(['1', '4'])
    return (
      <SelectMulti
        disabled
        values={values}
        onValuesChange={setValues}
        options={OPTIONS}
        getItemValue={(item) => item.id}
        renderItem={(item) => <span>{item.label}</span>}
        getBadgeLabel={(item) => item.label}
        placeholder="Disabled…"
        className="w-56"
      />
    )
  },
}
