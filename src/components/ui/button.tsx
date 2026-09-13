import { useEffect } from 'react'
import type { ReactNode } from 'react'
import { cn } from '../../lib/class'

type ButtonProps = {
  children?: ReactNode
  onClick?: () => void
  className?: string
  hotkey?: string[]
}

function isMacOS() {
  return navigator.platform.includes('Mac')
}

const REMAP_KEYS: Record<string, string> = {
  Ctrl: isMacOS() ? '⌘' : 'Ctrl',
}

const isEditableTarget = (target: EventTarget | null) =>
  target instanceof HTMLElement &&
  (target.tagName === 'INPUT' ||
    target.tagName === 'TEXTAREA' ||
    target.tagName === 'SELECT' ||
    target.isContentEditable)

const matchesHotkey = (event: KeyboardEvent, hotkey: string) => {
  const parts = hotkey.split('+')
  const key = parts[parts.length - 1]
  if (event.key.toLowerCase() !== key.toLowerCase()) {
    return false
  }
  const wanted = { ctrl: false, meta: false, alt: false, shift: false }
  for (const modifier of parts.slice(0, -1)) {
    switch (modifier) {
      case 'Ctrl':
        if (isMacOS()) {
          wanted.meta = true
        } else {
          wanted.ctrl = true
        }
        break
      case 'Meta':
        wanted.meta = true
        break
      case 'Shift':
        wanted.shift = true
        break
      case 'Alt':
        wanted.alt = true
        break
      default:
        return false
    }
  }
  return (
    event.ctrlKey === wanted.ctrl &&
    event.metaKey === wanted.meta &&
    event.altKey === wanted.alt &&
    event.shiftKey === wanted.shift
  )
}

export default function Button({
  children,
  onClick,
  className,
  hotkey,
}: ButtonProps) {
  const hotkeyKey = hotkey?.join('+')

  useEffect(() => {
    if (!hotkeyKey) {
      return
    }
    const onKeyDown = (event: KeyboardEvent) => {
      if (isEditableTarget(event.target)) {
        return
      }
      if (!matchesHotkey(event, hotkeyKey)) {
        return
      }
      event.preventDefault()
      onClick?.()
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [hotkeyKey, onClick])

  const filteredHotKey = !hotkey
    ? undefined
    : hotkey?.map((k) => {
        if (k in REMAP_KEYS) {
          return REMAP_KEYS[k]
        }
        return k
      })

  return (
    <button
      onClick={onClick}
      className={cn(
        `bg-zinc-900 hover:bg-zinc-800 transition cursor-pointer px-3 py-1 text-sm text-white dark:bg-zinc-100 dark:hover:bg-zinc-200 dark:text-zinc-900`,
        className,
      )}
    >
      {children}{' '}
      {filteredHotKey && (
        <span className="text-zinc-400 dark:text-zinc-500">
          {filteredHotKey.join(' + ')}
        </span>
      )}
    </button>
  )
}