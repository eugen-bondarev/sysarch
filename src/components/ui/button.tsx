import type { ReactNode } from 'react'
import { cn } from '../../lib/class'

type ButtonProps = {
  children?: ReactNode
  onClick?: () => void
  className?: string
  hotkey?: ('Ctrl' | string)[]
}

function isMacOS() {
  return navigator.platform.includes('Mac')
}

const REMAP_KEYS: Record<string, string> = {
  Ctrl: isMacOS() ? '⌘' : 'Ctrl',
}

export default function Button({
  children,
  onClick,
  className,
  hotkey,
}: ButtonProps) {
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
