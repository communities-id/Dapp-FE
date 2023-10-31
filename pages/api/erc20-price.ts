import { getTokenPrice } from '@/shared/price'
import { prisma } from '@/shared/prisma'
import type { NextApiRequest, NextApiResponse } from 'next'


export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {

  const { contract, chainId } = req.query

  const data = await prisma.coin.findUnique({
    where: {
      contract_chainId: {
        contract: contract as string,
        chainId: Number(chainId)
      }
    }
  })

  return res.status(200).json({
    code: 0,
    data
  })
}
