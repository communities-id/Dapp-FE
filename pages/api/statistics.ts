import type { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from '@/shared/prisma'
import { batchGetDefaultCoinPrice } from '@/shared/contract'
import { BigNumber } from 'ethers'

import { SupportedChainIDs, SupportedTestnetChainIDs, TotalSupportedChainIDs } from '@/types/chain'
import { ChainIDs, TestnetChainIDs } from '@communitiesid/id'


async function getTVL() {
  const communities = await prisma.community.findMany({
    include: {
      coin: true
    }
  })
  

  const price = await batchGetDefaultCoinPrice(['ETH', 'MATIC', 'BNB', 'ASTR'])
  const ethPrice = price.ETH
  const maticPrice = price.MATIC
  const bnbPrice = price.BNB
  const astarPrice = price.ASTR

  // to do: multiple chain
  const defaultCoinPrice: Record<TotalSupportedChainIDs, number> = {
    [ChainIDs.Ethereum]: ethPrice,
    [ChainIDs.OP]: ethPrice,
    [ChainIDs.BSC]: bnbPrice,
    [ChainIDs.Polygon]: maticPrice,
    [ChainIDs.Base]: ethPrice,
    [ChainIDs.Scroll]: ethPrice,
    [ChainIDs.Astar]: astarPrice,
    [TestnetChainIDs.Goerli]: ethPrice,
    [TestnetChainIDs["Optimism Goerli Testnet"]]: ethPrice,
    [TestnetChainIDs["BNB Smart Chain Testnet"]]: bnbPrice,
    [TestnetChainIDs["Polygon Mumbai"]]: maticPrice,
    [TestnetChainIDs["Base Goerli Testnet"]]: ethPrice,
    [TestnetChainIDs["Scroll Sepolia Testnet"]]: ethPrice,
    [TestnetChainIDs['Shibuya Testnet']]: astarPrice,
  }

  let sum = 0
  for(let i = 0; i < communities.length; i++) {
    if (communities[i].coin) {
      sum += Number(BigNumber.from(communities[i].pool)) * (Number(communities[i].coin?.usdPrice) || 0) / Math.pow(10, communities[i].coin?.tokenDecimal || 18)
    } else {
      sum += Number(BigNumber.from(communities[i].pool)) * (defaultCoinPrice[communities[i].chainId as (SupportedChainIDs | SupportedTestnetChainIDs)] || 0) / Math.pow(10, 18)
    }
  }

  return sum
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  
  const [communities, identities, tvl] = await Promise.all([
    prisma.community.count({where: { to: { not: '0x0000000000000000000000000000000000000000'}}}),
    prisma.member.count({where: { to: { not: '0x0000000000000000000000000000000000000000'}}}),
    getTVL()
  ])

  return res.status(200).json({
    code: 0,
    data: {
      communities,
      identities,
      tvl
    }
  })
}
