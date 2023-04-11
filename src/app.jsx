import { createRoot } from 'react-dom/client'
import { StrictMode, useState } from 'react'
import platform from 'platform'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHeart } from '@fortawesome/free-solid-svg-icons'
import { useSpring, animated } from '@react-spring/web'
import { Group } from '@visx/group'
import { Bar } from '@visx/shape'
import { scaleLinear } from '@visx/scale'
import { withParentSize } from '@visx/responsive'
import { StateProvider } from './state'
import Header from './header'
import Menu from './menu'
import './index.css'

const BarChart = withParentSize(props => {
  const { data } = props
  const { parentWidth } = props

  const bar_width = parentWidth / 100
  const width = parentWidth
  const height = 100

  const y = d => d.value

  const chart_data = data.slice(-101)

  const y_scale = scaleLinear({
    range: [height, 0],
    round: true,
    domain: [0, Math.max(...chart_data.map(d => d.value))]
  })

  const compose = (scale, accessor) => data => scale(accessor(data))
  const y_point = compose(y_scale, y)

  return (
    <svg width={width} height={height}>
      {chart_data.reverse().map((d, i) => {
        const bar_height = height - y_point(d)
        return (
          <Group key={`bar-${i}`}>
            <Bar
              x={width - bar_width - i * bar_width}
              y={height - bar_height}
              height={bar_height}
              width={`${bar_width}%`}
              className='fill-current text-zinc-200 dark:text-zinc-400'
            />
          </Group>
        )
      })}
    </svg>
  )
})

const HeartRate = () => {
  const [data, set_data] = useState([])
  const [device, set_device] = useState({})

  const handle_heart_rate_measurement = e => {
    const flag = e.target.value.getUint8(0)
    const rate_16_bits = flag & 0x1
    const value = rate_16_bits
      ? e.target.value.getUint16(1, true)
      : e.target.value.getUint8(1)
    set_data(s => [
      ...s,
      { service: 'heart_rate', value, created_at: new Date() }
    ])
  }

  const handle_connect = async () => {
    const device = await navigator.bluetooth.requestDevice({
      filters: [{ services: ['heart_rate'] }]
    })

    const server = await device.gatt.connect()
    const service = await server.getPrimaryService('heart_rate')
    const characteristic = await service.getCharacteristic(
      'heart_rate_measurement'
    )

    await characteristic.startNotifications()
    characteristic.addEventListener(
      'characteristicvaluechanged',
      handle_heart_rate_measurement
    )

    set_device(device)
  }

  const handle_disconnect = () => {
    if (device.gatt.connected) {
      device.gatt.disconnect()

      set_data([])
      set_device({})
    }
  }

  const [spring, spring_api] = useSpring(() => ({
    from: { scale: 0.8 },
    to: { scale: 1 }
  }))

  spring_api.start({
    from: { scale: 0.8 },
    to: { scale: 1 }
  })

  return (
    <>
      {device.gatt?.connected ? (
        <div className='flex flex-col gap-4'>
          <div className='flex flex-row gap-4 items-center'>
            <button
              className='bg-orange-200 text-orange-800 text-lg font-bold px-2 py-1 rounded-md'
              onClick={handle_disconnect}
            >
              Disconnect
            </button>
            <span className='font-mono text-lg'>{device.name}</span>
          </div>
          {data.length ? (
            <div className='flex flex-row justify-end items-center gap-8'>
              <span className='text-5xl font-bold font-mono'>
                {Number(data.slice(-1)[0]?.value ?? 0).toFixed(0)}
              </span>
              <animated.span className='text-7xl text-rose-400' style={spring}>
                <FontAwesomeIcon icon={faHeart} />
              </animated.span>
            </div>
          ) : null}
          <BarChart data={data} />
        </div>
      ) : (
        <div className='flex flex-row gap-4 items-center'>
          <button
            className='bg-emerald-200 text-emerald-800 text-lg font-bold px-2 py-1 rounded-md'
            onClick={handle_connect}
          >
            Scan for Heart Rate Monitor
          </button>
        </div>
      )}
    </>
  )
}

const App = () => {
  return (
    <>
      <Header />
      <Menu />
      <main>
        <div className='flex flex-col gap-4 max-w-7xl mx-auto px-6 py-4'>
          {navigator.bluetooth ? (
            <HeartRate />
          ) : (
            <div className='text-center'>
              <span className='font-bold font-mono text-sm bg-purple-200 text-zinc-800 inline-block px-1 py-0 rounded-sm'>
                {platform.description} does not support{' '}
                <a
                  href='https://caniuse.com/web-bluetooth'
                  className='underline'
                >
                  Web Bluetooth
                </a>
              </span>
            </div>
          )}
        </div>
      </main>
    </>
  )
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <StateProvider>
      <App />
    </StateProvider>
  </StrictMode>
)
