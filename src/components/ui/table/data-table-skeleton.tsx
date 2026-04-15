import { cn } from '@/lib/cn'

import {
  type DataCustomTableVariant,
  DEFAULT_DATA_CUSTOM_TABLE_VARIANT,
} from '@/components/data-custom-table'

import { Skeleton } from '@/components/ui/skeleton'

export const DataTableSkeleton = ({
  columnCount = 3,
  rowCount = 10,
  variant = DEFAULT_DATA_CUSTOM_TABLE_VARIANT,
}: {
  columnCount?: number
  rowCount?: number
  variant?: DataCustomTableVariant
}) => {
  const grid = `repeat(${columnCount}, 1fr)`

  const classes = {
    cells: 'p-0! pb-2! pr-2! last:pr-0! h-16',
    header: `w-full grid pointer-events-none`,
    body: `w-full grid pointer-events-none`,
    skeleton: 'h-full w-full',
  }

  return (
    <div
      suppressHydrationWarning
      className={cn(
        'w-full overflow-hidden',
        variant === 'inset' ? 'space-y-6' : 'space-y-2',
      )}
    >
      <div className="rounded-xl">
        <div className="flex flex-col gap-2 rounded-xl min-h-80 overflow-hidden">
          {Array.from({ length: 1 }).map((_, i) => (
            <ul
              key={i}
              className={classes.header}
              style={{ gridTemplateColumns: grid }}
            >
              {Array.from({ length: columnCount }).map((_, i) => (
                <li key={i} className={classes.cells}>
                  <Skeleton className={classes.skeleton} />
                </li>
              ))}
            </ul>
          ))}

          {Array.from({ length: rowCount }).map((_, i) => (
            <ul
              key={i}
              className={classes.body}
              style={{ gridTemplateColumns: grid }}
            >
              {Array.from({ length: columnCount }).map((_, i) => (
                <li key={i} className={classes.cells}>
                  <Skeleton className={classes.skeleton} />
                </li>
              ))}
            </ul>
          ))}
        </div>
      </div>
    </div>
  )
}
