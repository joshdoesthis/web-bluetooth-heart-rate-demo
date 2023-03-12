import HeartRate from './heart-rate.jsx'
import platform from 'platform'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faGithub } from '@fortawesome/free-brands-svg-icons'

function App() {
  return (
    <>
      <header>
        <div className='container'>
          <h1>Web Bluetooth Heart Rate Demo</h1>
          <a href='https://github.com/joshdoesthis/web-bluetooth-heart-rate-demo'>
            <FontAwesomeIcon icon={faGithub} />
          </a>
        </div>
      </header>
      <main>
        <div className='container'>
          {navigator.bluetooth ? (
            <HeartRate />
          ) : (
            <div className='not-supported'>
              <span>
                {platform.description} does not support{' '}
                <a href='https://caniuse.com/web-bluetooth'>Web Bluetooth</a>
              </span>
            </div>
          )}
        </div>
      </main>
    </>
  )
}

export default App
