'use client'

import { Fragment, type ReactNode } from 'react'

import { cn } from '@/lib/cn'

import type { IconType } from '@/components/icon'
import { Icon } from '@/components/icon'

function isMac(): boolean {
  return (
    typeof navigator !== 'undefined' &&
    /Mac|iPhone|iPad/i.test(navigator.userAgent)
  )
}

export type KbdKey =
  | 'ArrowUp'
  | 'ArrowDown'
  | 'ArrowLeft'
  | 'ArrowRight'
  | 'Enter'
  | 'Escape'
  | 'Tab'
  | 'Backspace'
  | 'Delete'
  | 'Space'
  | 'Mod'
  | 'Command'
  | 'Meta'
  | 'Super'
  | 'Control'
  | 'Ctrl'
  | 'Shift'
  | 'Alt'
  | 'Option'
  | 'F1'
  | 'F2'
  | 'F3'
  | 'F4'
  | 'F5'
  | 'F6'
  | 'F7'
  | 'F8'
  | 'F9'
  | 'F10'
  | 'F11'
  | 'F12'
  | (string & {})

const arrowIconMap: Record<string, IconType> = {
  arrowup: 'ArrowUp',
  arrowdown: 'ArrowDown',
  arrowleft: 'ArrowLeft',
  arrowright: 'ArrowRight',
}

const modifierMacMap: Record<string, string> = {
  mod: '⌘',
  command: '⌘',
  meta: '⌘',
  super: '⌘',
  control: '⌃',
  ctrl: '⌃',
  shift: '⇧',
  alt: '⌥',
  option: '⌥',
}

const modifierWinMap: Record<string, string> = {
  mod: 'Ctrl',
  command: 'Ctrl',
  meta: 'Meta',
  super: 'Win',
  control: 'Ctrl',
  ctrl: 'Ctrl',
  shift: 'Shift',
  alt: 'Alt',
  option: 'Alt',
}

function resolveKeyText(key: string): string | null {
  const lower = key.toLowerCase()

  if (lower in arrowIconMap) return null

  const modifierMap = isMac() ? modifierMacMap : modifierWinMap
  if (lower in modifierMap) return modifierMap[lower]

  if (lower === 'escape') return 'Esc'
  if (lower === 'backspace') return 'Back'
  if (lower === 'delete') return 'Del'
  if (lower === 'space') return 'Space'
  if (lower === 'tab') return 'Tab'
  if (lower === 'enter') return 'Enter'
  if (/^f\d{1,2}$/.test(lower)) return key

  return key
}

function resolveKeyIcon(key: string): IconType | null {
  const lower = key.toLowerCase()
  return arrowIconMap[lower] ?? null
}

export type KbdProps = {
  keys: KbdKey[]
  className?: string
  kbdClassName?: string
  separator?: ReactNode
}

export function Kbd({
  keys,
  className,
  kbdClassName,
  separator = <> + </>,
}: KbdProps) {
  if (keys.length === 0) return null

  return (
    <span
      className={cn(
        'pointer-events-none shrink-0 select-none inline-flex items-center gap-1',
        className,
      )}
    >
      {keys.map((key, i) => {
        const icon = resolveKeyIcon(key)
        const text = resolveKeyText(key)

        return (
          <Fragment key={key}>
            {i > 0 ? separator : null}
            <kbd className={cn('font-sans', kbdClassName)}>
              {icon ? <Icon name={icon} className="size-3" /> : (text ?? key)}
            </kbd>
          </Fragment>
        )
      })}
    </span>
  )
}
