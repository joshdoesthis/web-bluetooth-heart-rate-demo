import { useEffect, useState, useContext } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSun, faMoon, faBars } from '@fortawesome/free-solid-svg-icons'
// import { faGithub } from '@fortawesome/free-brands-svg-icons'
import { StateContext } from './state'

const Header = () => {
  const { theme, toggle_theme, toggle_menu } = useContext(StateContext)

  return (
    <header className='border-b border-b-zinc-200 dark:border-b-zinc-600 bg-white dark:bg-zinc-800 sticky top-0'>
      <div className='max-w-7xl mx-auto flex flex-row justify-between'>
        <nav className='flex flex-row items-center font-bold'>
          <a className='px-6 py-4' href='https://joshdoesthis.com'>
            Joshua Wilson
          </a>
        </nav>
        <nav className='flex flex-row items-center font-bold'>
          <button
            className='px-6 py-4 text-2xl leading-none text-amber-400 dark:text-sky-400'
            onClick={toggle_theme}
          >
            <span className='inline-block w-6'>
              <FontAwesomeIcon icon={{ dark: faMoon, light: faSun }[theme]} />
            </span>
          </button>
          <div className='w-px h-full bg-gradient-to-t from-zinc-200 to-white dark:from-zinc-600 dark:to-zinc-800' />
          <button
            className='px-6 py-4 text-2xl leading-none'
            onClick={toggle_menu}
          >
            <span className='inline-block w-6'>
              <FontAwesomeIcon icon={faBars} />
            </span>
          </button>
        </nav>
      </div>
    </header>
  )
}

export default Header
