import React, { useEffect } from 'react'
import { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHeart } from '@fortawesome/free-solid-svg-icons'
import { useSpring, animated } from '@react-spring/web'

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
    from: { scale: 1 },
    to: { scale: 1.2 }
  }))

  useEffect(() => {
    spring_api.start({
      from: { scale: 1 },
      to: { scale: 1.2 }
    })
  }, [data])

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
          {data[data.length - 1]?.value ? (
            <div className='heart-rate'>
              <animated.span className='heart-rate-icon' style={spring}>
                <FontAwesomeIcon icon={faHeart} />
              </animated.span>
              <span className='heart-rate-value'>
                {data[data.length - 1].value}
              </span>
            </div>
          ) : null}
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

export default HeartRate
