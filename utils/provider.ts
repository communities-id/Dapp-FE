import { ethers } from "ethers"


import { TestnetChainIDs, ChainIDs } from '@communitiesid/id'
import { TotalSupportedChainIDs, RPCKeys } from "@/types/chain"

// const ethersNetworksWl = [ChainIDs.Ethereum, ChainIDs.Polygon, ChainIDs.OP, TestnetChainIDs.Goerli, TestnetChainIDs["Polygon Mumbai"], TestnetChainIDs["Optimism Goerli Testnet"]]
const chainbaseNetworksWl = [ChainIDs.Ethereum, ChainIDs.Polygon, ChainIDs.OP, ChainIDs.BSC, TestnetChainIDs['BNB Smart Chain Testnet'], TestnetChainIDs.Goerli, TestnetChainIDs["Polygon Mumbai"], TestnetChainIDs["Optimism Goerli Testnet"]]
const quickNodeNetworksWl = [ChainIDs.BSC, TestnetChainIDs['BNB Smart Chain Testnet'], ChainIDs.Scroll, TestnetChainIDs['Scroll Sepolia Testnet']]

const { alchemy, quickNode, chainbase } = JSON.parse(process.env.NEXT_PUBLIC_RPC_KEYS ?? '{}') as RPCKeys

const defaultChainbaseKeys = chainbase[ChainIDs.Ethereum] || chainbase[TestnetChainIDs.Goerli]

export const chainbaseKeys: Record<TotalSupportedChainIDs, string[]> = {
  [ChainIDs.Ethereum]: chainbase[ChainIDs.Ethereum] ?? defaultChainbaseKeys,
  [ChainIDs.OP]: chainbase[ChainIDs.OP] ?? defaultChainbaseKeys,
  [ChainIDs.BSC]: chainbase[ChainIDs.BSC] ?? defaultChainbaseKeys,
  [ChainIDs.Polygon]: chainbase[ChainIDs.Polygon] ?? defaultChainbaseKeys,
  [ChainIDs.Base]: chainbase[ChainIDs.Base] ?? defaultChainbaseKeys,
  [ChainIDs.Scroll]: chainbase[ChainIDs.Scroll] ?? defaultChainbaseKeys,
  [TestnetChainIDs.Goerli]: chainbase[TestnetChainIDs.Goerli] ?? defaultChainbaseKeys,
  [TestnetChainIDs["Optimism Goerli Testnet"]]: chainbase[TestnetChainIDs["Optimism Goerli Testnet"]] ?? defaultChainbaseKeys,
  [TestnetChainIDs["BNB Smart Chain Testnet"]]: chainbase[TestnetChainIDs["BNB Smart Chain Testnet"]] ?? defaultChainbaseKeys,
  [TestnetChainIDs["Polygon Mumbai"]]: chainbase[TestnetChainIDs["Polygon Mumbai"]] ?? defaultChainbaseKeys,
  [TestnetChainIDs["Base Goerli Testnet"]]: chainbase[TestnetChainIDs["Base Goerli Testnet"]] ?? defaultChainbaseKeys,
  [TestnetChainIDs["Scroll Sepolia Testnet"]]: chainbase[TestnetChainIDs["Scroll Sepolia Testnet"]] ?? defaultChainbaseKeys
}

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

export const quickNodeKeys: Record<TotalSupportedChainIDs, string[]> = {
  [ChainIDs.Ethereum]: quickNode[ChainIDs.Ethereum],
  [ChainIDs.OP]: quickNode[ChainIDs.OP],
  [ChainIDs.BSC]: quickNode[ChainIDs.BSC],
  [ChainIDs.Polygon]: quickNode[ChainIDs.Polygon],
  [ChainIDs.Base]: quickNode[ChainIDs.Base],
  [ChainIDs.Scroll]: quickNode[ChainIDs.Scroll],
  [TestnetChainIDs.Goerli]: quickNode[TestnetChainIDs.Goerli],
  [TestnetChainIDs["Optimism Goerli Testnet"]]: quickNode[TestnetChainIDs["Optimism Goerli Testnet"]],
  [TestnetChainIDs["BNB Smart Chain Testnet"]]: quickNode[TestnetChainIDs["BNB Smart Chain Testnet"]],
  [TestnetChainIDs["Polygon Mumbai"]]: quickNode[TestnetChainIDs["Polygon Mumbai"]],
  [TestnetChainIDs["Base Goerli Testnet"]]: quickNode[TestnetChainIDs["Base Goerli Testnet"]],
  [TestnetChainIDs["Scroll Sepolia Testnet"]]: quickNode[TestnetChainIDs["Scroll Sepolia Testnet"]]
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

export const alchemyKeys: Record<TotalSupportedChainIDs, string[]> = {
  [ChainIDs.Ethereum]: alchemy[ChainIDs.Ethereum],
  [ChainIDs.OP]: alchemy[ChainIDs.OP],
  [ChainIDs.BSC]: alchemy[ChainIDs.BSC],
  [ChainIDs.Polygon]: alchemy[ChainIDs.Polygon],
  [ChainIDs.Base]: alchemy[ChainIDs.Base],
  [ChainIDs.Scroll]: alchemy[ChainIDs.Scroll],
  [TestnetChainIDs.Goerli]: alchemy[TestnetChainIDs.Goerli],
  [TestnetChainIDs["Optimism Goerli Testnet"]]: alchemy[TestnetChainIDs["Optimism Goerli Testnet"]],
  [TestnetChainIDs["BNB Smart Chain Testnet"]]: alchemy[TestnetChainIDs["BNB Smart Chain Testnet"]],
  [TestnetChainIDs["Polygon Mumbai"]]: alchemy[TestnetChainIDs["Polygon Mumbai"]],
  [TestnetChainIDs["Base Goerli Testnet"]]: alchemy[TestnetChainIDs["Base Goerli Testnet"]],
  [TestnetChainIDs["Scroll Sepolia Testnet"]]: alchemy[TestnetChainIDs["Scroll Sepolia Testnet"]]
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

export const getAlchemyHost = (network: number) => {
  const alchemyKey = getAlchemyKey(network as TotalSupportedChainIDs)
  return `https:/\/${alchemyHosts[network as TotalSupportedChainIDs]}.g.alchemy.com/v2/${alchemyKey}`
}

export const getAlchemyProvider = (network: number) => {
  return new ethers.providers.JsonRpcProvider(getAlchemyHost(network as TotalSupportedChainIDs))
}

export const getQuickNodeKey = (network: number) => {
  const keys = quickNodeKeys[network as TotalSupportedChainIDs] ?? []
  return keys[Math.floor(Math.random() * keys.length)] ?? ''
}

export const getQuickNodeHost = (network: number) => {
  return `https://${quickNodeHosts[network as TotalSupportedChainIDs]}.quiknode.pro/${getQuickNodeKey(network)}/`
}

export const getQuickNodeProvider = (network: number) => {
  return new ethers.providers.JsonRpcProvider(getQuickNodeHost(network as TotalSupportedChainIDs))
}

export const getChainbaseKey = (network: number) => {
  const keys = chainbaseKeys[network as TotalSupportedChainIDs] ?? []
  return keys[Math.floor(Math.random() * keys.length)] ?? ''
}

export const getChainbaseHosts = (network: number) => {
  return `https://${chainbaseHosts[network as TotalSupportedChainIDs]}.s.chainbase.online/v1/${getChainbaseKey(network)}/`
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