import * as React from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { SelectInfiniteScroll } from './select-infinite-scroll'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      staleTime: Infinity,
    },
  },
})

type Item = { id: string; label: string; category: string }

const ITEMS: Item[] = [
  { id: '1', label: 'Apple', category: 'Fruit' },
  { id: '2', label: 'Banana', category: 'Fruit' },
  { id: '3', label: 'Cherry', category: 'Fruit' },
  { id: '4', label: 'Carrot', category: 'Vegetable' },
  { id: '5', label: 'Broccoli', category: 'Vegetable' },
  { id: '6', label: 'Spinach', category: 'Vegetable' },
  { id: '7', label: 'Chicken', category: 'Meat' },
  { id: '8', label: 'Beef', category: 'Meat' },
  { id: '9', label: 'Salmon', category: 'Fish' },
  { id: '10', label: 'Tuna', category: 'Fish' },
]

const queryFn = async ({ search }: { search: string }) => {
  await new Promise((r) => setTimeout(r, 500))
  if (!search) return ITEMS
  const q = search.toLowerCase()
  return ITEMS.filter((i) => i.label.toLowerCase().includes(q))
}

const meta: Meta<typeof SelectInfiniteScroll> = {
  title: 'UI/SelectInfiniteScroll',
  component: SelectInfiniteScroll,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <QueryClientProvider client={queryClient}>
        <Story />
      </QueryClientProvider>
    ),
  ],
}

export default meta

export const Default: StoryObj<typeof meta> = {
  render: () => {
    const [value, setValue] = React.useState('')
    return (
      <SelectInfiniteScroll
        value={value}
        onValueChange={setValue}
        queryKey={['select-demo']}
        queryFn={queryFn}
        getItemValue={(item) => item.id}
        renderItem={(item) => <span>{item.label}</span>}
        placeholder="Select an item…"
        className="w-56"
      />
    )
  },
}

export const WithSearch: StoryObj<typeof meta> = {
  render: () => {
    const [value, setValue] = React.useState('')
    return (
      <SelectInfiniteScroll
        search
        value={value}
        onValueChange={setValue}
        queryKey={['search-demo']}
        queryFn={queryFn}
        getItemValue={(item) => item.id}
        renderItem={(item) => <span>{item.label}</span>}
        placeholder="Search and select…"
        searchPlaceholder="Type to filter…"
        className="w-56"
      />
    )
  },
}

export const Preselected: StoryObj<typeof meta> = {
  render: () => {
    const [value, setValue] = React.useState('3')
    return (
      <SelectInfiniteScroll
        value={value}
        onValueChange={setValue}
        queryKey={['preselected-demo']}
        queryFn={queryFn}
        getItemValue={(item) => item.id}
        renderItem={(item) => <span>{item.label}</span>}
        placeholder="Select an item…"
        className="w-56"
      />
    )
  },
}

export const CustomItemRender: StoryObj<typeof meta> = {
  render: () => {
    const [value, setValue] = React.useState('')
    return (
      <SelectInfiniteScroll
        value={value}
        onValueChange={setValue}
        queryKey={['render-demo']}
        queryFn={queryFn}
        getItemValue={(item) => item.id}
        renderItem={(item, isSelected) => (
          <div className="flex flex-col gap-0.5">
            <span className={isSelected ? 'font-semibold' : ''}>
              {item.label}
            </span>
            <span className="text-xs text-muted-foreground">
              {item.category}
            </span>
          </div>
        )}
        placeholder="Select an item…"
        className="w-56"
      />
    )
  },
}

export const Disabled: StoryObj<typeof meta> = {
  render: () => {
    const [value, setValue] = React.useState('1')
    return (
      <SelectInfiniteScroll
        disabled
        value={value}
        onValueChange={setValue}
        queryKey={['disabled-demo']}
        queryFn={queryFn}
        getItemValue={(item) => item.id}
        renderItem={(item) => <span>{item.label}</span>}
        placeholder="Disabled…"
        className="w-56"
      />
    )
  },
}
