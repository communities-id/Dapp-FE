import type { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from '@/shared/prisma'


export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  
  const { chainId, contract, page, pageSize = 20 } = req.query

  const list = await prisma.member.findMany({
    where: {
      chainId: Number(chainId),
      registry: (contract as string).toLocaleLowerCase(),
    },
    skip: (Number(page) - 1) * Number(pageSize),
    take: Number(pageSize),
  })

  const total = await prisma.member.count({
    where: {
      chainId: Number(chainId),
      registry: (contract as string).toLocaleLowerCase(),
    }
  })

  return res.status(200).json({
    code: 0,
    data: {
      list,
      total
    }
  })
}
