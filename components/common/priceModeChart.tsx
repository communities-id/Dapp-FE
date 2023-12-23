import { FC } from 'react'

import LinearChart, { Markers } from '@/components/chart/linear'

import { priceModeFormulaMap, calcCurrentMintPrice } from '@/utils/formula'
import { formatDecimalsPrice, formatToDecimal, formatLocaleDecimalsNumber } from '@/utils/format'

import { PriceMode, CommunityPrice } from '@/types/contract'

interface Props {
  name?: string
  params: CommunityPrice<string>
  labels?: number[]
  values?: number[]
  height?: number
  colors?: string[]
  markerSymbol?: string
  currentLabel?: number
  hiddenMarkers?: boolean
}

const PriceModeChart: FC<Props> = ({ name = 'price-chart', params, height = 200, colors = ['#883FFF'], labels = [0, 1000, 2000, 3000, 4000, 5000, 6000], values, markerSymbol = 'Token', currentLabel = 1, hiddenMarkers }) => {

  const datasetsValues = values || labels.map(x => {
    // price is the final price of multiple days
    return Number(formatLocaleDecimalsNumber(formatToDecimal(calcCurrentMintPrice(x, { ...params }).price, 0, 6)))
  })

  const currentPrice = formatLocaleDecimalsNumber(formatToDecimal(calcCurrentMintPrice(currentLabel, { ...params }).price, 0, 6))

  const markers: Markers = [{
    label: `Current Price ≈ ${formatDecimalsPrice(currentPrice, 6)} ${markerSymbol}`,
    value: Number(currentPrice),
    options: {
      labelPos: 'left',
    }
  }]

  return (
    <LinearChart
      key={name}
      height={height}
      labels={labels}
      colors={colors}
      datasets={[
        {
          name: 'per year',
          type: 'line',
          values: datasetsValues,
        },
      ]}
      markers={hiddenMarkers ? undefined : markers}
      // yRegion={{
      //   label: 'Mint Price',
      //   start: 0,
      //   end: values[values.length - 1]
      // }}
      markerSymbol={markerSymbol}
    />
  )
}

export default PriceModeChart