import { Drawer, Box, Button, Text } from '@joshdoesthis/react-ui'
import { Link } from '@joshdoesthis/react-router'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faXmark, faFeather } from '@fortawesome/free-solid-svg-icons'
import {
  faGithub,
  faInstagram,
  faTwitter,
  faLinkedin
} from '@fortawesome/free-brands-svg-icons'
import { useStore } from '../provider/store'

export default () => {
  const store = useStore()
  const { drawerVisible } = store.state

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

  return (
    <Drawer
      visible={drawerVisible}
      close={() => store.set({ drawerVisible: false })}
      style='col fixed top-0 right-0 bottom-0 z-50 max-sm:w-full sm:(w-64 border-(l zinc-300 dark:zinc-700)) bg-(zinc-100 dark:zinc-800) safe-bottom safe-right'
      TopComponent={({ close }) => {
        return (
          <Box style='row center-end'>
            <Button style='px-4 py-2' press={close}>
              <FontAwesomeIcon icon={faXmark} />
            </Button>
          </Box>
        )
      }}
    >
      <Box style='col grow stretch-between p-4'>
        <Box style='col gap-1'>
          {links.map(({ path, icon, text }) => {
            return (
              <Link
                key={text}
                ext
                path={path}
                style='row center-start gap-2 hover:(bg-(zinc-300 dark:zinc-700)) px-2 py-1 rounded'
              >
                <FontAwesomeIcon
                  icon={icon}
                  className='row center-center w-4'
                />
                <Text>{text}</Text>
              </Link>
            )
          })}
        </Box>
        <Box>
          <Link
            ext
            path='https://blog.joshdoesthis.com'
            style='row center-start gap-2 hover:(bg-(zinc-300 dark:zinc-700)) px-2 py-1 rounded'
          >
            <FontAwesomeIcon
              icon={faFeather}
              className='row center-center w-4'
            />
            <Text>Edit</Text>
          </Link>
        </Box>
      </Box>
    </Drawer>
  )
}
