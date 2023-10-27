import type { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from '@/shared/prisma'
import { getDefaultCoinPrice } from '@/shared/contract'
import { BigNumber } from 'ethers'

import { SupportedChainIDs, SupportedTestnetChainIDs } from '@/types/chain'

const t = (v: string): string => v

async function getTVL() {
  const communities = await prisma.community.findMany({
    include: {
      coin: true
    }
  })
  
  const ethPrice = await getDefaultCoinPrice('ETH')
  const maticPrice = await getDefaultCoinPrice('MATIC')
  const bnbPrice = await getDefaultCoinPrice('BNB')

  // to do: multiple chain
  const defaultCoinPrice: Record<SupportedChainIDs | SupportedTestnetChainIDs, number> = {
    1: ethPrice,
    10: ethPrice,
    56: bnbPrice,
    137: maticPrice,
    8453: ethPrice,
    534352: ethPrice,
    
    5: ethPrice,
    80001: maticPrice,
    97: bnbPrice,
    84531: ethPrice,
    420: ethPrice,
    534351: ethPrice
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
