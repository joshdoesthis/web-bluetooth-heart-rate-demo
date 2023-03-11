import HeartRate from './heart-rate.jsx'
import { HeartBrokenFilled } from '@fluentui/react-icons'

function App() {
  return (
    <div className='App'>
      <h1>Web Bluetooth Heart Rate Demo</h1>
      {navigator.bluetooth ? (
        <HeartRate />
      ) : (
        <p>
          Your browser does not support the{' '}
          <a href='https://developer.mozilla.org/en-US/docs/Web/API/Web_Bluetooth_API'>
            Web Bluetooth API
          </a>
          <HeartBrokenFilled primaryFill='red' />
        </p>
      )}
    </div>
  )
}

export default App
