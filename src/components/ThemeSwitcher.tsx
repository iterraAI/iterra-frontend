import { Monitor, Moon, Sun } from 'lucide-react'
import { useState } from 'react'
import { useThemeStore } from '../store/themeStore'

export default function ThemeSwitcher() {
  const { preference, resolvedTheme, setPreference } = useThemeStore()
  const [open, setOpen] = useState(false)

  const options: { key: 'light' | 'dark' | 'system'; label: string; icon: JSX.Element }[] = [
    { key: 'system', label: 'System', icon: <Monitor size={14} /> },
    { key: 'light', label: 'Light', icon: <Sun size={14} /> },
    { key: 'dark', label: 'Dark', icon: <Moon size={14} /> },
  ]

  const active = options.find(o => o.key === preference)!

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#0f1013] hover:bg-gray-50 dark:hover:bg-[#141519] text-sm text-gray-700 dark:text-gray-200 shadow-sm"
        aria-label="Theme"
      >
        <span className="text-gray-700 dark:text-gray-200">{active.icon}</span>
        <span className="hidden sm:inline">{active.label}</span>
      </button>
      {open && (
        <div className="absolute right-0 mt-2 w-44 bg-white dark:bg-[#0f1013] rounded-xl shadow-2xl border border-gray-200 dark:border-gray-800 py-1 z-50">
          {options.map(opt => (
            <button
              key={opt.key}
              onClick={() => { setPreference(opt.key); setOpen(false) }}
              className={`w-full px-3 py-2 text-left text-sm flex items-center gap-2 hover:bg-gray-50 dark:hover:bg-[#141519] ${preference === opt.key ? 'text-green-600 dark:text-emerald-400' : 'text-gray-700 dark:text-gray-200'}`}
            >
              {opt.icon}
              <span>{opt.label}{opt.key === resolvedTheme ? ' •' : ''}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}


