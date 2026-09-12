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
        `absolute left-4 top-4 z-10 rounded-md bg-zinc-900 hover:bg-zinc-800 transition cursor-pointer px-3 py-1 text-sm text-white`,
        className,
      )}
    >
      {children}
    </button>
  )
}
