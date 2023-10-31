import { batchGetDefaultCoinPrice, getDefaultCoinPrice } from '@/shared/contract'
import { useState, useContext, createContext, ReactNode, useEffect, useRef, useMemo } from 'react'

import { SupportedChainIDs, SupportedTestnetChainIDs } from '@/types/chain'

const Context = createContext<Record<SupportedChainIDs | SupportedTestnetChainIDs, number>>({
  1: 0,
  137: 0,
  56: 0,
  8453: 0,
  10: 0,
  534352: 0,
  5: 0,
  80001: 0,
  97: 0,
  84531: 0,
  420: 0,
  534351: 0,
})

export function TokenPriceProvider({ children }: { children: ReactNode }) {

  const [ETH, setETH] = useState(1790)
  const [MATIC, setMATIC] = useState(0.6)
  const [BNB, setBNB] = useState(225)

  useEffect(() => {
    async function getTokenPrice() {
      try {
        const price = await batchGetDefaultCoinPrice(['ETH', 'MATIC', 'BNB'])
        setETH(price.ETH)
        setMATIC(price.MATIC)
        setBNB(price.BNB)
      } catch (e) {
        console.log(e)
      }
    }
    getTokenPrice()
  }, [])

  return (
    <Context.Provider value={{
      1: ETH,
      137: MATIC,
      56: BNB,
      8453: ETH,
      10: ETH,
      534352: ETH,
      5: ETH,
      80001: MATIC,
      97: BNB,
      84531: ETH,
      420: ETH,
      534351: ETH,
    }}>
      {children}
    </Context.Provider>
  )
}

export function useTokenPrice() {
  return useContext(Context);
}