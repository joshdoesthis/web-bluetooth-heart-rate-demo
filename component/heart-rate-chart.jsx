import { useEffect, useRef, useState } from 'react'

const BARS = 100
const HEIGHT = 100

const useElementWidth = ref => {
  const [width, setWidth] = useState(0)

  useEffect(() => {
    if (!ref.current) return
    const observer = new ResizeObserver(([entry]) =>
      setWidth(entry.contentRect.width)
    )
    observer.observe(ref.current)
    return () => observer.disconnect()
  }, [ref])

  return width
}

// One bar per reading, newest on the right, scaled so the highest reading
// fills the chart.
const HeartRateChart = ({ data }) => {
  const ref = useRef(null)
  const width = useElementWidth(ref)
  const readings = data.slice(-BARS)
  const barWidth = width / BARS
  const max = Math.max(1, ...readings.map(d => d.value))

  return (
    <div ref={ref}>
      <svg
        width={width}
        height={HEIGHT}
        role='img'
        aria-label={`Heart rate over the last ${readings.length} readings`}
      >
        {readings.map((d, i) => {
          const barHeight = Math.round((d.value / max) * HEIGHT)
          return (
            <rect
              key={i}
              x={width - (readings.length - i) * barWidth}
              y={HEIGHT - barHeight}
              width={barWidth}
              height={barHeight}
              className='fill-zinc-300 dark:fill-zinc-700'
            />
          )
        })}
      </svg>
    </div>
  )
}

export default HeartRateChart
