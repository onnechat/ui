import * as React from 'react'

type SlotProps = React.HTMLAttributes<HTMLElement> & {
  children?: React.ReactNode
}

const Slot = React.forwardRef<HTMLElement, SlotProps>(
  ({ children, ...props }, ref) => {
    if (!React.isValidElement(children)) {
      return null
    }

    return React.cloneElement(children, {
      ...props,
      ...(children.props as Record<string, unknown>),
      ref: mergeRefs(
        ref,
        (children as React.ReactElement & { ref?: React.Ref<unknown> }).ref,
      ),
    })
  },
)

function mergeRefs<T>(
  ...refs: (React.Ref<T> | undefined)[]
): React.RefCallback<T> {
  return (value) => {
    refs.forEach((ref) => {
      if (typeof ref === 'function') {
        ref(value)
      } else if (ref != null) {
        ;(ref as React.MutableRefObject<T | null>).current = value
      }
    })
  }
}

Slot.displayName = 'Slot'

export { Slot }
