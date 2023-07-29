import platform from 'platform'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHeart } from '@fortawesome/free-solid-svg-icons'
import { useSpring, animated } from '@react-spring/web'
import { Group } from '@visx/group'
import { Bar } from '@visx/shape'
import { scaleLinear } from '@visx/scale'
import { withParentSize } from '@visx/responsive'
import Header from '../component/header'
import Menu from '../component/menu'
import { useStore } from '../provider/store'
import { Box, Button } from '@joshdoesthis/react-ui'

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
              style='fill-current text-zinc-200 dark:text-zinc-400'
            />
          </Group>
        )
      })}
    </svg>
  )
})

const HeartRate = () => {
  const { state: store, set: setStore } = useStore()

  // data, set_data, device, set_device
  const { data, device } = store

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
      {device?.gatt.connected ? (
        <Box style='flex flex-col gap-4'>
          <Box style='flex flex-row gap-4 items-center'>
            <Button
              style='bg-orange-200 text-orange-800 text-lg font-bold px-2 py-1 rounded-md'
              press={handle_disconnect}
            >
              Disconnect
            </Button>
            <span style='font-mono text-lg'>{device.name}</span>
          </Box>
          {data.length ? (
            <Box style='flex flex-row justify-end items-center gap-8'>
              <span style='text-5xl font-bold font-mono'>
                {Number(data.slice(-1)[0]?.value ?? 0).toFixed(0)}
              </span>
              <animated.span style='text-7xl text-rose-400' style={spring}>
                <FontAwesomeIcon icon={faHeart} />
              </animated.span>
            </Box>
          ) : null}
          <BarChart data={data} />
        </Box>
      ) : (
        <Box style='flex flex-row gap-4 items-center'>
          <Button
            style='bg-emerald-200 text-emerald-800 text-lg font-bold px-2 py-1 rounded-md'
            press={handle_connect}
          >
            Scan for Heart Rate Monitor
          </Button>
        </Box>
      )}
    </>
  )
}

const Notification = ({ varient, hidden, children }) => {
  const bg = {
    'platform-not-supported': 'bg-zinc-400'
  }
  if (!hidden)
    return (
      <Box style='flex justify-center max-w-7xl mx-auto'>
        <Box
          style={`font-bold font-mono text-sm text-center m-4 px-2 py-1 rounded-sm text-zinc-800 dark:text-zinc-200 bg-opacity-50 ${bg[varient]}`}
        >
          {children}
        </Box>
      </Box>
    )
}

const Main = () => {
  return (
    <>
      <Header />
      <Menu />
      <Notification
        varient='platform-not-supported'
        hidden={navigator.bluetooth ? true : false}
      >
        {platform.description} does not support{' '}
        <a href='https://caniuse.com/web-bluetooth' style='underline'>
          Web Bluetooth
        </a>
      </Notification>
      <main>
        <Box style='flex flex-col gap-4 max-w-7xl mx-auto px-6 py-4'>
          {navigator.bluetooth ? <HeartRate /> : null}
        </Box>
      </main>
    </>
  )
}
export default Main
