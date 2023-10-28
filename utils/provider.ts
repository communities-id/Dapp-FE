import { ethers } from "ethers"

import { TestnetChainIDs, ChainIDs, CommunitiesIDInput } from '@communitiesid/id'
import { TotalSupportedChainIDs, RPCKeys } from "@/types/chain"

// const ethersNetworksWl = [ChainIDs.Ethereum, ChainIDs.Polygon, ChainIDs.OP, TestnetChainIDs.Goerli, TestnetChainIDs["Polygon Mumbai"], TestnetChainIDs["Optimism Goerli Testnet"]]
const chainbaseNetworksWl = [ChainIDs.Ethereum, ChainIDs.Polygon, ChainIDs.OP, ChainIDs.BSC, TestnetChainIDs['BNB Smart Chain Testnet'], TestnetChainIDs.Goerli, TestnetChainIDs["Polygon Mumbai"], TestnetChainIDs["Optimism Goerli Testnet"]]
const quickNodeNetworksWl = [ChainIDs.BSC, TestnetChainIDs['BNB Smart Chain Testnet'], ChainIDs.Scroll, TestnetChainIDs['Scroll Sepolia Testnet']]

export const parseRPCKeys = (rpcKeys: string): Record<'alchemy' | 'quickNode' | 'chainbase', Record<TotalSupportedChainIDs, string[]>> => {
  const { alchemy, quickNode, chainbase } = JSON.parse(rpcKeys) as RPCKeys
  return {
    alchemy: Object.fromEntries(Object.entries(alchemy).map(([key, value]) => [Number(key), value])) as Record<TotalSupportedChainIDs, string[]>,
    quickNode: Object.fromEntries(Object.entries(quickNode).map(([key, value]) => [Number(key), value])) as Record<TotalSupportedChainIDs, string[]>,
    chainbase: Object.fromEntries(Object.entries(chainbase).map(([key, value]) => [Number(key), value])) as Record<TotalSupportedChainIDs, string[]>
  }
}

const { alchemy: alchemyKeys, quickNode: quickNodeKeys, chainbase: chainbaseKeys } = parseRPCKeys(process.env.NEXT_PUBLIC_RPC_KEYS ?? '{}')

export const chainbaseHosts: Record<TotalSupportedChainIDs, string> = {
  [ChainIDs.Ethereum]: 'ethereum-mainnet',
  [ChainIDs.OP]: 'optimism-mainnet',
  [ChainIDs.BSC]: 'bsc-mainnet',
  [ChainIDs.Polygon]: 'polygon-mainnet',
  [ChainIDs.Base]: 'base-mainnet',
  [ChainIDs.Scroll]: '',
  [TestnetChainIDs.Goerli]: 'ethereum-goerli',
  [TestnetChainIDs["Optimism Goerli Testnet"]]: 'optimism-goerli',
  [TestnetChainIDs["BNB Smart Chain Testnet"]]: 'bsc-testnet',
  [TestnetChainIDs["Polygon Mumbai"]]: 'polygon-mumbai',
  [TestnetChainIDs["Base Goerli Testnet"]]: 'base-goerli',
  [TestnetChainIDs["Scroll Sepolia Testnet"]]: ''
}

export const quickNodeHosts: Record<TotalSupportedChainIDs, string> = {
  [ChainIDs.Ethereum]: 'eth-mainnet',
  [ChainIDs.OP]: 'opt-mainnet',
  [ChainIDs.BSC]: 'smart-solitary-tent.bsc',
  [ChainIDs.Polygon]: 'polygon-mainnet',
  [ChainIDs.Base]: 'base-mainnet',
  [ChainIDs.Scroll]: 'omniscient-dimensional-shadow.scroll-mainnet',
  [TestnetChainIDs.Goerli]: 'eth-goerli',
  [TestnetChainIDs["Optimism Goerli Testnet"]]: 'opt-goerli',
  [TestnetChainIDs["BNB Smart Chain Testnet"]]: 'lingering-hidden-friday.bsc-testnet',
  [TestnetChainIDs["Polygon Mumbai"]]: 'polygon-mumbai',
  [TestnetChainIDs["Base Goerli Testnet"]]: 'base-goerli',
  [TestnetChainIDs["Scroll Sepolia Testnet"]]: 'multi-wandering-daylight.scroll-testnet'
}

