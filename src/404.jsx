import Header from '../component/header'
import Menu from '../component/menu'

const NotFound = () => {
  return (
    <>
      <Menu />
      <Header />
      <main className='flex grow items-center justify-center gap-4'>
        <h1 className='font-semibold'>404</h1>
        <div className='h-8 border-l border-zinc-300 dark:border-zinc-700' />
        <p>
          Page not found.{' '}
          <a href={import.meta.env.BASE_URL} className='underline'>
            Go to the demo
          </a>
        </p>
      </main>
    </>
  )
}

export default NotFound
