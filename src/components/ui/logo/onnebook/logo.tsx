import { cn } from '@/lib/cn'

const Icon = ({
  classNames,
}: {
  classNames?: {
    icon?: {
      container?: string
      path?: string
    }
  }
}) => {
  return (
    <svg
      viewBox="0 0 374.96 486"
      xmlns="http://www.w3.org/2000/svg"
      className={cn(
        'w-7 h-8 shrink-0 text-primary',
        classNames?.icon?.container,
      )}
    >
      <path
        fill="currentColor"
        className={cn('text-primary-foreground', classNames?.icon?.path)}
        d="M112.16,18v74.81M262.81,18v74.81M18,167.61h338.96M243.97,251.77v58.44M130.99,251.77v58.44M55.66,55.4h263.64c20.8,0,37.66,16.75,37.66,37.4v261.82c0,20.66-16.86,37.4-37.66,37.4H117.36s-.02,0-.03,0l-99.27,75.91s-.07,0-.07-.03c.03-35.07,0-92.65,0-113.29V92.81c0-20.66,16.86-37.4,37.66-37.4Z"
      />

      <path
        fill="currentColor"
        className={cn('text-primary', classNames?.icon?.path)}
        d="M18,486c-3.95,0-7.93-1.3-11.27-3.96C2.37,478.57,0,473.18,0,467.61c.02-25.51.01-62.77,0-89.11v-23.87s0-261.82,0-261.82c0-30.55,24.97-55.4,55.66-55.4h38.45s.04-.02.04-.04v-18.89c0-9.78,7.61-18.13,17.38-18.46s18.62,7.84,18.62,17.99v19.36s.02.04.04.04h114.56s.04-.02.04-.04v-18.89c0-9.78,7.61-18.14,17.38-18.46,10.22-.34,18.62,7.84,18.62,17.99v19.36s.02.04.04.04h38.45c30.69,0,55.66,24.85,55.66,55.4v261.82c0,30.55-24.97,55.4-55.66,55.4H123.45s-.02,0-.03,0l-94.49,72.26c-3.2,2.45-7.06,3.7-10.94,3.7ZM36.04,185.61s-.04.02-.04.04v192.83c.01,15.44.02,34.62.01,52.99,0,.04.04.06.07.03l70.33-53.78c3.14-2.4,6.98-3.7,10.93-3.7h201.95c10.84,0,19.66-8.7,19.66-19.4v-168.97s-.02-.04-.04-.04H36.04ZM36.04,149.61h302.88s.04-.02.04-.04v-56.76c0-10.7-8.82-19.4-19.66-19.4h-38.45s-.04.02-.04.04v18.89c0,9.78-7.61,18.14-17.38,18.46s-18.62-7.84-18.62-17.99v-19.36s-.02-.04-.04-.04h-114.56s-.04.02-.04.04v18.89c0,9.78-7.61,18.13-17.38,18.46s-18.62-7.84-18.62-17.99v-19.36s-.02-.04-.04-.04h-38.45c-10.84,0-19.66,8.7-19.66,19.4v56.76s.02.04.04.04ZM243.36,328.2c-9.78-.33-17.38-8.68-17.38-18.46v-57.5c0-9.78,7.61-18.14,17.38-18.46,10.22-.34,18.62,7.84,18.62,17.99v58.44c0,10.15-8.39,18.33-18.62,17.99ZM130.37,328.2c-9.78-.33-17.38-8.68-17.38-18.46v-57.5c0-9.78,7.61-18.13,17.38-18.46s18.62,7.84,18.62,17.99v58.44c0,10.15-8.39,18.33-18.62,17.99Z"
      />
    </svg>
  )
}

const Text = ({ className, name }: { className?: string; name: string }) => (
  <span className={cn('text-xl text-title', className)}>{name}</span>
)

export const OnnebookLogo = ({
  variant = 'default',
  classNames,
  className,
  style,
}: {
  variant?: 'default' | 'icon' | 'text'
  name?: string
  className?: string
  classNames?: {
    icon?: {
      container?: string
      path?: string
    }
    text?: string
  }
  style?: React.CSSProperties
}) => {
  const name = 'OnneBook'

  return (
    <div
      style={style}
      className={cn('relative flex items-center gap-2 w-fit', className)}
    >
      {variant === 'icon' ? (
        <Icon classNames={classNames} />
      ) : variant === 'text' ? (
        <Text className={classNames?.text} name={name} />
      ) : (
        <>
          <Icon classNames={classNames} />
          <Text className={classNames?.text} name={name} />
        </>
      )}
    </div>
  )
}
