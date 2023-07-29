import { Box, Button, DarkMode } from '@joshdoesthis/react-ui'
import { Link } from '@joshdoesthis/react-router'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faBars as solidBars,
  faCircle as solidCircle,
  faCircleHalfStroke as solidCircleHalfStroke
} from '@fortawesome/free-solid-svg-icons'
import { faCircle as regularCircle } from '@fortawesome/free-regular-svg-icons'
import { useStore } from '../provider/store'

const DefaultTopComponent = () => {}
const DefaultBottomComponent = () => {}

export default ({
  TopComponent = DefaultTopComponent,
  BottomComponent = DefaultBottomComponent
}) => {
  const store = useStore()

  return (
    <Box style='sticky top-0'>
      <TopComponent />
      <Box style='bg-(white dark:black) border-(b zinc-300 dark:zinc-700) safe-h'>
        <Box style='row center-between'>
          <Link path='/' style='px-4 py-2'>
            Joshua Wilson
          </Link>
          <Box style='row'>
            <DarkMode
              defaultMode='auto'
              SwitchComponent={({ mode, cycle }) => (
                <Button style='px-4 py-2' press={cycle}>
                  <FontAwesomeIcon
                    icon={
                      {
                        light: regularCircle,
                        dark: solidCircle,
                        auto: solidCircleHalfStroke
                      }[mode]
                    }
                  />
                </Button>
              )}
            />
            <Button
              style='px-4 py-2'
              press={() => store.set({ drawerVisible: true })}
            >
              <FontAwesomeIcon icon={solidBars} />
            </Button>
          </Box>
        </Box>
      </Box>
      <BottomComponent />
    </Box>
  )
}