export const alchemyHosts: Record<TotalSupportedChainIDs, string> = {
  [ChainIDs.Ethereum]: 'eth-mainnet',
  [ChainIDs.OP]: 'opt-mainnet',
  [ChainIDs.BSC]: 'bsc-mainnet',
  [ChainIDs.Polygon]: 'polygon-mainnet',
  [ChainIDs.Base]: 'base-mainnet',
  [ChainIDs.Scroll]: '',
  [TestnetChainIDs.Goerli]: 'eth-goerli',
  [TestnetChainIDs["Optimism Goerli Testnet"]]: 'opt-goerli',
  [TestnetChainIDs["BNB Smart Chain Testnet"]]: 'bsc-testnet',
  [TestnetChainIDs["Polygon Mumbai"]]: 'polygon-mumbai',
  [TestnetChainIDs["Base Goerli Testnet"]]: 'base-goerli',
  [TestnetChainIDs["Scroll Sepolia Testnet"]]: ''
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
  return new ethers.providers.JsonRpcProvider(getAlchemyHost(network as TotalSupportedChainIDs))
}

export const getQuickNodeKey = (network: number) => {
  const keys = quickNodeKeys[network as TotalSupportedChainIDs] ?? []
  return keys[Math.floor(Math.random() * keys.length)] ?? ''
}

export const getQuickNodeHost = (network: number, keys?: string[]) => {
  const _keys = keys ?? alchemyKeys[network as TotalSupportedChainIDs] ?? []
  const key = _keys[Math.floor(Math.random() * _keys.length)] ?? ''
  return `https://${quickNodeHosts[network as TotalSupportedChainIDs]}.quiknode.pro/${key}/`
}

export const getQuickNodeProvider = (network: number) => {
  return new ethers.providers.JsonRpcProvider(getQuickNodeHost(network as TotalSupportedChainIDs))
}

export const getChainbaseKey = (network: number) => {
  const keys = chainbaseKeys[network as TotalSupportedChainIDs] ?? (chainbaseKeys[ChainIDs.Ethereum] || chainbaseKeys[TestnetChainIDs.Goerli]) ?? []
  return keys[Math.floor(Math.random() * keys.length)] ?? ''
}

export const getChainbaseHosts = (network: number, keys?: string[]) => {
  const _keys = keys ?? chainbaseKeys[network as TotalSupportedChainIDs] ?? []
  const key = _keys[Math.floor(Math.random() * _keys.length)] ?? ''
  return `https://${chainbaseHosts[network as TotalSupportedChainIDs]}.s.chainbase.online/v1/${key}/`
}

export const getChainbaseProvider = (network: number) => {
  return new ethers.providers.JsonRpcProvider(getChainbaseHosts(network as TotalSupportedChainIDs))
}

// export const getblockHost = (network: number) => {
//   return 'https://bsc.getblock.io/1a5ea93b-d342-48bd-85c2-754cdae87a19/testnet/'
// }

export const createProvider = (network: number) => {
  const providers = new Map<number, ethers.providers.JsonRpcProvider>()
  return (() => {
    // providers cache
    if (providers.has(network)) return providers.get(network) as ethers.providers.JsonRpcProvider
    
    // custom provider by endpoint
    if (chainbaseNetworksWl.includes(network)) {
      // providers.set(network, new ethers.providers.AlchemyProvider(
      //   ethers.providers.getNetwork(network),
      //   getAlchemyKey(network as TotalSupportedChainIDs)
      // ))
      providers.set(network, getChainbaseProvider(network))
      // quicknode provider
    } else if (quickNodeNetworksWl.includes(network)) {
      providers.set(network, getQuickNodeProvider(network))
    } else {
      // alcemy provider
      providers.set(network, getAlchemyProvider(network))
    }

    return providers.get(network) as ethers.providers.JsonRpcProvider
  })()
}

