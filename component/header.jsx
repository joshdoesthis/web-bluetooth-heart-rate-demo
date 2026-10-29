import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faBars as solidBars,
  faCircle as solidCircle,
  faCircleHalfStroke as solidCircleHalfStroke
} from '@fortawesome/free-solid-svg-icons'
import { faCircle as regularCircle } from '@fortawesome/free-regular-svg-icons'
import { useStore } from '../provider/store'
import { useTheme } from '../provider/theme'

const themeIcons = {
  light: regularCircle,
  dark: solidCircle,
  auto: solidCircleHalfStroke
}

const Header = ({ children }) => {
  const { set } = useStore()
  const theme = useTheme()

  return (
    <header className='sticky top-0 z-10'>
      <div className='border-b border-zinc-300 bg-white safe-x dark:border-zinc-700 dark:bg-black'>
        <div className='flex items-center justify-between'>
          <a
            href='https://github.com/joshdoesthis'
            target='_blank'
            rel='noopener noreferrer'
            className='px-4 py-2'
          >
            Joshua Wilson
          </a>
          <div className='flex'>
            <button
              type='button'
              className='px-4 py-2'
              onClick={theme.cycle}
              aria-label={`Theme: ${theme.mode}. Click to change.`}
              title={`Theme: ${theme.mode}`}
            >
              <FontAwesomeIcon icon={themeIcons[theme.mode]} />
            </button>
            <button
              type='button'
              className='px-4 py-2'
              onClick={() => set({ drawerVisible: true })}
              aria-label='Open menu'
            >
              <FontAwesomeIcon icon={solidBars} />
            </button>
          </div>
        </div>
      </div>
      {children}
    </header>
  )
}

export default Header
