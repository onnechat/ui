'use client'

import { Component, type ErrorInfo, type ReactNode } from 'react'

type ErrorBoundaryProps = {
  children: ReactNode
  fallback: (args: { error: Error; reset: () => void }) => ReactNode
  onReset?: () => void
}

type ErrorBoundaryState = { error: Error | null }

/**
 * Catches render errors (e.g. from useSuspenseQuery failures) so they can be
 * shown inline instead of crashing the tree. Pair with QueryErrorResetBoundary.
 */
export class ErrorBoundary extends Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  state: ErrorBoundaryState = { error: null }

  static getDerivedStateFromError(error: unknown): ErrorBoundaryState {
    return {
      error: error instanceof Error ? error : new Error(String(error)),
    }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    if (process.env.NODE_ENV === 'development') {
      console.error('ErrorBoundary:', error, info.componentStack)
    }
  }

  reset = () => {
    this.props.onReset?.()
    this.setState({ error: null })
  }

  render() {
    if (this.state.error) {
      return this.props.fallback({
        error: this.state.error,
        reset: this.reset,
      })
    }

    return this.props.children
  }
}
