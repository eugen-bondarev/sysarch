import {
  ComputerDesktopIcon,
  MoonIcon,
  SunIcon,
} from '@heroicons/react/24/outline'
import type { ComponentType } from 'react'
import { useThemeStore, type Theme } from '../../store/theme'
import Button from './button'

const ICONS: Record<Theme, ComponentType<{ className?: string }>> = {
  light: SunIcon,
  dark: MoonIcon,
  system: ComputerDesktopIcon,
}

const LABELS: Record<Theme, string> = {
  light: 'Light theme',
  dark: 'Dark theme',
  system: 'System theme',
}

export default function ThemeButton() {
  const theme = useThemeStore((state) => state.theme)
  const cycleTheme = useThemeStore((state) => state.cycleTheme)
  const Icon = ICONS[theme]

  return (
    <Button
      onClick={cycleTheme}
      aria-label={LABELS[theme]}
      className="absolute bottom-4 flex left-4 h-8 w-8 items-center justify-center bg-zinc-900 text-white transition hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
    >
      <Icon className="mim-h-4 min-w-4" />
    </Button>
  )
}
