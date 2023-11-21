import { FC, useMemo } from 'react'
import classnames from 'classnames'

import EthereumSvg from '~@/icons/chain/ethereum.svg'

import { TotalSupportedChainIDs } from '@/types/chain'
import { ChainIDs, TestnetChainIDs } from '@communitiesid/id'

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
      [ChainIDs.Ethereum]: EthereumIcon,
      [ChainIDs.OP]: OPIcon,
      [ChainIDs.BSC]: BSCIcon,
      [ChainIDs.Polygon]: PolygonIcon,
      [ChainIDs.Base]: BaseIcon,
      [ChainIDs.Scroll]: ScrollIcon,
      [ChainIDs.Astar]: AstarIcon,
      [TestnetChainIDs.Goerli]: EthereumIcon,
      [TestnetChainIDs['Polygon Mumbai']]: PolygonIcon,
      [TestnetChainIDs['Base Goerli Testnet']]: BaseIcon,
      [TestnetChainIDs['Optimism Goerli Testnet']]: OPIcon,
      [TestnetChainIDs['BNB Smart Chain Testnet']]: BSCIcon,
      [TestnetChainIDs['Scroll Sepolia Testnet']]: ScrollIcon,
      [TestnetChainIDs['zKatana Testnet']]: AstarIcon,
    }
  }, [chainId, size, className])
  return chainIcons[chainId as TotalSupportedChainIDs] || null
}

export default ChainIcon