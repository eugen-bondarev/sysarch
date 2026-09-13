import type { ReactNode } from 'react'
import { cn } from '../../lib/class'

type ButtonProps = {
  children?: ReactNode
  onClick?: () => void
  className?: string
}

export default function Button({ children, onClick, className }: ButtonProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        `bg-zinc-900 hover:bg-zinc-800 transition cursor-pointer px-3 py-1 text-sm text-white dark:bg-zinc-100 dark:hover:bg-zinc-200 dark:text-zinc-900`,
        className,
      )}
    >
      {children}
    </button>
  )
}
