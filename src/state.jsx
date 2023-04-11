import { createContext, useState, useEffect } from 'react'

const StateContext = createContext()

const StateProvider = ({ children }) => {
  /* Theme */
  const [theme, set_theme] = useState(
    // localStorage.hasOwnProperty('theme')
    //   ? localStorage.getItem('theme')
    //   :
    window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
  )

  useEffect(() => {
    const media_query = window.matchMedia('(prefers-color-scheme: dark)')
    const handler = e => {
      set_theme(e.matches ? 'dark' : 'light')
    }
    media_query.addEventListener('change', handler)
    return () => media_query.removeEventListener('change', handler)
  }, [])

  useEffect(() => {
    document.documentElement.classList.remove(
      { dark: 'light', light: 'dark' }[theme]
    )
    document.documentElement.classList.add(theme)
    document
      .querySelector('meta[name="theme-color"]')
      .setAttribute('content', { dark: '#27272a', light: '#fff' }[theme])
    // localStorage.setItem('theme', theme)
  }, [theme])

  const toggle_theme = () => {
    set_theme({ dark: 'light', light: 'dark' }[theme])
  }

  /* Menu */
  const [menu, set_menu] = useState(false)

  const toggle_menu = () => {
    set_menu(!menu)
  }

  return (
    <StateContext.Provider value={{ theme, toggle_theme, menu, toggle_menu }}>
      {children}
    </StateContext.Provider>
  )
}

export { StateContext, StateProvider }
