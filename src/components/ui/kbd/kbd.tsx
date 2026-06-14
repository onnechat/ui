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
  | (string & Record<string, never>)

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

type KbdInput = KbdKey | KbdInput[]

function normalize(input: KbdKey | KbdKey[] | KbdKey[][]): KbdInput {
  if (typeof input === 'string') return input
  if (input.length === 0) return []
  if (typeof input[0] === 'string') return input as KbdKey[]
  return input as KbdInput[]
}

function SingleKey({ kbdKey }: { kbdKey: KbdKey }) {
  const icon = resolveKeyIcon(kbdKey)
  const text = resolveKeyText(kbdKey)
  return (
    <kbd className="inline-flex items-center justify-center gap-1 rounded-md border bg-muted/60 px-1.5 py-0.5 font-mono text-[0.8em] text-muted-foreground shadow-[0_1px_0_0_var(--color-border)]">
      {icon ? <Icon name={icon} className="size-3" /> : (text ?? kbdKey)}
    </kbd>
  )
}

function renderKeys(
  keys: KbdInput,
  separator: ReactNode,
  thenSeparator: ReactNode,
): ReactNode {
  if (typeof keys === 'string') {
    return <SingleKey kbdKey={keys} />
  }

  if (keys.length === 0) return null

  const sep = typeof keys[0] === 'string' ? separator : thenSeparator

  return (
    <span className="inline-flex items-center gap-1">
      {keys.map((k, i) => (
        <Fragment key={i}>
          {i > 0 ? sep : null}
          {renderKeys(k, separator, thenSeparator)}
        </Fragment>
      ))}
    </span>
  )
}

export type KbdProps = {
  keys: KbdKey | KbdKey[] | KbdKey[][]
  className?: string
  separator?: ReactNode
  thenSeparator?: ReactNode
}

export function Kbd({
  keys,
  className,
  separator = '+',
  thenSeparator = 'then',
}: KbdProps) {
  const groups = normalize(keys)

  if (Array.isArray(groups) && groups.length === 0) return null

  return (
    <span
      className={cn(
        'pointer-events-none shrink-0 select-none inline-flex items-center gap-1',
        className,
      )}
    >
      {renderKeys(groups, separator, thenSeparator)}
    </span>
  )
}
