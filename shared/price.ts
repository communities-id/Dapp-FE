import Moralis from 'moralis';
import { EvmChain, EvmChainish } from '@moralisweb3/common-evm-utils'

import { SupportedChainIDs, SupportedTestnetChainIDs } from '@/types/chain'

export const getTokenPrice = async (tokenAddress: string, chainId: number) => {
  try {
    await Moralis.start({
      apiKey: "nDbPxgfkeqQxnjuvQAfvYpB7Y1KzHSHtqdxV7hnJFwNf4ibo9JDJ2CZyztggFQdK",
    });
  } catch(e) {}

  const chainMap: Partial<Record<SupportedChainIDs | SupportedTestnetChainIDs, EvmChainish>> = {
    1: EvmChain.ETHEREUM,
    137: EvmChain.POLYGON,
    56: EvmChain.BSC,
    8453: 8453,
    10: EvmChain.OPTIMISM,
    5: EvmChain.GOERLI,
    80001: EvmChain.MUMBAI,
    97: EvmChain.BSC_TESTNET,
    84531: 84531,
    420: 420,
    534351: 534351 // to do
  }

  if(!chainMap[chainId as SupportedChainIDs | SupportedTestnetChainIDs]) {
    return {
      message: 'unknown chainId',
      toJSON: () => ({
        usdPrice: 0,
        tokenDecimals: 0,
      })
    }
  }

  try {
    const res = await Moralis.EvmApi.token.getTokenPrice({
      address: tokenAddress,
      chain: chainMap[chainId as SupportedChainIDs | SupportedTestnetChainIDs] as any,
    });
  
    return res;
  } catch (e: any) {
    console.log(e.message)
    return {
      message: e.message,
      toJSON: () => ({
        usdPrice: 0,
        tokenDecimals: 0,
      })
    }
  }
  
}