import type { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from '@/shared/prisma';

import { SupportedChainIDs, SupportedTestnetChainIDs } from '@/types/chain'
import { MAIN_CHAIN_ID } from '@/shared/constant';


export const testnetChainBlockNumberMap: Record<SupportedTestnetChainIDs, number> = {
  5: 9780000,
  80001: 38000000,
  97: 34000000,
  84531: 10000000,
  420: 15000000,
  534351: 1769000
}

export const chainBlockNumberMap: Record<SupportedChainIDs, number> = {
  1: 18313000,
  10: 110639000,
  56: 32460000,
  137: 48517000,
  8453: 5044000,
  534352: 207000
}

// to do: multiple chain
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  let chains: Partial<Record<SupportedChainIDs | SupportedTestnetChainIDs, number>> = {}, types = []
  if (process.env.NEXT_PUBLIC_IS_TESTNET === 'true') {
    chains = testnetChainBlockNumberMap
    types = ['community', 'relayer', 'primaryRecord']
  } else {
    chains = chainBlockNumberMap
    types = ['community', 'relayer', 'primaryRecord']
  }

  for (let chain in chains) {
    for (let i = 0; i < types.length; i++) {
      if (Number(chain) !== MAIN_CHAIN_ID && types[i] === 'primaryRecord') {
        continue
      }
      await prisma.cache.upsert({
        where: {
          chainId_type: {
            type: types[i],
            chainId: Number(chain),
          }
        },
        create: {
          type: types[i],
          chainId: Number(chain),
          blockNumber: (chains as any)[chain]
        },
        update: {}
      })
    }
  }

  return res.status(200).json({
    code: 0,
    data: true
  })
}
