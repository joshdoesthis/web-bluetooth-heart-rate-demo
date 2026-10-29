import { useEffect, useState } from 'react'

const MODES = ['auto', 'light', 'dark']

const readMode = () => {
  try {
    const saved = localStorage.getItem('theme')
    return MODES.includes(saved) ? saved : 'auto'
  } catch {
    return 'auto'
  }
}

// Light, dark, or auto (follow the system setting). The choice is remembered
// in this browser, and index.html applies it early to avoid a flash.
const useTheme = () => {
  const [mode, setMode] = useState(readMode)

  useEffect(() => {
    const media = matchMedia('(prefers-color-scheme: dark)')
    const apply = () =>
      document.documentElement.classList.toggle(
        'dark',
        mode === 'dark' || (mode === 'auto' && media.matches)
      )

    apply()
    try {
      localStorage.setItem('theme', mode)
    } catch {}

    if (mode !== 'auto') return
    media.addEventListener('change', apply)
    return () => media.removeEventListener('change', apply)
  }, [mode])

  const cycle = () => setMode(m => MODES[(MODES.indexOf(m) + 1) % MODES.length])

  return { mode, cycle }
}

export { useTheme }
