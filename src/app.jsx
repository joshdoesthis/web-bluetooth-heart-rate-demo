import { createRoot } from 'react-dom/client'
import { StrictMode, useState, useEffect } from 'react'
import platform from 'platform'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faGithub } from '@fortawesome/free-brands-svg-icons'
import { faHeart, faAngleRight } from '@fortawesome/free-solid-svg-icons'
import { useSpring, animated } from '@react-spring/web'
import { Group } from '@visx/group'
import { Bar } from '@visx/shape'
import { scaleLinear } from '@visx/scale'
import { withParentSize } from '@visx/responsive'
import './index.styl'

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
    <div className='bar-chart'>
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
              />
            </Group>
          )
        })}
      </svg>
    </div>
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

  // useEffect(() => {
  spring_api.start({
    from: { scale: 0.8 },
    to: { scale: 1 }
  })
  // }, [data])

  return (
    <>
      {device.gatt?.connected ? (
        <>
          <div className='connected'>
            <button className='disconnect' onClick={handle_disconnect}>
              Disconnect
            </button>
            <div className='device-name'>
              <span>{device.name}</span>
            </div>
          </div>
          {data.length ? (
            <div className='heart-rate'>
              <animated.span className='heart-rate-icon' style={spring}>
                <FontAwesomeIcon icon={faHeart} />
              </animated.span>
              {console.log(data.slice(-2))}
              <span className='heart-rate-value'>
                {Number(data.slice(-1)[0].value).valueOf()}
              </span>
            </div>
          ) : null}
          <BarChart data={data} />
        </>
      ) : (
        <div className='disconnected'>
          <button className='connect' onClick={handle_connect}>
            Connect
          </button>
        </div>
      )}
    </>
  )
}

const App = () => {
  return (
    <>
      <header>
        <div className='container'>
          <h1>
            <a href='https://joshdoesthis.com'>Joshua Wilson</a>
            <FontAwesomeIcon icon={faAngleRight} />
            <span>Web Bluetooth Heart Rate Demo</span>
          </h1>
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

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>
)
