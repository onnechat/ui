
import { Table } from '@tanstack/react-table'

import { Icon } from '@/components/icon'

import { Button } from '@/components/ui/button'

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

interface CursorPaginationMeta {
  hasNext?: boolean
  hasPrevious?: boolean
  limit?: number
}

interface DataTablePaginationProps<TData> {
  table: Table<TData>
  pageSizeOptions?: number[]
  cursorMeta?: CursorPaginationMeta
  onNavigate?: (direction: 'next' | 'previous') => void
  disablePageSize?: boolean
}

export function DataTablePagination<TData>({
  table,
  pageSizeOptions = [10, 20, 30, 40, 50],
  cursorMeta,
  onNavigate,
  disablePageSize,
}: DataTablePaginationProps<TData>) {

  const isCursorPagination = !!cursorMeta

  const hasNext = cursorMeta?.hasNext ?? table.getCanNextPage()
  const hasPrevious = cursorMeta?.hasPrevious ?? table.getCanPreviousPage()

  const hasRowsSelected = table.getFilteredSelectedRowModel().rows.length > 0

  const handlePrevious = () => {
    if (isCursorPagination && onNavigate) {
      onNavigate('previous')
    } else {
      table.previousPage()
    }
  }

  const handleNext = () => {
    if (isCursorPagination && onNavigate) {
      onNavigate('next')
    } else {
      table.nextPage()
    }
  }

  return (
    <div className="flex gap-4 sm:items-center sm:justify-between">
      {hasRowsSelected && (
        <div className="hidden sm:block text-sm text-muted-foreground">
          {table.getFilteredSelectedRowModel().rows.length} of{' '}
          {table.getFilteredRowModel().rows.length} selected
        </div>
      )}

      <div className="flex items-center space-x-2 w-fit">

        <p className="hidden sm:block text-sm text-muted-foreground text-nowrap">
          Rows per page
        </p>

        <Select
          disabled={disablePageSize}
          value={`${table.getState().pagination.pageSize}`}
          onValueChange={(value) => table.setPageSize(Number(value))}
        >
          <SelectTrigger className="h-10 min-w-[70px]">
            <SelectValue placeholder={table.getState().pagination.pageSize} />
          </SelectTrigger>

          <SelectContent side="top">
            {pageSizeOptions.map((pageSize) => (
              <SelectItem key={pageSize} value={`${pageSize}`}>
                {pageSize}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex flex-col gap-4 w-full sm:w-auto sm:flex-row sm:items-center sm:gap-6 lg:gap-8">
        <div className="flex items-center justify-end space-x-2 w-full sm:w-auto">
          <div className="space-x-2">
            {!isCursorPagination && (
              <Button
                size="icon"
                variant="outline"
                disabled={!hasPrevious}
                onClick={() => table.setPageIndex(0)}
              >
                <span className="sr-only">Go to first page</span>
                <Icon name="ChevronLeftToLine" className="h-4 w-4" />
              </Button>
            )}

            <Button
              size="icon"
              variant="outline"
              onClick={handlePrevious}
              disabled={!hasPrevious}
            >
              <span className="sr-only">Go to previous page</span>
              <Icon name="ChevronLeft" className="h-4 w-4" />
            </Button>
          </div>

          <div className="space-x-2">
            <Button
              size="icon"
              variant="outline"
              onClick={handleNext}
              disabled={!hasNext}
            >
              <span className="sr-only">Go to next page</span>
              <Icon name="ChevronRight" className="h-4 w-4" />
            </Button>

            {!isCursorPagination && (
              <Button
                size="icon"
                variant="outline"
                disabled={!hasNext}
                onClick={() => table.setPageIndex(table.getPageCount() - 1)}
              >
                <span className="sr-only">Go to last page</span>
                <Icon name="ChevronRightToLine" className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
