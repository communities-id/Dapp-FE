import Moralis from 'moralis';
import { EvmChain, EvmChainish } from '@moralisweb3/common-evm-utils'

import { SupportedChainIDs, SupportedTestnetChainIDs, TotalSupportedChainIDs } from '@/types/chain'
import { ChainIDs, TestnetChainIDs } from '@communitiesid/id';

export const getTokenPrice = async (tokenAddress: string, chainId: number) => {
  try {
    await Moralis.start({
      apiKey: "nDbPxgfkeqQxnjuvQAfvYpB7Y1KzHSHtqdxV7hnJFwNf4ibo9JDJ2CZyztggFQdK",
    });
  } catch(e) {}

  const chainMap: Partial<Record<TotalSupportedChainIDs, EvmChainish>> = {
    [ChainIDs.Ethereum]: EvmChain.ETHEREUM,
    [ChainIDs.OP]: EvmChain.OPTIMISM,
    [ChainIDs.BSC]: EvmChain.BSC,
    [ChainIDs.Polygon]: EvmChain.POLYGON,
    [ChainIDs.Base]: 8453,
    [ChainIDs.Scroll]: 534352,
    [ChainIDs.Astar]: 592,
    [TestnetChainIDs.Goerli]: EvmChain.GOERLI,
    [TestnetChainIDs["Optimism Goerli Testnet"]]: 420,
    [TestnetChainIDs["BNB Smart Chain Testnet"]]: EvmChain.BSC_TESTNET,
    [TestnetChainIDs["Polygon Mumbai"]]: EvmChain.MUMBAI,
    [TestnetChainIDs["Base Goerli Testnet"]]: 84531,
    [TestnetChainIDs["Scroll Sepolia Testnet"]]: 534351,
    [TestnetChainIDs['Shibuya Testnet']]: 81,
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