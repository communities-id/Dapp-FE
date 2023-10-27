import { CHAIN_ID, CONTRACT_MAP, MAIN_CHAIN_ID } from '@/shared/constant'

import { TotalSupportedChainIDs } from '@/types/chain'
import { ContractVerison } from '@/types/contract'
import { CommunityInfo } from '@/types'

export const sleep = (ms: number) => {
  return new Promise((resolve) => {
    setTimeout(resolve, ms)
  })
}

// to do: Does not support scroll mainnet chain NFT assets in OpenSea
const chainMap: Record<TotalSupportedChainIDs, string> = {
  1: 'ethereum',
  10: 'optimism',
  56: 'bsc',
  137: 'matic',
  8453: 'base',
  // 534352: 'scroll',
  534352: '',
  5: 'goerli',
  97: 'bsc-testnet',
  420: 'optimism-goerli',
  80001: 'mumbai',
  84531: 'base-goerli',
  534351: ''
}

const openseaHosts: Record<TotalSupportedChainIDs, string> = {
  1: 'opensea.io',
  10: 'opensea.io',
  137: 'opensea.io',
  56: 'opensea.io',
  8453: 'opensea.io',
  534352: 'opensea.io',
  5: 'testnets.opensea.io',
  97: 'testnets.opensea.io',
  420: 'testnets.opensea.io',
  80001: 'testnets.opensea.io',
  84531: 'testnets.opensea.io',
  534351: 'testnets.opensea.io'
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