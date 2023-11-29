import { FC, useEffect, useRef, useState } from 'react'

import { Chart, Marker, Region } from 'frappe-charts'

import { formatToDecimal } from '@/utils/format'

export type Markers = Marker[]
interface Props {
  title?: string
  labels: (number | string)[]
  datasets: {
    name: string
    type: string
    values: number[]
  }[]
  yRegion?: {
    label?: string
    start?: number
    end?: number
  }
  markerSymbol?: string
  colors?: string[]
  height?: number;
  marginTop?: number;
  marginRight?: number;
  marginBottom?: number;
  marginLeft?: number;
  spline?: number;
  markers?: Markers
}

const LinearChart: FC<Props> = ({
  title,
  labels,
  datasets,
  yRegion,
  markerSymbol = 'ETH',
  height = 250,
  colors,
  spline = 1,
  markers = undefined
}) => {
  const chartEl = useRef<HTMLDivElement>(null)
  const [chart, setChart] = useState<Chart>()

  const maxVal = datasets[0].values[datasets[0].values.length - 1]
  const endVal = Math.ceil(maxVal) === maxVal ? maxVal * 2 : Math.ceil(maxVal)

  const yMarkers = markers
  const yRegions: Region[] = [{
    label: 'Mint Price / x', start: 0, end: endVal
  }]

  useEffect(() => {
    if (!chartEl.current) return
    chartEl.current.innerHTML = ''

    const chart = new Chart(chartEl.current, {
      title,
      data: {
        labels,
        datasets,
        yMarkers,
        yRegions
      },
      type: "axis-mixed", // or 'bar', 'line', 'scatter', 'pie', 'percentage'
      height,
      colors: colors ?? ["#883FFF"],
      tooltipOptions: {
        formatTooltipX: (d) => `UserID: ${d}`,
        formatTooltipY: (d) => `&#8776 ${formatToDecimal(d, 0, 8)} ${markerSymbol}`
      },
      lineOptions: {
        spline
      },
      axisOptions: {
        xAxisMode: "tick",
      },
      barOptions: {
        spaceRatio: 0.5
      }
    })
    setChart(chart)
  }, [chartEl, markerSymbol])

  useEffect(() => {
    if (!chart) return
    chart.update({
      labels,
      datasets,
      yMarkers,
      yRegions
    })
  }, [chart, labels, datasets])
  return <div className='cid-price-chart' ref={chartEl}></div>
}

export default LinearChart
