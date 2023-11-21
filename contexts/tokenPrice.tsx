import { batchGetDefaultCoinPrice, getDefaultCoinPrice } from '@/shared/contract'
import { useState, useContext, createContext, ReactNode, useEffect, useRef, useMemo } from 'react'

import { SupportedChainIDs, SupportedTestnetChainIDs, TotalSupportedChainIDs } from '@/types/chain'
import { ChainIDs, TestnetChainIDs } from '@communitiesid/id'

const Context = createContext<Record<TotalSupportedChainIDs, number>>({
  [ChainIDs.Ethereum]: 0,
  [ChainIDs.OP]: 0,
  [ChainIDs.BSC]: 0,
  [ChainIDs.Polygon]: 0,
  [ChainIDs.Base]: 0,
  [ChainIDs.Scroll]: 0,
  [ChainIDs.Astar]: 0,
  [TestnetChainIDs.Goerli]: 0,
  [TestnetChainIDs["Optimism Goerli Testnet"]]: 0,
  [TestnetChainIDs["BNB Smart Chain Testnet"]]: 0,
  [TestnetChainIDs["Polygon Mumbai"]]: 0,
  [TestnetChainIDs["Base Goerli Testnet"]]: 0,
  [TestnetChainIDs["Scroll Sepolia Testnet"]]: 0,
  [TestnetChainIDs['zKatana Testnet']]: 0,
})

export function TokenPriceProvider({ children }: { children: ReactNode }) {

  const [ETH, setETH] = useState(1790)
  const [MATIC, setMATIC] = useState(0.6)
  const [BNB, setBNB] = useState(225)
  const [ASTR, setASTR] = useState(0.1)

  useEffect(() => {
    async function getTokenPrice() {
      try {
        const price = await batchGetDefaultCoinPrice(['ETH', 'MATIC', 'BNB', 'ASTR'])
        setETH(price.ETH)
        setMATIC(price.MATIC)
        setBNB(price.BNB)
        setASTR(price.ASTR)
      } catch (e) {
        console.log(e)
      }
    }
    getTokenPrice()
  }, [])

  return (
    <Context.Provider value={{
      [ChainIDs.Ethereum]: ETH,
      [ChainIDs.OP]: ETH,
      [ChainIDs.BSC]: BNB,
      [ChainIDs.Polygon]: MATIC,
      [ChainIDs.Base]: ETH,
      [ChainIDs.Scroll]: ETH,
      [ChainIDs.Astar]: ASTR,
      [TestnetChainIDs.Goerli]: ETH,
      [TestnetChainIDs["Optimism Goerli Testnet"]]: 0,
      [TestnetChainIDs["BNB Smart Chain Testnet"]]: BNB,
      [TestnetChainIDs["Polygon Mumbai"]]: MATIC,
      [TestnetChainIDs["Base Goerli Testnet"]]: ETH,
      [TestnetChainIDs["Scroll Sepolia Testnet"]]: ETH,
      [TestnetChainIDs['zKatana Testnet']]: ETH,
    }}>
      {children}
    </Context.Provider>
  )
}

export function useTokenPrice() {
  return useContext(Context);
}