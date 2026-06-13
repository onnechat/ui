'use client'

import { useCallback, useEffect, useRef, useState } from 'react'

import { toast } from 'sonner'

import { cn } from '@/lib/cn'

import { EmptyState } from '@/components/ui/empty-state'
import { Icon } from '@/components/icon'

import { Button } from '@/components/internal/button'
import { Label } from '@/components/internal/label'

const ACCEPTED_TYPES = ['image/jpeg', 'image/png', 'image/webp']

const MAX_SIZE_MB = 5
const MAX_SIZE_BYTES = MAX_SIZE_MB * 1024 * 1024

export interface ImageUploadProps {
  value: File | string | null
  onChange: (file: File | null) => void
  label?: string
  disabled?: boolean
  className?: string
  previewClassName?: string
  id?: string
}

const ImageUpload = ({
  value,
  onChange,
  label,
  disabled,
  className,
  previewClassName,
  id = 'image-upload',
}: ImageUploadProps) => {

  const inputRef = useRef<HTMLInputElement>(null)
  const dragCounter = useRef(0)

  const [isDragging, setIsDragging] = useState(false)
  const [preview, setPreview] = useState<string | null>(null)

  useEffect(() => {
    if (!value) {
      setPreview(null)
      return
    }

    if (typeof value === 'string') {
      setPreview(value)
      return
    }

    const url = URL.createObjectURL(value)
    setPreview(url)
    return () => URL.revokeObjectURL(url)
  }, [value])

  const validate = useCallback(
    (file: File): boolean => {
      if (!ACCEPTED_TYPES.includes(file.type)) {
        toast.error('errors.invalidType')
        return false
      }
      if (file.size > MAX_SIZE_BYTES) {
        toast.error('errors.tooLarge', { max: MAX_SIZE_MB })
        return false
      }
      return true
    },
    [],
  )

  const handleFile = useCallback(
    (file: File | undefined | null) => {
      if (!file) return
      if (validate(file)) onChange(file)
    },
    [validate, onChange],
  )

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleFile(e.target.files?.[0])
    e.target.value = ''
  }

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault()
    dragCounter.current += 1
    if (!disabled) setIsDragging(true)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    dragCounter.current -= 1
    if (dragCounter.current === 0) setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    dragCounter.current = 0
    setIsDragging(false)

    if (disabled) return
    handleFile(e.dataTransfer.files?.[0])
  }

  const handlePaste = useCallback(
    (e: ClipboardEvent) => {
      if (disabled) return

      const item = Array.from(e.clipboardData?.items ?? []).find((i) =>
        i.type.startsWith('image/'),
      )

      if (item) {
        handleFile(item.getAsFile())
      }
    },
    [disabled, handleFile],
  )

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation()
    onChange(null)
    if (inputRef.current) inputRef.current.value = ''
  }

  useEffect(() => {
    window.addEventListener('paste', handlePaste)
    return () => window.removeEventListener('paste', handlePaste)
  }, [handlePaste])

  return (
    <div className={cn('space-y-3', className)}>
      {label && <Label htmlFor={id}>{label}</Label>}

      <div
        id={id}
        role="button"
        tabIndex={disabled ? -1 : 0}
        aria-label={'aria.dropzone'}
        onDragEnter={handleDragEnter}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => !disabled && inputRef.current?.click()}
        onKeyDown={(e) => {
          if (!disabled && (e.key === 'Enter' || e.key === ' ')) {
            inputRef.current?.click()
          }
        }}
        data-file={!!preview}
        className={cn(
          'relative flex flex-col items-center justify-center gap-2 w-full rounded-xl border-3 border-dashed transition-colors cursor-pointer select-none',
          'outline-none focus-visible:border-transparent focus-visible:ring-ring/50 focus-visible:ring-[3px]',
          'aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive',
          isDragging
            ? 'border-(--success-drop) bg-(--success-drop)/5'
            : 'border-transparent bg-input',
          disabled && 'opacity-50 cursor-not-allowed pointer-events-none',
          preview ? 'p-0 overflow-hidden border-0' : 'min-h-48',
          previewClassName,
        )}
        style={
          {
            '--success-drop': 'var(--success)',
            '--success-drop-foreground': 'var(--success-foreground)',
          } as React.CSSProperties
        }
      >
        {preview ? (
          <div className="relative w-full">
            <img
              src={preview}
              alt={'aria.preview'}
              className="size-full object-cover rounded-xl max-h-auto"
            />

            {!disabled && (
              <Button
                size="icon"
                type="button"
                variant="destructive"
                className="absolute top-2 right-2 size-6 rounded-full"
                onClick={handleRemove}
                aria-label={'aria.remove'}
              >
                <Icon name="Xmark" className="size-4" />
              </Button>
            )}
          </div>
        ) : (
          <EmptyState
            variant="flat"
            icon={isDragging ? 'Upload' : 'Image'}
            title={isDragging ? 'dropNow' : 'clickOrDrag'}
            description={'hint'}
            classNames={{
              card: 'bg-transparent',
              content: 'p-6',
              title: 'text-sm',
              description: 'text-xs',
              icon: cn(
                isDragging ? 'text-(--success-drop)' : 'text-muted-foreground',
              ),
            }}
          />
        )}
      </div>

      <input
        type="file"
        aria-hidden
        ref={inputRef}
        tabIndex={-1}
        className="sr-only"
        disabled={disabled}
        onChange={handleInputChange}
        accept={ACCEPTED_TYPES.join(',')}
      />
    </div>
  )
}

ImageUpload.displayName = 'ImageUpload'

export { ImageUpload }
