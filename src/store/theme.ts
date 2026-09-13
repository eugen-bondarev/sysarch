import { create } from 'zustand'

export type Theme = 'light' | 'dark' | 'system'

export const THEMES: Theme[] = ['light', 'dark', 'system']

const STORAGE_KEY = 'sysarch.theme'

const loadTheme = (): Theme => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return THEMES.includes(raw as Theme) ? (raw as Theme) : 'system'
  } catch {
    return 'system'
  }
}

type ThemeStore = {
  theme: Theme
  cycleTheme: () => void
}

export const useThemeStore = create<ThemeStore>((set, get) => ({
  theme: loadTheme(),
  cycleTheme: () => {
    const next = THEMES[(THEMES.indexOf(get().theme) + 1) % THEMES.length]
    try {
      localStorage.setItem(STORAGE_KEY, next)
    } catch {
      // ignore storage errors, theme still switches for this session
    }
    set({ theme: next })
  },
}))