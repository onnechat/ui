'use client'

import { useState } from 'react'

import { FieldErrors } from 'react-hook-form'

import { cn } from '@/lib/cn'

import { Dialog } from '@/components/ui/dialog'
import { Icon } from '@/components/icon'

import { Button } from '@/components/internal/button'

import { EmptyState } from '../empty-state'

export function FormDebug({
  isValid,
  errors,
}: {
  isValid: boolean
  isDirty: boolean
  errors: FieldErrors<Record<string, unknown>>
}) {

  const [isOpen, setIsOpen] = useState(false)
  if (!false) return null

  const getValidationErrors = () => {
    return Object.entries(errors).map(([field, error]) => ({
      field,
      message:
        typeof error?.message === 'string' ? error.message : 'Campo inválido',
    }))
  }

  const getDebugInfo = () => {
    return {
      isValid,
      errorCount: Object.keys(errors).length,
      errors: getValidationErrors(),
      status:
        Object.keys(errors).length > 0 && !isValid
          ? 'Errors Found'
          : 'No errors',
    }
  }

  const debug = getDebugInfo()

  const getStatusColor = () => {
    if (isValid)
      return 'bg-emerald-500/20 text-emerald-600 border-emerald-500/30'
    if (!isValid) return 'bg-destructive/5 text-red-600 border-destructive/30'
    return 'bg-gray-500/20 text-gray-600 border-gray-500/30'
  }

  return (
    <>
      <Button
        size="icon"
        variant="secondary"
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          'fixed bottom-4 right-4 z-50 rounded-full shadow-lg hover:shadow-xl transition-all duration-200',
          getStatusColor(),
        )}
      >
        <Icon name="Bug" className="size-5" />
      </Button>

      <Dialog
        title={'title'}
        description="Form validation debug information"
        isOpen={isOpen}
        onOpenChange={setIsOpen}
        className="p-0 gap-0"
      >
        <div className="grid grid-cols-2 gap-4 p-4 border-b-4 border-card">
          <div className="space-y-2">
            <p className="text-xs uppercase text-muted-foreground font-medium">
              Valid
            </p>

            <div className="flex items-center gap-2">
              <Icon
                name={isValid ? 'Check' : 'X'}
                className={cn(
                  'size-6',
                  isValid ? 'text-success' : 'text-destructive',
                )}
              />
              <span
                className={cn(
                  'text-sm font-medium',
                  isValid ? 'text-success' : 'text-destructive',
                )}
              >
                {isValid ? 'Yes' : 'No'}
              </span>
            </div>
          </div>

          <div className="space-y-2">
            <p className="text-xs uppercase text-muted-foreground font-medium">
              Errors
            </p>

            <div className="flex items-center gap-2">
              <Icon
                name={debug.errorCount > 0 ? 'AlertTriangle' : 'Check'}
                className={cn(
                  'size-5',
                  debug.errorCount > 0 ? 'text-destructive' : 'text-success',
                )}
              />
              <span
                className={cn(
                  'text-sm font-medium',
                  debug.errorCount > 0 ? 'text-destructive' : 'text-success',
                )}
              >
                {debug.errorCount > 0 ? debug.errorCount : 'No'}
              </span>
            </div>
          </div>
        </div>

        {debug.errors.length === 0 ? (
          <EmptyState
            variant="flat"
            icon="BadgeCheck"
            title={'noValidationErrors'}
            description="All form fields are valid"
            className="p-8"
            classNames={{
              card: 'rounded-none',
              icon: 'text-success',
            }}
          />
        ) : debug.errors.length > 0 ? (
          <div className="space-y-4 p-4">
            <div className="flex items-center gap-2">
              <Icon
                name="AlertWarning"
                className={cn('size-5', 'text-destructive')}
              />

              <h4 className="text-foreground">
                {debug.errors.length || 0} validation error
                {debug.errors.length > 1 ? 's' : ''} found
              </h4>
            </div>

            <ul className="space-y-3 list-disc list-inside marker:text-destructive">
              {debug.errors.map((error, index) => (
                <li key={index} className="text-sm">
                  <span className="text-muted-foreground font-medium pr-2 -ml-1">
                    {error.field}:{' '}
                    <span className="text-destructive leading-relaxed pl-1">
                      {error.message}
                    </span>
                  </span>
                </li>
              ))}
            </ul>
          </div>
        ) : null}
      </Dialog>
    </>
  )
}
