import { useEffect } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faXmark } from '@fortawesome/free-solid-svg-icons'
import {
  faGithub,
  faInstagram,
  faTwitter,
  faLinkedin
} from '@fortawesome/free-brands-svg-icons'
import { useStore } from '../provider/store'

const links = [
  {
    path: 'https://github.com/joshdoesthis',
    icon: faGithub,
    text: 'GitHub'
  },
  {
    path: 'https://www.instagram.com/joshdoesthis',
    icon: faInstagram,
    text: 'Instagram'
  },
  {
    path: 'https://twitter.com/joshdoesthis',
    icon: faTwitter,
    text: 'Twitter'
  },
  {
    path: 'https://www.linkedin.com/in/joshdoesthis',
    icon: faLinkedin,
    text: 'LinkedIn'
  }
]

const Menu = () => {
  const { state, set } = useStore()
  const visible = state.drawerVisible
  const close = () => set({ drawerVisible: false })

  useEffect(() => {
    if (!visible) return
    const onKey = e => e.key === 'Escape' && close()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [visible])

  return (
    <>
      <div
        aria-hidden='true'
        onClick={close}
        className={`fixed inset-0 z-40 bg-black/30 transition-opacity duration-200 ${
          visible ? 'opacity-100' : 'pointer-events-none opacity-0'
        }`}
      />
      <nav
        aria-label='Menu'
        inert={!visible}
        className={`fixed top-0 right-0 bottom-0 z-50 flex w-full flex-col bg-zinc-100 transition-transform duration-200 safe-b safe-r sm:w-64 sm:border-l sm:border-zinc-300 dark:bg-zinc-800 sm:dark:border-zinc-700 ${
          visible ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className='flex items-center justify-end'>
          <button
            type='button'
            className='px-4 py-2'
            onClick={close}
            aria-label='Close menu'
          >
            <FontAwesomeIcon icon={faXmark} />
          </button>
        </div>
        <div className='flex flex-col gap-1 p-4'>
          {links.map(({ path, icon, text }) => (
            <a
              key={text}
              href={path}
              target='_blank'
              rel='noopener noreferrer'
              className='flex items-center gap-2 rounded px-2 py-1 hover:bg-zinc-300 dark:hover:bg-zinc-700'
            >
              <FontAwesomeIcon icon={icon} className='w-4' />
              <span>{text}</span>
            </a>
          ))}
        </div>
      </nav>
    </>
  )
}

export default Menu
