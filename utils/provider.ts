import { ethers } from "ethers"


import { TestnetChainIDs, ChainIDs } from '@communitiesid/id'
import { TotalSupportedChainIDs } from "@/types/chain"

const ethersNetworksWl = [ChainIDs.Ethereum, ChainIDs.Polygon, ChainIDs.OP, TestnetChainIDs.Goerli, TestnetChainIDs["Polygon Mumbai"], TestnetChainIDs["Optimism Goerli Testnet"]]
const quickNodeNetworksWl = [ChainIDs.BSC, TestnetChainIDs['BNB Smart Chain Testnet'], ChainIDs.Scroll, TestnetChainIDs['Scroll Sepolia Testnet']]

// const ENDPOINTS = [
//   "ed57fee96b9f44a397fee2e8d4048b1b",
//   "b706609261c64eaaad792171bc3c9fcf",
//   "4779964dc9704f6dbf8d63a1e0183ed6",
// ];

export const quickNodeKeys: Record<TotalSupportedChainIDs, string> = {
  [ChainIDs.Ethereum]: '',
  [ChainIDs.OP]: '',
  [ChainIDs.BSC]: '402da9ac3bd984448f37ac00f39950f0ee96a7ef',
  [ChainIDs.Polygon]: '',
  [ChainIDs.Base]: '',
  [ChainIDs.Scroll]: 'feb5dba212a1f5f2125f7184209e6561514cffd1',
  [TestnetChainIDs.Goerli]: '',
  [TestnetChainIDs["Optimism Goerli Testnet"]]: '',
  [TestnetChainIDs["BNB Smart Chain Testnet"]]: '0376e91a041267d0bd9596987135b4af740c9404',
  [TestnetChainIDs["Polygon Mumbai"]]: '',
  [TestnetChainIDs["Base Goerli Testnet"]]: '',
  [TestnetChainIDs["Scroll Sepolia Testnet"]]: 'ef282ceb9fa2f7c070728a9b4b9d3562cd4aff40'
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
  [ChainIDs.Ethereum]: ['k6tXMTkD-M7nx0TTyMHp795qjpy_IgGB'],
  [ChainIDs.OP]: ['I3hQNtvtRXJhYg0nj7DNILuZjLu78lzD'],
  [ChainIDs.BSC]: [''],
  [ChainIDs.Polygon]: ['-7UFTTE8EeFLMzGyICfzX3-obni0pXcp'],
  [ChainIDs.Base]: ['InugYiR8AtjtTPfRjqtmQLWa9MGvK56f'],
  [ChainIDs.Scroll]: [''],
  [TestnetChainIDs.Goerli]: ['6jUlYQ_AC_GGmes1VmdNQSYa89xr5_CC', 'MaXBRPDQfQuBc9neTAVrg2te_s7WUEb2'],
  [TestnetChainIDs["Optimism Goerli Testnet"]]: ['wrsh4EQxyGnK3jG70HeUgdrGXprQwiv2', '4VfcUnGlvHT_Qx80y9i-ZintiKjwh69c'],
  [TestnetChainIDs["BNB Smart Chain Testnet"]]: ['bsctest'],
  [TestnetChainIDs["Polygon Mumbai"]]: ['8Cl-CABzyMKUY5d2lUA1z_fcw35bG9VW', 'IVlQZm8YztHFHPP6NG_ZZMWHdXMwkebV'],
  [TestnetChainIDs["Base Goerli Testnet"]]: ['ng0gz-31_us9zlmzD1pJMltcpXbYp5mw', 'QmQs506FvSqlOWIRMs4Oay69uVphdyb-'],
  [TestnetChainIDs["Scroll Sepolia Testnet"]]: ['']
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
  const keys = alchemyKeys[network as TotalSupportedChainIDs]
  return keys[Math.floor(Math.random() * keys.length)]
}

export const getAlchemyHost = (network: number) => {
  const alchemyKey = getAlchemyKey(network as TotalSupportedChainIDs)
  return `https:/\/${alchemyHosts[network as TotalSupportedChainIDs]}.g.alchemy.com/v2/${alchemyKey}`
}

export const getAlchemyProvider = (network: number) => {
  return new ethers.providers.JsonRpcProvider(getAlchemyHost(network as TotalSupportedChainIDs))
}

export const getQuickNodeKey = (network: number) => {
  return quickNodeKeys[network as TotalSupportedChainIDs]
}

export const getQuickNodeHost = (network: number) => {
  return `https://${quickNodeHosts[network as TotalSupportedChainIDs]}.quiknode.pro/${getQuickNodeKey(network)}/`
}

export const getQuickNodeProvider = (network: number) => {
  return new ethers.providers.JsonRpcProvider(getQuickNodeHost(network as TotalSupportedChainIDs))
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
    if (ethersNetworksWl.includes(network)) {
      providers.set(network, new ethers.providers.AlchemyProvider(
        ethers.providers.getNetwork(network),
        getAlchemyKey(network as TotalSupportedChainIDs)
      ))
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