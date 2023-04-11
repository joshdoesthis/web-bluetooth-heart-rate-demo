import { useContext } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faXmark } from '@fortawesome/free-solid-svg-icons'
import {
  faGithub,
  faInstagram,
  faTwitter,
  faLinkedin
} from '@fortawesome/free-brands-svg-icons'
import { StateContext } from './state'

const Menu = () => {
  const { menu, toggle_menu } = useContext(StateContext)

  return (
    <div
      className={`flex flex-col fixed top-0 left-0 w-full h-full bg-white dark:bg-zinc-800 z-10 transition-opacity duration-300 ${
        menu ? 'opacity-100' : 'opacity-0 pointer-events-none'
      }`}
    >
      <div className='flex flex-row justify-end'>
        <button
          className='px-6 py-4 text-2xl leading-none'
          onClick={toggle_menu}
        >
          <span className='inline-block w-6'>
            <FontAwesomeIcon icon={faXmark} />
          </span>
        </button>
      </div>
      <div className='flex grow justify-center items-center'>
        <nav className='flex flex-row gap-12 text-3xl'>
          <a href='https://github.com/joshdoesthis'>
            <FontAwesomeIcon icon={faGithub} />
          </a>
          <a href='https://www.instagram.com/joshdoesthis'>
            <FontAwesomeIcon icon={faInstagram} />
          </a>
          <a href='https://twitter.com/joshdoesthis'>
            <FontAwesomeIcon icon={faTwitter} />
          </a>
          <a href='https://www.linkedin.com/in/joshdoesthis'>
            <FontAwesomeIcon icon={faLinkedin} />
          </a>
        </nav>
      </div>
    </div>
  )
}

export default Menu
