import React from 'react'
import { useState } from 'react'
import { Button } from '@fluentui/react-components'

const HeartRate = () => {
  const [heart_rate_measurement, set_heart_rate_measurement] = useState(0)

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
  }

  return (
    <div>
      <Button appearance='primary' onClick={handle_connect}>
        Connect
      </Button>
      <p>HR: {heart_rate_measurement}</p>
    </div>
  )
}

export default HeartRate
