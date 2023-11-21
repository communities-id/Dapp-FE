import { ethers } from "ethers"

import { TestnetChainIDs, ChainIDs, CommunitiesIDInput } from '@communitiesid/id'
import { TotalSupportedChainIDs, RPCKeys } from "@/types/chain"

// const alchemyNetworksWl = [ChainIDs.Ethereum, ChainIDs.Polygon, ChainIDs.OP, TestnetChainIDs.Goerli, TestnetChainIDs["Polygon Mumbai"], TestnetChainIDs["Optimism Goerli Testnet"]]
const quickNodeNetworksWl = [ChainIDs.BSC, TestnetChainIDs['BNB Smart Chain Testnet'], ChainIDs.Scroll, TestnetChainIDs['Scroll Sepolia Testnet']]
const constantsNetworksWl = [ChainIDs.Astar, TestnetChainIDs["zKatana Testnet"]]

export const parseRPCKeys = (rpcKeys: string): Record<'alchemy' | 'quickNode', Record<TotalSupportedChainIDs, string[]>> => {
  const { alchemy, quickNode } = JSON.parse(rpcKeys) as RPCKeys
  return {
    alchemy: Object.fromEntries(Object.entries(alchemy).map(([key, value]) => [Number(key), value])) as Record<TotalSupportedChainIDs, string[]>,
    quickNode: Object.fromEntries(Object.entries(quickNode).map(([key, value]) => [Number(key), value])) as Record<TotalSupportedChainIDs, string[]>
  }
}

const { alchemy: alchemyKeys, quickNode: quickNodeKeys } = parseRPCKeys(process.env.NEXT_PUBLIC_RPC_KEYS ?? '{}')

export const constantsHosts: Partial<Record<TotalSupportedChainIDs, string[]>> = {
  [ChainIDs.Astar]: ['https://evm.astar.network'],
  [TestnetChainIDs["zKatana Testnet"]]: ['https://rpc.startale.com/zkatana'],
}

export const quickNodeHosts: Record<TotalSupportedChainIDs, string> = {
  [ChainIDs.Ethereum]: '',
  [ChainIDs.OP]: '',
  [ChainIDs.BSC]: 'white-thrilling-daylight.bsc',
  [ChainIDs.Polygon]: '',
  [ChainIDs.Base]: '',
  [ChainIDs.Scroll]: 'omniscient-dimensional-shadow.scroll-mainnet',
  [ChainIDs.Astar]: '',
  [TestnetChainIDs.Goerli]: '',
  [TestnetChainIDs["Optimism Goerli Testnet"]]: '',
  [TestnetChainIDs["BNB Smart Chain Testnet"]]: 'necessary-alpha-owl.bsc-testnet',
  [TestnetChainIDs["Polygon Mumbai"]]: '',
  [TestnetChainIDs["Base Goerli Testnet"]]: '',
  [TestnetChainIDs["Scroll Sepolia Testnet"]]: 'wild-long-film.scroll-testnet',
  [TestnetChainIDs["zKatana Testnet"]]: '',
}

export const alchemyHosts: Record<TotalSupportedChainIDs, string> = {
  [ChainIDs.Ethereum]: 'eth-mainnet',
  [ChainIDs.OP]: 'opt-mainnet',
  [ChainIDs.BSC]: 'bsc-mainnet',
  [ChainIDs.Polygon]: 'polygon-mainnet',
  [ChainIDs.Base]: 'base-mainnet',
  [ChainIDs.Scroll]: '',
  [ChainIDs.Astar]: 'astar-mainnet',
  [TestnetChainIDs.Goerli]: 'eth-goerli',
  [TestnetChainIDs["Optimism Goerli Testnet"]]: 'opt-goerli',
  [TestnetChainIDs["BNB Smart Chain Testnet"]]: 'bsc-testnet',
  [TestnetChainIDs["Polygon Mumbai"]]: 'polygon-mumbai',
  [TestnetChainIDs["Base Goerli Testnet"]]: 'base-goerli',
  [TestnetChainIDs["Scroll Sepolia Testnet"]]: '',
  [TestnetChainIDs["zKatana Testnet"]]: '',
}

export const getAlchemyKey = (network: number) => {
  const keys = alchemyKeys[network as TotalSupportedChainIDs] ?? []
  return keys[Math.floor(Math.random() * keys.length)] ?? ''
}

export const getAlchemyHost = (network: number, keys?: string[]) => {
  const _keys = keys ?? alchemyKeys[network as TotalSupportedChainIDs] ?? []
  const key = _keys[Math.floor(Math.random() * _keys.length)] ?? ''
  return `https:/\/${alchemyHosts[network as TotalSupportedChainIDs]}.g.alchemy.com/v2/${key}`
}

export const getAlchemyProvider = (network: number) => {
  return new ethers.providers.StaticJsonRpcProvider(getAlchemyHost(network as TotalSupportedChainIDs), network)
}

export const getQuickNodeKey = (network: number) => {
  const keys = quickNodeKeys[network as TotalSupportedChainIDs] ?? []
  return keys[Math.floor(Math.random() * keys.length)] ?? ''
}

