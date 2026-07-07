import { Column } from '@tanstack/react-table'

import { cn } from '@/lib/cn'

import { Icon } from '@/components/icon'

import { Button } from '@/components/ui/button'
import { DropdownMenu } from '@/components/ui/dropdown-menu'

interface DataTableColumnHeaderProps<
  TData,
  TValue,
> extends React.HTMLAttributes<HTMLDivElement> {
  column: Column<TData, TValue>
  title: string
}

export function DataTableColumnHeader<TData, TValue>({
  column,
  title,
  className,
}: DataTableColumnHeaderProps<TData, TValue>) {
  if (!column.getCanSort()) {
    return <div className={cn(className)}>{title}</div>
  }

  return (
    <div className={cn('flex items-center space-x-2', className)}>
      <DropdownMenu>
        <DropdownMenu.Trigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className="-ml-3 h-8 data-[state=open]:bg-accent"
          >
            <span>{title}</span>
            {column.getIsSorted() === 'desc' ? (
              <Icon name="ArrowDown" className="ml-2 h-4 w-4" />
            ) : column.getIsSorted() === 'asc' ? (
              <Icon name="ArrowUp" className="ml-2 h-4 w-4" />
            ) : (
              <Icon name="SortArrows" className="ml-2 h-4 w-4" />
            )}
          </Button>
        </DropdownMenu.Trigger>

        <DropdownMenu.Content align="start">
          <DropdownMenu.Item onClick={() => column.toggleSorting(false)}>
            <Icon
              name="ArrowUp"
              className="mr-2 h-3.5 w-3.5 text-muted-foreground/70"
            />
            Asc
          </DropdownMenu.Item>
          <DropdownMenu.Item onClick={() => column.toggleSorting(true)}>
            <Icon
              name="ArrowDown"
              className="mr-2 h-3.5 w-3.5 text-muted-foreground/70"
            />
            Desc
          </DropdownMenu.Item>
          <DropdownMenu.Separator />
          <DropdownMenu.Item onClick={() => column.toggleVisibility(false)}>
            <Icon
              name="EyeSlash"
              className="mr-2 h-3.5 w-3.5 text-muted-foreground/70"
            />
            Hide
          </DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu>
    </div>
  )
}
