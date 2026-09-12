import type { ReactNode } from 'react'

type SidebarProps = {
  children?: ReactNode
}

export function Sidebar({ children }: SidebarProps) {
  return (
    <aside className="absolute right-4 top-4 z-10 w-64 rounded-lg border border-zinc-200 bg-white p-4 shadow-lg">
      {children}
    </aside>
  )
}
