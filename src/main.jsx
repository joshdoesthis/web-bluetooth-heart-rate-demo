import { useEffect } from 'react'
import platform from 'platform'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBluetooth } from '@fortawesome/free-brands-svg-icons'
import { faHeart } from '@fortawesome/free-solid-svg-icons'
import { useSpring, animated } from '@react-spring/web'
import Header from '../component/header'
import Menu from '../component/menu'
import HeartRateChart from '../component/heart-rate-chart'
import { useStore } from '../provider/store'

// Keep a little more than the chart shows, so memory doesn't grow forever.
const MAX_READINGS = 200

const addReading = value => s => ({
  ...s,
  data: [
    ...s.data.slice(-(MAX_READINGS - 1)),
    { service: 'heart_rate', value, createdAt: new Date() }
  ]
})

// Heart Rate Measurement characteristic: bit 0 of the flags byte says whether
// the value is 8-bit or 16-bit.
const parseHeartRate = view => {
  const flags = view.getUint8(0)
  return flags & 0x1 ? view.getUint16(1, true) : view.getUint8(1)
}

const simulatedHeartRate = previous => {
  const chance = Math.random()
  if (chance < 0.3) return previous + 1
  if (chance < 0.6) return previous - 1
  return previous
}

const Main = () => {
  const { state, set } = useStore()
  const supported = Boolean(navigator.bluetooth)
  const connected = Boolean(state.device?.gatt?.connected)
  const latest = state.data.at(-1)

  const reset = () => set({ data: [], device: null })

  const handleConnect = async () => {
    try {
      const device = await navigator.bluetooth.requestDevice({
        filters: [{ services: ['heart_rate'] }]
      })
      device.addEventListener('gattserverdisconnected', reset)
      const server = await device.gatt.connect()
      const service = await server.getPrimaryService('heart_rate')
      const characteristic = await service.getCharacteristic(
        'heart_rate_measurement'
      )
      characteristic.addEventListener('characteristicvaluechanged', e =>
        set(addReading(parseHeartRate(e.target.value)))
      )
      await characteristic.startNotifications()
      set({ device })
    } catch (err) {
      // The browser throws NotFoundError when the person cancels the picker.
      if (err.name !== 'NotFoundError') console.error(err)
    }
  }

  const handleDisconnect = () => {
    if (state.device?.gatt?.connected) state.device.gatt.disconnect()
    reset()
  }

  // Without Web Bluetooth, show a simulated monitor so the demo still works.
  useEffect(() => {
    if (supported) return
    set({ device: { name: 'Polar H10 12345678', gatt: { connected: true } } })
    const interval = setInterval(
      () =>
        set(s =>
          addReading(simulatedHeartRate(s.data.at(-1)?.value ?? 60))(s)
        ),
      1000
    )
    return () => clearInterval(interval)
  }, [supported, set])

  // Pulse the heart each time a new reading arrives.
  const [pulse, pulseApi] = useSpring(() => ({ scale: 1 }))
  useEffect(() => {
    if (latest) pulseApi.start({ from: { scale: 0.8 }, to: { scale: 1 } })
  }, [latest, pulseApi])

  return (
    <>
      <Menu />
      <Header>
        <div className='safe-x'>
          <div className='flex items-center justify-start bg-white px-4 py-2 dark:bg-black'>
            {connected ? (
              <div className='flex items-center justify-center gap-2'>
                <button
                  type='button'
                  disabled={!supported}
                  onClick={handleDisconnect}
                  className='flex items-center justify-center gap-1 rounded bg-red-500 px-2 py-1 text-xs text-white enabled:hover:bg-red-700 disabled:bg-zinc-300 disabled:text-zinc-500 dark:bg-red-700 dark:enabled:hover:bg-red-500 dark:disabled:bg-zinc-700 dark:disabled:text-zinc-300'
                >
                  <FontAwesomeIcon icon={faBluetooth} />
                  <span className='font-bold'>Disconnect</span>
                </button>
                <span className='text-xs'>{state.device?.name}</span>
              </div>
            ) : null}
            {!connected && supported ? (
              <button
                type='button'
                onClick={handleConnect}
                className='flex items-center justify-center gap-1 rounded bg-emerald-500 px-2 py-1 text-xs text-white hover:bg-emerald-700 dark:bg-emerald-700 dark:hover:bg-emerald-500'
              >
                <FontAwesomeIcon icon={faBluetooth} />
                <span className='font-bold'>Scan for Devices</span>
              </button>
            ) : null}
          </div>
        </div>
      </Header>
      <main className='flex grow flex-col safe-x safe-b'>
        <div className='flex grow flex-col items-stretch justify-start gap-4 px-4 py-2'>
          <div className='flex flex-col gap-4'>
            <div className='flex items-center justify-end gap-8'>
              <span className='text-5xl font-bold tabular-nums'>
                {Number(latest?.value ?? 0).toFixed(0)}
              </span>
              <animated.span style={pulse} className='text-6xl text-red-500'>
                <FontAwesomeIcon icon={faHeart} />
              </animated.span>
            </div>
            <HeartRateChart data={state.data} />
          </div>
          {!supported && state.data.length ? (
            <div className='text-xs'>
              <p>
                This demo is running simulated heart rate data as{' '}
                {platform.description} does not support:
              </p>
              <ul className='underline'>
                <li>
                  <a
                    href='https://caniuse.com/web-bluetooth'
                    target='_blank'
                    rel='noopener noreferrer'
                  >
                    Web Bluetooth
                  </a>
                </li>
              </ul>
            </div>
          ) : null}
        </div>
      </main>
    </>
  )
}

export default Main