export const getSDKOptions = (rpcKeys = process.env.NEXT_PUBLIC_RPC_KEYS): CommunitiesIDInput => {
  const isTestnet = process.env.NEXT_PUBLIC_IS_TESTNET === 'true'
  const { quickNode, chainbase } = parseRPCKeys(rpcKeys ?? '{}')

  return isTestnet ? {
    isTestnet: true,
    openseaKey: process.env.NEXT_PUBLIC_OPENSEA_KEY as string,
    Goerli: {
      // RPCUrl: "https://goerli.infura.io/v3/4779964dc9704f6dbf8d63a1e0183ed6",
      RPCUrl: getChainbaseHosts(TestnetChainIDs.Goerli, chainbase[TestnetChainIDs.Goerli]),
    },
    "Polygon Mumbai": {
      RPCUrl: getChainbaseHosts(TestnetChainIDs['Polygon Mumbai'], chainbase[TestnetChainIDs['Polygon Mumbai']] ?? chainbaseKeys[TestnetChainIDs.Goerli]),
    },
    'Base Goerli Testnet': {
      RPCUrl: getChainbaseHosts(TestnetChainIDs['Base Goerli Testnet'], chainbase[TestnetChainIDs['Base Goerli Testnet']] ?? chainbase[TestnetChainIDs.Goerli]),
    },
    'Optimism Goerli Testnet': {
      RPCUrl: getChainbaseHosts(TestnetChainIDs['Optimism Goerli Testnet'], chainbase[TestnetChainIDs['Optimism Goerli Testnet']] ?? chainbase[TestnetChainIDs.Goerli]),
    },
    'BNB Smart Chain Testnet': {
      RPCUrl: getChainbaseHosts(TestnetChainIDs['BNB Smart Chain Testnet'], chainbase[TestnetChainIDs['BNB Smart Chain Testnet']] ?? chainbase[TestnetChainIDs.Goerli]),
    },
    'Scroll Sepolia Testnet': {
      RPCUrl: getQuickNodeHost(TestnetChainIDs['Scroll Sepolia Testnet'], quickNode[TestnetChainIDs['Scroll Sepolia Testnet']]),
    },
  } : {
    openseaKey: process.env.NEXT_PUBLIC_OPENSEA_KEY as string,
    Ethereum: {
      RPCUrl: getChainbaseHosts(ChainIDs.Ethereum, chainbase[ChainIDs.Ethereum]),
    },
    Polygon: {
      RPCUrl: getChainbaseHosts(ChainIDs.Polygon, chainbase[ChainIDs.Polygon] ?? chainbase[ChainIDs.Ethereum]),
    },
    Base: {
      RPCUrl: getChainbaseHosts(ChainIDs.Base, chainbase[ChainIDs.Base] ?? chainbase[ChainIDs.Ethereum]),
    },
    OP: {
      RPCUrl: getChainbaseHosts(ChainIDs.OP, chainbase[ChainIDs.OP] ?? chainbase[ChainIDs.Ethereum]),
    },
    BSC: {
      RPCUrl: getChainbaseHosts(ChainIDs.BSC, chainbase[ChainIDs.BSC] ?? chainbase[ChainIDs.Ethereum]),
    },
    Scroll: {
      RPCUrl: getQuickNodeHost(ChainIDs.Scroll, quickNode[ChainIDs.Scroll]),
    },
    arbitrum: {
      RPCUrl: 'https://arb1.arbitrum.io/rpc'
    }
  }
}