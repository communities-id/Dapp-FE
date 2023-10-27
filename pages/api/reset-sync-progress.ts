import type { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from '@/shared/prisma'

import { chainBlockNumberMap, testnetChainBlockNumberMap } from './init-cache'

import { SupportedChainIDs, SupportedTestnetChainIDs } from '@/types/chain'

const t = (v: string): string => v

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {

  // if (process.env.NEXT_PUBLIC_IS_TESTNET === 'true') {
  //   for (const chainId in testnetChainBlockNumberMap) {
  //     await prisma.cache.updateMany({
  //       where: {
  //         chainId: Number(chainId)
  //       },
  //       data: {
  //         blockNumber: Number(testnetChainBlockNumberMap[Number(chainId) as SupportedTestnetChainIDs])
  //       }
  //     })
  //   }
  // } else {
  //   for (const chainId in chainBlockNumberMap) {
  //     await prisma.cache.updateMany({
  //       where: {
  //         chainId: Number(chainId)
  //       },
  //       data: {
  //         blockNumber: Number(chainBlockNumberMap[Number(chainId) as SupportedChainIDs])
  //       }
  //     })
  //   }
  // }
  
  // await prisma.community.deleteMany({})
  // await prisma.member.deleteMany({})
  // await prisma.relayer.deleteMany({})
  // await prisma.coin.deleteMany({})

  return res.status(200).json({
    code: 0,
    data: true
  })
}
