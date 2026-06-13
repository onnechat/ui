import { useState } from 'react'
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  type ColumnDef,
  type RowSelectionState,
  type Table,
} from '@tanstack/react-table'

interface UseDataTableProps<TData> {
  data: TData[]
  columns: ColumnDef<TData>[]
  rowCount?: number
  onPaginationChange?: (limit: number, cursor: string | null, direction: 'next' | 'previous') => void
  defaultPerPage?: number
  hasNextPage?: boolean
  hasPreviousPage?: boolean
  nextCursor?: string | null
  previousCursor?: string | null
  rowSelection?: Record<string, boolean>
  onRowSelectionChange?: (rowSelection: Record<string, boolean>) => void
}

export function useDataTable<TData>({
  data,
  columns,
  onPaginationChange,
  hasNextPage = false,
  hasPreviousPage = false,
  nextCursor: _nextCursor,
  previousCursor: _previousCursor,
  rowSelection,
  onRowSelectionChange,
  defaultPerPage = 10,
}: UseDataTableProps<TData>) {
  const [innerRowSelection, setInnerRowSelection] = useState<RowSelectionState>({})

  const selection = rowSelection ?? innerRowSelection
  const isManual = !!onPaginationChange

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: isManual ? undefined : getPaginationRowModel(),
    onRowSelectionChange: onRowSelectionChange ?? setInnerRowSelection,
    state: {
      rowSelection: selection,
    },
    manualPagination: isManual,
    initialState: {
      pagination: { pageSize: defaultPerPage },
    },
  })

  const goToNextPage = () => {
    onPaginationChange?.(0, null, 'next')
  }

  const goToPreviousPage = () => {
    onPaginationChange?.(0, null, 'previous')
  }

  return {
    table: table as unknown as Table<Record<string, unknown>>,
    goToNextPage,
    goToPreviousPage,
    hasNextPage,
    hasPreviousPage,
  }
}
