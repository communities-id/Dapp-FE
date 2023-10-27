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
  Scroll: ChainIDs.Scroll
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
  [CHAIN_ID_MAP.Scroll]: 'ETH'
}

const SCAN_MAP: Record<number, string> = {
  [CHAIN_ID_MAP.Ethereum]: 'https://etherscan.io',
  [CHAIN_ID_MAP.Polygon]: 'https://polygonscan.com/',
  [CHAIN_ID_MAP.Base]: 'https://basescan.org/',
  [CHAIN_ID_MAP.BSC]: 'https://bscscan.com/',
  [CHAIN_ID_MAP.Optimism]: 'https://optimistic.etherscan.io/',
  [CHAIN_ID_MAP.Scroll]: 'https://scrollscan.com'
}

const CHAINS_MINT_TOOLTIPS: Record<number, string> = {
  [CHAIN_ID_MAP.Ethereum]: 'Please be aware that deploying the Brand DID contract on ETH may result in higher gas fees for minting User DIDs.',
  [CHAIN_ID_MAP.Polygon]: 'Communities ID is an omnichain protocol.\nDeploying on this network requires payment of cross-chain protocol fees.\nCommunities ID does not profit from cross-chain protocol fees!"',
  [CHAIN_ID_MAP.Base]: 'Communities ID is an omnichain protocol.\nDeploying on this network requires payment of cross-chain protocol fees.\nCommunities ID does not profit from cross-chain protocol fees!"',
  [CHAIN_ID_MAP.BSC]: 'Communities ID is an omnichain protocol.\nDeploying on this network requires payment of cross-chain protocol fees.\nCommunities ID does not profit from cross-chain protocol fees!"',
  [CHAIN_ID_MAP.Optimism]: 'Communities ID is an omnichain protocol.\nDeploying on this network requires payment of cross-chain protocol fees.\nCommunities ID does not profit from cross-chain protocol fees!"',
  [CHAIN_ID_MAP.Scroll]: 'Communities ID is an omnichain protocol.\nDeploying on this network requires payment of cross-chain protocol fees.\nCommunities ID does not profit from cross-chain protocol fees!"'
}

const contractAddresses = contractMap(false)
const CONTRACT_ADDRESS_MAINNET = contractAddresses[1] as ContractAddresses
const CONTRACT_ADDRESS_POLYGON = contractAddresses[137] as ContractAddresses
const CONTRACT_ADDRESS_BASE = contractAddresses[8453] as ContractAddresses
const CONTRACT_ADDRESS_OP = contractAddresses[10] as ContractAddresses
const CONTRACT_ADDRESS_BSC = contractAddresses[56] as ContractAddresses
const CONTRACT_ADDRESS_SCROLL = contractAddresses[534352] as ContractAddresses

const CONTRACT_MAP: Record<number, ContractAddresses> = {
  [CHAIN_ID_MAP.Ethereum]: CONTRACT_ADDRESS_MAINNET,
  [CHAIN_ID_MAP.Polygon]: CONTRACT_ADDRESS_POLYGON,
  [CHAIN_ID_MAP.Base]: CONTRACT_ADDRESS_BASE,
  [CHAIN_ID_MAP.BSC]: CONTRACT_ADDRESS_BSC,
  [CHAIN_ID_MAP.Optimism]: CONTRACT_ADDRESS_OP,
  [CHAIN_ID_MAP.Scroll]: CONTRACT_ADDRESS_SCROLL
}

const SDK_OPTIONS: mainnetCommunitiesIDInput = {
  openseaKey: 'bbf06a664d3c450692c73a8bc300cf25',
  Ethereum: {
    RPCUrl: getAlchemyHost(CHAIN_ID_MAP.Ethereum),
  },
  Polygon: {
    RPCUrl: getAlchemyHost(CHAIN_ID_MAP.Polygon),
  },
  Base: {
    RPCUrl: getAlchemyHost(CHAIN_ID_MAP.Base),
  },
  OP: {
    RPCUrl: getAlchemyHost(CHAIN_ID_MAP.Optimism),
  },
  BSC: {
    RPCUrl: getQuickNodeHost(CHAIN_ID_MAP.BSC),
  },
  Scroll: {
    RPCUrl: getQuickNodeHost(CHAIN_ID_MAP.Scroll),
  },
  arbitrum: {
    RPCUrl: 'https://arb1.arbitrum.io/rpc'
  }
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
  SDK_OPTIONS
}

export default config