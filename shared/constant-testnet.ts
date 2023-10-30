//test net
import { CommunitiesIDInput, CONTRACT_MAP as contractMap } from "@communitiesid/id";

import { getAlchemyHost, getQuickNodeHost, getSDKOptions } from '@/utils/provider'

import { TestnetChainIDs } from '@communitiesid/id'
import { ContractAddresses } from '@/types/contract'

const CHAIN_ID = TestnetChainIDs.Goerli

const MAIN_CHAIN = 'Goerli'
const MAIN_CHAIN_ID = TestnetChainIDs.Goerli
const OMNINODE_PROTECT_TIME = 10 * 60 * 1000;

// to do: multiple chain
const CHAIN_ID_MAP: Record<string, number> = {
  Goerli: TestnetChainIDs.Goerli,
  "Polygon Mumbai": TestnetChainIDs["Polygon Mumbai"],
  'Base Goerli Testnet': TestnetChainIDs["Base Goerli Testnet"],
  'BNB Smart Chain Testnet': TestnetChainIDs['BNB Smart Chain Testnet'],
  'Optimism Goerli Testnet': TestnetChainIDs['Optimism Goerli Testnet'],
  'Scroll Sepolia Testnet': TestnetChainIDs['Scroll Sepolia Testnet'],
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
  [CHAIN_ID_MAP.Goerli]: 'GoerliETH',
  [CHAIN_ID_MAP["Polygon Mumbai"]]: 'MATIC',
  [CHAIN_ID_MAP['Base Goerli Testnet']]: 'ETH',
  [CHAIN_ID_MAP['BNB Smart Chain Testnet']]: 'tBNB',
  [CHAIN_ID_MAP['Optimism Goerli Testnet']]: 'ETH',
  [CHAIN_ID_MAP['Scroll Sepolia Testnet']]: 'ETH'
}

const SCAN_MAP: Record<number, string> = {
  [CHAIN_ID_MAP.Goerli]: 'https://goerli.etherscan.io',
  [CHAIN_ID_MAP["Polygon Mumbai"]]: 'https://mumbai.polygonscan.com',
  [CHAIN_ID_MAP['Base Goerli Testnet']]: 'https://goerli.basescan.org/',
  [CHAIN_ID_MAP['BNB Smart Chain Testnet']]: 'https://testnet.bscscan.com/',
  [CHAIN_ID_MAP['Optimism Goerli Testnet']]: 'https://goerli-optimism.etherscan.io/',
  [CHAIN_ID_MAP['Scroll Sepolia Testnet']]: 'https://sepolia.scrollscan.dev/'
}

const CHAINS_MINT_TOOLTIPS: Record<number, string> = {
  [CHAIN_ID_MAP.Goerli]: 'Please be aware that deploying the Brand DID contract on ETH may result in higher gas fees for minting User DIDs.',
  [CHAIN_ID_MAP["Polygon Mumbai"]]: 'Communities ID is an omnichain protocol.\nDeploying on this network requires payment of cross-chain protocol fees.\nCommunities ID does not profit from cross-chain protocol fees!"',
  [CHAIN_ID_MAP['Base Goerli Testnet']]: 'Communities ID is an omnichain protocol.\nDeploying on this network requires payment of cross-chain protocol fees.\nCommunities ID does not profit from cross-chain protocol fees!"',
  [CHAIN_ID_MAP['BNB Smart Chain Testnet']]: 'Communities ID is an omnichain protocol.\nDeploying on this network requires payment of cross-chain protocol fees.\nCommunities ID does not profit from cross-chain protocol fees!"',
  [CHAIN_ID_MAP['Optimism Goerli Testnet']]: 'Communities ID is an omnichain protocol.\nDeploying on this network requires payment of cross-chain protocol fees.\nCommunities ID does not profit from cross-chain protocol fees!"',
  [CHAIN_ID_MAP['Scroll Sepolia Testnet']]: 'Communities ID is an omnichain protocol.\nDeploying on this network requires payment of cross-chain protocol fees.\nCommunities ID does not profit from cross-chain protocol fees!"'
}

const contractAddresses = contractMap(true)

const CONTRACT_ADDRESS_GOERLI = contractAddresses[5] as ContractAddresses
const CONTRACT_ADDRESS_MUMBAI = contractAddresses[80001] as ContractAddresses
const CONTRACT_ADDRESS_BASE_GOERLI = contractAddresses[84531] as ContractAddresses
const CONTRACT_ADDRESS_OP_GOERLI = contractAddresses[420] as ContractAddresses
const CONTRACT_ADDRESS_BSC_TESTNET = contractAddresses[97] as ContractAddresses
const CONTRACT_ADDRESS_SCROLL_SEPOLIA_TESTNET = contractAddresses[534351] as ContractAddresses

const CONTRACT_MAP: Record<number, ContractAddresses> = {
  [CHAIN_ID_MAP.Goerli]: CONTRACT_ADDRESS_GOERLI,
  [CHAIN_ID_MAP["Polygon Mumbai"]]: CONTRACT_ADDRESS_MUMBAI,
  [CHAIN_ID_MAP['Base Goerli Testnet']]: CONTRACT_ADDRESS_BASE_GOERLI,
  [CHAIN_ID_MAP['Optimism Goerli Testnet']]: CONTRACT_ADDRESS_OP_GOERLI,
  [CHAIN_ID_MAP['BNB Smart Chain Testnet']]: CONTRACT_ADDRESS_BSC_TESTNET,
  [CHAIN_ID_MAP['Scroll Sepolia Testnet']]: CONTRACT_ADDRESS_SCROLL_SEPOLIA_TESTNET
}

const config = {
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