'use client'

import { Table } from '@tanstack/react-table'

import { Icon } from '@/components/icon'

import { Button } from '@/components/internal/button'
import { DataTableViewOptions } from '@/components/internal/table/data-table-view-options'

interface DataTableToolbarProps<TData> {
  table: Table<TData>
  show?: {
    reset: boolean
    view: boolean
  }
  children?: React.ReactNode
}

export function DataTableToolbar<TData>({
  table,
  show = {
    reset: true,
    view: false,
  },
  children,
}: DataTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0

  if ((!show.reset && !isFiltered) || !show.view) {
    return null
  }

  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-1 items-center space-x-2">
        {children}

        {show.reset && isFiltered && (
          <Button
            variant="ghost"
            onClick={() => table.resetColumnFilters()}
            className="h-8 px-2 lg:px-3"
          >
            Reset
            <Icon name="Xmark" className="ml-2 h-4 w-4" />
          </Button>
        )}
      </div>

      {show.view && <DataTableViewOptions table={table} />}
    </div>
  )
}
