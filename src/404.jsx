import { Box, Text, Divider } from '@joshdoesthis/react-ui'
import Header from '../component/header'
import Menu from '../component/menu'

const NotFound = () => {
  return (
    <>
      <Menu />
      <Header />
      <Box style='row grow center-center gap-4'>
        <Text h6>404</Text>
        <Divider style='border-(l zinc-300 dark:(zinc-700)) h-8' />
        <Text p>Page not found.</Text>
      </Box>
    </>
  )
}

export default NotFound
