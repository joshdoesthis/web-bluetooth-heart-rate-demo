import { useEffect, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSun, faMoon } from '@fortawesome/free-solid-svg-icons'
import { faGithub } from '@fortawesome/free-brands-svg-icons'

const Header = () => {
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

  return (
    <header className='border-b border-b-zinc-200 dark:border-b-zinc-600 bg-white dark:bg-zinc-800 sticky top-0'>
      <div className='max-w-7xl mx-auto flex flex-row justify-between'>
        <nav className='flex flex-row items-center font-bold'>
          <a className='px-6 py-4' href='https://joshdoesthis.com'>
            Joshua Wilson
          </a>
        </nav>
        <nav className='flex flex-row items-center font-bold'>
          <a
            className='px-6 py-4 text-2xl leading-none'
            href='https://github.com/joshdoesthis'
          >
            <FontAwesomeIcon icon={faGithub} />
          </a>
          <div className='w-px h-full bg-gradient-to-t from-zinc-200 to-white dark:from-zinc-600 dark:to-zinc-800' />
          <button
            className='px-6 py-4 text-2xl leading-none text-amber-400 dark:text-sky-400'
            onClick={toggle_theme}
          >
            <span className='inline-block w-6'>
              <FontAwesomeIcon icon={{ dark: faMoon, light: faSun }[theme]} />
            </span>
          </button>
        </nav>
      </div>
    </header>
  )
}

export default Header
