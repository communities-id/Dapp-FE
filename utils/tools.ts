import { CHAIN_ID, CONTRACT_MAP, MAIN_CHAIN_ID } from '@/shared/constant'

import { TotalSupportedChainIDs } from '@/types/chain'
import { ContractVerison } from '@/types/contract'
import { CommunityInfo } from '@/types'
import { ChainIDs, TestnetChainIDs } from '@communitiesid/id'

export const sleep = (ms: number) => {
  return new Promise((resolve) => {
    setTimeout(resolve, ms)
  })
}

// to do: Does not support scroll mainnet chain NFT assets in OpenSea
const chainMap: Record<TotalSupportedChainIDs, string> = {
  [ChainIDs.Ethereum]: 'ethereum',
  [ChainIDs.OP]: 'optimism',
  [ChainIDs.BSC]: 'bsc',
  [ChainIDs.Polygon]: 'matic',
  [ChainIDs.Base]: 'base',
  [ChainIDs.Scroll]: '',
  [TestnetChainIDs.Goerli]: 'goerli',
  [TestnetChainIDs['BNB Smart Chain Testnet']]: 'bsc-testnet',
  [TestnetChainIDs['Optimism Goerli Testnet']]: 'optimism-goerli',
  [TestnetChainIDs['Polygon Mumbai']]: 'mumbai',
  [TestnetChainIDs['Base Goerli Testnet']]: 'base-goerli',
  [TestnetChainIDs['Scroll Sepolia Testnet']]: '',
  [TestnetChainIDs['Shibuya Testnet']]: '',
}

const openseaHosts: Record<TotalSupportedChainIDs, string> = {
  [ChainIDs.Ethereum]: 'opensea.io',
  [ChainIDs.OP]: 'opensea.io',
  [ChainIDs.BSC]: 'opensea.io',
  [ChainIDs.Polygon]: 'opensea.io',
  [ChainIDs.Base]: 'opensea.io',
  [ChainIDs.Scroll]: 'opensea.io',
  [TestnetChainIDs.Goerli]: 'testnets.opensea.io',
  [TestnetChainIDs['BNB Smart Chain Testnet']]: 'testnets.opensea.io',
  [TestnetChainIDs['Optimism Goerli Testnet']]: 'testnets.opensea.io',
  [TestnetChainIDs['Polygon Mumbai']]: 'testnets.opensea.io',
  [TestnetChainIDs['Base Goerli Testnet']]: 'testnets.opensea.io',
  [TestnetChainIDs['Scroll Sepolia Testnet']]: 'testnets.opensea.io',
  [TestnetChainIDs['Shibuya Testnet']]: '',
}

const getOpenseaHost = () => {
  return openseaHosts[CHAIN_ID] || 'opensea.io'
}

export const getOpenseaLink = (contractAddress: string, chainId: number, tokenId?: number) => {
  if (!chainMap[chainId as TotalSupportedChainIDs]) return ''
  return tokenId ? `https://${getOpenseaHost()}/assets/${chainMap[chainId as TotalSupportedChainIDs]}/${contractAddress}/${tokenId}` : `https://${getOpenseaHost()}/assets/${chainMap[chainId as TotalSupportedChainIDs]}/${contractAddress}`
}

// @param chainId: multiple chain id
export const getCommunityOpenseaLink = (chainId: number, tokenId: number) => {
  if (!chainMap[chainId as TotalSupportedChainIDs]) return ''
  const contacts = CONTRACT_MAP[chainId]
  if (!contacts) return ''
  return `https://${getOpenseaHost()}/assets/${chainMap[chainId as TotalSupportedChainIDs]}/${contacts.CommunityRegistry}/${tokenId}`
}

// export const getCIDOpenseaLink = () => {
//   if (typeof window === 'undefined') return ''
//   const contacts = CONTRACT_MAP[MAIN_CHAIN_ID]
//   return `https://${getOpenseaHost()}/assets/${chainMap[CHAIN_ID]}/${contacts.CommunityRegistry}`
// }

/**
 * V1
 * V2: upgrade: durationUnit
 * V3: upgrade: burnAnytime
 * @param info 
 * @returns 
 */
export const verifyContractVersion = (info: Partial<CommunityInfo>): ContractVerison => {
  if (info.config?.burnAnytime !== undefined && info.config?.durationUnit !== undefined) return ContractVerison.V3
  if (info.config?.burnAnytime === undefined) return ContractVerison.V2
  return ContractVerison.V1
}

export const isLink = (link: string) => {
  return link.match(/http(s)?:\/\//)
}