import { FC, useMemo } from 'react'
import classnames from 'classnames'

import EthereumSvg from '~@/icons/chain/ethereum.svg'

import { TotalSupportedChainIDs } from '@/types/chain'

interface Props {
  size?: number
  wrapperSize?: number
  chainId: number
  colorMode?: boolean
  className?: string
}

const ChainIcon: FC<Props> = ({ size = 24, wrapperSize = 0, colorMode, chainId, className }) => {
  const EthereumIcon = (
    <div
      className={classnames('flex items-center justify-center text-white', { 'bg-[#6F7BBA]': colorMode }, className)}
      style={{ width: wrapperSize, height: wrapperSize, padding: wrapperSize ? `${(wrapperSize - size) / 2 - 1}px` : 0 }}
    >
      <EthereumSvg width={size + 2} height={size + 2} />
    </div>
  )
  const BaseIcon = (
    <img alt='base chain logo' width={wrapperSize} height={wrapperSize} src='/icons/chain/base.svg' />
  )
  const PolygonIcon = (
    <img alt='polygon chain logo' width={wrapperSize} height={wrapperSize} src='/icons/chain/polygon.svg' />
  )
  const OPIcon = (
    <img alt='op chain logo' width={wrapperSize} height={wrapperSize} src='/icons/chain/op.svg' />
  )
  const BSCIcon = (
    <img alt='op chain logo' width={wrapperSize} height={wrapperSize} src='/icons/chain/bsc.svg' />
  )
  const ScrollIcon = (
    <img alt='scroll chain logo' width={wrapperSize} height={wrapperSize} src='/icons/chain/scroll.svg' />
  )
  const AstarIcon = (
    <img alt='astar chain logo' width={wrapperSize} height={wrapperSize} src='/icons/chain/astar.svg' />
  )
  const chainIcons: Record<TotalSupportedChainIDs, any> = useMemo(() => {
    return {
      1: EthereumIcon,
      10: OPIcon,
      56: BSCIcon,
      137: PolygonIcon,
      8453: BaseIcon,
      534352: ScrollIcon,
      5: EthereumIcon,
      80001: PolygonIcon,
      84531: BaseIcon,
      420: OPIcon,
      97: BSCIcon,
      534351: ScrollIcon,
      81: AstarIcon,
    }
  }, [chainId, size, className])
  return chainIcons[chainId as TotalSupportedChainIDs] || null
}

export default ChainIcon