export const getQuickNodeHost = (network: number, keys?: string[]) => {
  const _keys = keys ?? quickNodeKeys[network as TotalSupportedChainIDs] ?? []
  const key = _keys[Math.floor(Math.random() * _keys.length)] ?? ''
  return `https://${quickNodeHosts[network as TotalSupportedChainIDs]}.quiknode.pro/${key}/`
}

export const getQuickNodeProvider = (network: number) => {
  return new ethers.providers.StaticJsonRpcProvider(getQuickNodeHost(network as TotalSupportedChainIDs), network)
}

export const getConstantsHost = (network: number) => {
  const hosts = constantsHosts[network as TotalSupportedChainIDs] ?? []
  return hosts[Math.floor(Math.random() * hosts.length)] ?? ''
}

export const getConstantsProvider = (network: number) => {
  return new ethers.providers.StaticJsonRpcProvider(getConstantsHost(network as TotalSupportedChainIDs), network)
}

// export const getblockHost = (network: number) => {
//   return 'https://bsc.getblock.io/1a5ea93b-d342-48bd-85c2-754cdae87a19/testnet/'
// }

export const createProvider = (network: number) => {
  const providers = new Map<number, ethers.providers.StaticJsonRpcProvider>()
  return (() => {
    // providers cache
    if (providers.has(network)) return providers.get(network) as ethers.providers.StaticJsonRpcProvider
    
    if (quickNodeNetworksWl.includes(network)) {
      providers.set(network, getQuickNodeProvider(network))
    } else if (constantsNetworksWl.includes(network)) {
      providers.set(network, getConstantsProvider(network))
    } else {
      // alcemy provider
      providers.set(network, getAlchemyProvider(network))
    }

    return providers.get(network) as ethers.providers.StaticJsonRpcProvider
  })()
}

export const getSDKOptions = (rpcKeys = process.env.NEXT_PUBLIC_RPC_KEYS): CommunitiesIDInput => {
  const isTestnet = process.env.NEXT_PUBLIC_IS_TESTNET === 'true'
  const { alchemy, quickNode } = parseRPCKeys(rpcKeys ?? '{}')

  return isTestnet ? {
    isTestnet: true,
    openseaKey: process.env.NEXT_PUBLIC_OPENSEA_KEY ?? '',
    Goerli: {
      // RPCUrl: "https://goerli.infura.io/v3/4779964dc9704f6dbf8d63a1e0183ed6",
      RPCUrl: getAlchemyHost(TestnetChainIDs.Goerli, alchemy[TestnetChainIDs.Goerli]),
    },
    "Polygon Mumbai": {
      RPCUrl: getAlchemyHost(TestnetChainIDs['Polygon Mumbai'], alchemy[TestnetChainIDs['Polygon Mumbai']]),
    },
    'Base Goerli Testnet': {
      RPCUrl: getAlchemyHost(TestnetChainIDs['Base Goerli Testnet'], alchemy[TestnetChainIDs['Base Goerli Testnet']]),
    },
    'Optimism Goerli Testnet': {
      RPCUrl: getAlchemyHost(TestnetChainIDs['Optimism Goerli Testnet'], alchemy[TestnetChainIDs['Optimism Goerli Testnet']]),
    },
    'BNB Smart Chain Testnet': {
      RPCUrl: getQuickNodeHost(TestnetChainIDs['BNB Smart Chain Testnet'], quickNode[TestnetChainIDs['BNB Smart Chain Testnet']]),
    },
    'Scroll Sepolia Testnet': {
      RPCUrl: getQuickNodeHost(TestnetChainIDs['Scroll Sepolia Testnet'], quickNode[TestnetChainIDs['Scroll Sepolia Testnet']]),
    },
    'zKatana Testnet': {
      RPCUrl: getConstantsHost(TestnetChainIDs["zKatana Testnet"]),
    }
  } : {
    openseaKey: process.env.NEXT_PUBLIC_OPENSEA_KEY ?? '',
    Ethereum: {
      RPCUrl: getAlchemyHost(ChainIDs.Ethereum, alchemy[ChainIDs.Ethereum]),
    },
    Polygon: {
      RPCUrl: getAlchemyHost(ChainIDs.Polygon, alchemy[ChainIDs.Polygon]),
    },
    Base: {
      RPCUrl: getAlchemyHost(ChainIDs.Base, alchemy[ChainIDs.Base]),
    },
    OP: {
      RPCUrl: getAlchemyHost(ChainIDs.OP, alchemy[ChainIDs.OP]),
    },
    BSC: {
      RPCUrl: getQuickNodeHost(ChainIDs.BSC, quickNode[ChainIDs.BSC]),
    },
    Scroll: {
      RPCUrl: getQuickNodeHost(ChainIDs.Scroll, quickNode[ChainIDs.Scroll]),
    },
    Astar: {
      // RPCUrl: getAlchemyHost(ChainIDs.Astar, alchemy[ChainIDs.Astar]),
      RPCUrl: getConstantsHost(ChainIDs.Astar),
    },
    arbitrum: {
      RPCUrl: 'https://arb1.arbitrum.io/rpc'
    }
  }
}