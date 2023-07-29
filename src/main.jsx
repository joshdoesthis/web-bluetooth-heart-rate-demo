import platform from 'platform'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBluetooth } from '@fortawesome/free-brands-svg-icons'
import { faHeart } from '@fortawesome/free-solid-svg-icons'
import { useSpring, animated } from '@react-spring/web'
import { Group } from '@visx/group'
import { Bar } from '@visx/shape'
import { scaleLinear } from '@visx/scale'
import { withParentSize } from '@visx/responsive'
import Header from '../component/header'
import Menu from '../component/menu'
import { useStore } from '../provider/store'
import { Box, Button, Text } from '@joshdoesthis/react-ui'
import { Link } from '@joshdoesthis/react-router'
import { useCallback, useEffect } from 'react'

const BarChart = withParentSize(({ data, parentWidth }) => {
  const barWidth = parentWidth / 100
  const width = parentWidth
  const height = 100
  const y = d => d.value
  const chartData = data?.slice(-101)
  const yScale = scaleLinear({
    range: [height, 0],
    round: true,
    domain: [0, Math.max(...(chartData ? chartData.map(d => d.value) : []))]
  })
  const compose = (scale, accessor) => data => scale(accessor(data))
  const yPoint = compose(yScale, y)

  return (
    <svg width={width} height={height}>
      {chartData?.reverse().map((d, i) => {
        const barHeight = height - yPoint(d)
        return (
          <Group key={`bar-${i}`}>
            <Bar
              x={width - barWidth - i * barWidth}
              y={height - barHeight}
              height={barHeight}
              width={`${barWidth}%`}
              className='fill-current text-(zinc-300 dark:zinc-700)'
            />
          </Group>
        )
      })}
    </svg>
  )
})

const Main = () => {
  const { state: store, set: setStore } = useStore()

  const handleHeartRateMeasurement = e => {
    const flag = e.target.value.getUint8(0)
    const rate16Bits = flag & 0x1
    const value = rate16Bits
      ? e.target.value.getUint16(1, true)
      : e.target.value.getUint8(1)
    setStore(s => ({
      ...s,
      data: [...s.data, { service: 'heart_rate', value, createdAt: new Date() }]
    }))
  }

  const handleConnect = async () => {
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
      handleHeartRateMeasurement
    )
    setStore(s => ({ ...s, device }))
  }

  const handleDisconnect = () => {
    if (store.device?.gatt?.connected) {
      store.device.gatt.disconnect()
      setStore(s => ({ ...s, data: [], device: {} }))
    }
  }

  const [animatedStyle, spring] = useSpring(() => ({
    from: { scale: 0.8 },
    to: { scale: 1 },
    zIndex: 0
  }))

  spring.start({
    from: { scale: 0.8 },
    to: { scale: 1 }
  })

  const simulatedHeartRate = (start = 60) => {
    const base = store.data?.slice(-1)[0]?.value ?? start
    const variance = 1
    const chance = Math.random()
    if (chance < 0.1) return base + variance
    if (chance < 0.2) return base + variance
    if (chance < 0.3) return base + variance
    if (chance < 0.4) return base - variance
    if (chance < 0.5) return base - variance
    if (chance < 0.6) return base - variance
    return base
  }

  useEffect(() => {
    if (!navigator.bluetooth) {
      const device = {
        name: 'Polar H10 12345678',
        gatt: {
          connected: true
        }
      }
      setStore(s => ({ ...s, device }))
      const interval = setInterval(() => {
        setStore(s => ({
          ...s,
          data: [
            ...(s?.data ?? []),
            {
              service: 'heart_rate',
              value: simulatedHeartRate(),
              createdAt: new Date()
            }
          ]
        }))
      }, 1000)
      return () => clearInterval(interval)
    }
  }, [store.data])

  return (
    <>
      <Menu />
      <Header
        BottomComponent={useCallback(() => {
          return (
            <Box style='safe-h'>
              <Box style='row center-start bg-(white dark:black) px-4 py-2'>
                {store.device?.gatt?.connected ? (
                  <Box style='row center-center gap-2'>
                    <Button
                      disabled={!navigator.bluetooth}
                      style='row center-center gap-1 bg-(red-500 dark:red-700) disabled:bg-(zinc-300 dark:zinc-700) hover:bg-(red-700 dark:red-500) text-xs text-white disabled:(text-zinc-500 dark:(text-zinc-300) px-2 py-1 rounded'
                      press={handleDisconnect}
                    >
                      <FontAwesomeIcon icon={faBluetooth} />
                      <Text style='text-xs font-bold'>Disconnect</Text>
                    </Button>
                    <Text style='text-xs'>{store.device?.name}</Text>
                  </Box>
                ) : null}
                {navigator.bluetooth ? (
                  <Button
                    style='row center-center gap-1 bg-(emerald-500 dark:emerald-700) hover:bg-(emerald-700 dark:emerald-500) text-xs text-white px-2 py-1 rounded'
                    press={handleConnect}
                  >
                    <FontAwesomeIcon icon={faBluetooth} />
                    <Text style='text-xs font-bold'>Scan for Devices</Text>
                  </Button>
                ) : null}
              </Box>
            </Box>
          )
        }, [store.device])}
      />
      <Box style='safe-h safe-bottom'>
        <Box style='col grow gap-4 stretch-start px-4 py-2'>
          <Box style='col gap-4'>
            <Box style='row center-end gap-8'>
              <Text style='text-5xl font-bold'>
                {Number(store?.data?.slice(-1)[0]?.value ?? 0).toFixed(0)}
              </Text>
              <animated.span style={animatedStyle}>
                <Text style='text-6xl text-red-500'>
                  <FontAwesomeIcon icon={faHeart} className='' />
                </Text>
              </animated.span>
            </Box>
            <BarChart data={store?.data} />
          </Box>
          {!navigator.bluetooth && store.data?.length ? (
            <Box style='block'>
              <Text p style='text-xs'>
                This demo is running simulated heart rate data as{' '}
                {platform.description} does not support:{' '}
              </Text>
              <Text ul style='text-xs underline'>
                <Text li>
                  <Link ext path='https://caniuse.com/web-bluetooth'>
                    Web Bluetooth
                  </Link>
                </Text>
              </Text>
            </Box>
          ) : null}
        </Box>
      </Box>
    </>
  )
}

export default Main
