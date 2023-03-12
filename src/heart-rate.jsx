import React from 'react'
import { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHeart } from '@fortawesome/free-solid-svg-icons'

const HeartRate = () => {
  const [heart_rate_measurement, set_heart_rate_measurement] = useState(0)
  const [device, set_device] = useState({})

  const handle_heart_rate_measurement = e => {
    const value = e.target.value
    const flags = value.getUint8(0)
    const rate_16_bits = flags & 0x1
    const heart_rate = rate_16_bits
      ? value.getUint16(1, true)
      : value.getUint8(1)
    set_heart_rate_measurement(heart_rate)
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

      set_device({})
      set_heart_rate_measurement(0)
    }
  }

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
          <div className='heart-rate'>
            <span className='heart-rate-icon'>
              <FontAwesomeIcon icon={faHeart} />
            </span>
            <span className='heart-rate-value'>{heart_rate_measurement}</span>
          </div>
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
