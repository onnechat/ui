import * as React from 'react'

import { mergeProps } from '@base-ui/react/merge-props'

type AnyProps = Record<string, unknown>

function composeRefs<T>(
  ...refs: Array<React.Ref<T> | null | undefined>
): React.RefCallback<T> {
  return (node) => {
    for (const ref of refs) {
      if (typeof ref === 'function') {
        ref(node)
      } else if (ref != null) {
        const mutableRef = ref as React.MutableRefObject<T | null>
        mutableRef.current = node
      }
    }
  }
}

/**
 * Merges its props into its single child element (Radix `Slot` replacement),
 * composing event handlers, `className`, `style` and refs.
 */
const Slot = React.forwardRef<HTMLElement, React.HTMLAttributes<HTMLElement>>(
  function Slot({ children, ...slotProps }, forwardedRef) {
    if (!React.isValidElement(children)) return null

    const childProps = children.props as AnyProps
    const childRef = (children as unknown as { ref?: React.Ref<HTMLElement> })
      .ref

    return React.cloneElement(children, {
      ...mergeProps(slotProps as AnyProps, childProps),
      ref: composeRefs(forwardedRef, childRef),
    } as AnyProps)
  },
)

export { composeRefs, Slot }
