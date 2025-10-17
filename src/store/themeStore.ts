import { create } from 'zustand'
import { persist } from 'zustand/middleware'

type ThemePreference = 'light' | 'dark' | 'system'

interface ThemeState {
  preference: ThemePreference
  resolvedTheme: 'light' | 'dark'
  setPreference: (pref: ThemePreference) => void
  applyTheme: (pref?: ThemePreference) => void
}

const getSystemTheme = (): 'light' | 'dark' => {
  if (typeof window === 'undefined') return 'light'
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set, get) => ({
      preference: 'system',
      resolvedTheme: 'light',
      setPreference: (pref) => {
        set({ preference: pref })
        get().applyTheme(pref)
      },
      applyTheme: (pref) => {
        const preference = pref ?? get().preference
        const theme = preference === 'system' ? getSystemTheme() : preference

        // Toggle root class for Tailwind dark mode and CSS vars
        const root = document.documentElement
        root.classList.remove('light', 'dark')
        root.classList.add(theme)
        set({ resolvedTheme: theme })
      },
    }),
    {
      name: 'theme-preference',
      onRehydrateStorage: () => (state) => {
        if (!state) return
        // Apply on load
        state.applyTheme()
        // Watch system changes when preference is system
        const mql = window.matchMedia('(prefers-color-scheme: dark)')
        const onChange = () => {
          if (state.preference === 'system') state.applyTheme('system')
        }
        mql.addEventListener?.('change', onChange)
        // Note: We intentionally do not store cleanup; page unload removes listener
      },
    }
  )
)


