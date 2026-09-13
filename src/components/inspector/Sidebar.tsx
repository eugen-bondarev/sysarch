import type { ReactNode } from 'react'

type SidebarProps = {
  children?: ReactNode
}

export function Sidebar({ children }: SidebarProps) {
  return (
    <aside className="absolute right-4 top-4 z-10 w-64 max-h-[calc(100vh-2rem)] overflow-y-auto border border-zinc-200 bg-white p-4 dark:border-zinc-700 dark:bg-zinc-900">
      {children}
    </aside>
  )
}
