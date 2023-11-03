import type { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from '@/shared/prisma';

import { SupportedChainIDs, SupportedTestnetChainIDs } from '@/types/chain'
import { MAIN_CHAIN_ID } from '@/shared/constant';
import { ChainIDs, TestnetChainIDs } from '@communitiesid/id';


export const testnetChainBlockNumberMap: Record<SupportedTestnetChainIDs, number> = {
  [TestnetChainIDs.Goerli]: 9780000,
  [TestnetChainIDs["Optimism Goerli Testnet"]]: 15000000,
  [TestnetChainIDs["BNB Smart Chain Testnet"]]: 34000000,
  [TestnetChainIDs["Polygon Mumbai"]]: 38000000,
  [TestnetChainIDs["Base Goerli Testnet"]]: 10000000,
  [TestnetChainIDs["Scroll Sepolia Testnet"]]: 1769000,
  [TestnetChainIDs['Shibuya Testnet']]: 4995000,
}

export const chainBlockNumberMap: Record<SupportedChainIDs, number> = {
  [ChainIDs.Ethereum]: 18313000,
  [ChainIDs.OP]: 110639000,
  [ChainIDs.BSC]: 32460000,
  [ChainIDs.Polygon]: 48517000,
  [ChainIDs.Base]: 5044000,
  [ChainIDs.Scroll]: 207000,
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
