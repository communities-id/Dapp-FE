import { ChainIDs, mainnetCommunitiesIDInput, CONTRACT_MAP as contractMap } from '@communitiesid/id'

import { getAlchemyHost, getQuickNodeHost } from '@/utils/provider'

import { ContractAddresses } from '@/types/contract'

const CHAIN_ID = ChainIDs.Ethereum

const MAIN_CHAIN = 'Ethereum'
const MAIN_CHAIN_ID = ChainIDs.Ethereum
const OMNINODE_PROTECT_TIME = 10 * 60 * 1000;

// to do: multiple chain
const CHAIN_ID_MAP: Record<string, number> = {
  Ethereum: ChainIDs.Ethereum,
  Polygon: ChainIDs.Polygon,
  Base: ChainIDs.Base,
  BSC: ChainIDs.BSC,
  Optimism: ChainIDs.OP,
  Scroll: ChainIDs.Scroll,
  Astar: ChainIDs.Astar
}

// 跨链 链id
const CHAINS_NETWORK_TO_ID = CHAIN_ID_MAP

const idToNetworkMap: Record<number, string> =
  Object.keys(CHAIN_ID_MAP).reduce((acc, cur) => {
    acc[CHAIN_ID_MAP[cur]] = cur
    return acc
  }, {} as Record<number, string>)

const CHAINS_ID_TO_NETWORK = idToNetworkMap

const DEFAULT_TOKEN_SYMBOL: Record<number, string> = {
  [CHAIN_ID_MAP.Ethereum]: 'ETH',
  [CHAIN_ID_MAP.Polygon]: 'MATIC',
  [CHAIN_ID_MAP.Base]: 'ETH',
  [CHAIN_ID_MAP.BSC]: 'BNB',
  [CHAIN_ID_MAP.Optimism]: 'ETH',
  [CHAIN_ID_MAP.Scroll]: 'ETH',
  [CHAIN_ID_MAP.Astar]: 'ASTR'
}

const SCAN_MAP: Record<number, string> = {
  [CHAIN_ID_MAP.Ethereum]: 'https://etherscan.io',
  [CHAIN_ID_MAP.Polygon]: 'https://polygonscan.com/',
  [CHAIN_ID_MAP.Base]: 'https://basescan.org/',
  [CHAIN_ID_MAP.BSC]: 'https://bscscan.com/',
  [CHAIN_ID_MAP.Optimism]: 'https://optimistic.etherscan.io/',
  [CHAIN_ID_MAP.Scroll]: 'https://scrollscan.com',
  [CHAIN_ID_MAP.Astar]: 'https://astar.subscan.io'
}

const CHAINS_MINT_TOOLTIPS: Record<number, string> = {
  [CHAIN_ID_MAP.Ethereum]: 'Please be aware that deploying the Brand DID contract on ETH may result in higher gas fees for minting User DIDs.',
  [CHAIN_ID_MAP.Polygon]: 'Communities ID is an omnichain protocol.\nDeploying on this network requires payment of cross-chain protocol fees.\nCommunities ID does not profit from cross-chain protocol fees!"',
  [CHAIN_ID_MAP.Base]: 'Communities ID is an omnichain protocol.\nDeploying on this network requires payment of cross-chain protocol fees.\nCommunities ID does not profit from cross-chain protocol fees!"',
  [CHAIN_ID_MAP.BSC]: 'Communities ID is an omnichain protocol.\nDeploying on this network requires payment of cross-chain protocol fees.\nCommunities ID does not profit from cross-chain protocol fees!"',
  [CHAIN_ID_MAP.Optimism]: 'Communities ID is an omnichain protocol.\nDeploying on this network requires payment of cross-chain protocol fees.\nCommunities ID does not profit from cross-chain protocol fees!"',
  [CHAIN_ID_MAP.Scroll]: 'Communities ID is an omnichain protocol.\nDeploying on this network requires payment of cross-chain protocol fees.\nCommunities ID does not profit from cross-chain protocol fees!"',
  [CHAIN_ID_MAP.Astar]: 'Communities ID is an omnichain protocol.\nDeploying on this network requires payment of cross-chain protocol fees.\nCommunities ID does not profit from cross-chain protocol fees!"'
}

const contractAddresses = contractMap(false)
const CONTRACT_ADDRESS_MAINNET = contractAddresses[ChainIDs.Ethereum] as ContractAddresses
const CONTRACT_ADDRESS_POLYGON = contractAddresses[ChainIDs.Polygon] as ContractAddresses
const CONTRACT_ADDRESS_BASE = contractAddresses[ChainIDs.Base] as ContractAddresses
const CONTRACT_ADDRESS_OP = contractAddresses[ChainIDs.OP] as ContractAddresses
const CONTRACT_ADDRESS_BSC = contractAddresses[ChainIDs.BSC] as ContractAddresses
const CONTRACT_ADDRESS_SCROLL = contractAddresses[ChainIDs.Scroll] as ContractAddresses
const CONTRACT_ADDRESS_ASTAR = contractAddresses[ChainIDs.Astar] as ContractAddresses

const CONTRACT_MAP: Record<number, ContractAddresses> = {
  [CHAIN_ID_MAP.Ethereum]: CONTRACT_ADDRESS_MAINNET,
  [CHAIN_ID_MAP.Polygon]: CONTRACT_ADDRESS_POLYGON,
  [CHAIN_ID_MAP.Base]: CONTRACT_ADDRESS_BASE,
  [CHAIN_ID_MAP.BSC]: CONTRACT_ADDRESS_BSC,
  [CHAIN_ID_MAP.Optimism]: CONTRACT_ADDRESS_OP,
  [CHAIN_ID_MAP.Scroll]: CONTRACT_ADDRESS_SCROLL,
  [CHAIN_ID_MAP.Astar]: CONTRACT_ADDRESS_ASTAR,
}

const config =  {
  CHAIN_ID,
  MAIN_CHAIN,
  MAIN_CHAIN_ID,
  OMNINODE_PROTECT_TIME,
  CHAIN_ID_MAP,
  CHAINS_NETWORK_TO_ID,
  CHAINS_ID_TO_NETWORK,
  CONTRACT_MAP,
  DEFAULT_TOKEN_SYMBOL,
  SCAN_MAP,
  CHAINS_MINT_TOOLTIPS,
}

export default config