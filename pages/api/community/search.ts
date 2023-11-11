import { prisma } from '@/shared/prisma'
import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  
  const { name } = req.query

  const data = await prisma.community.findMany({
    where: {
      name: {
        contains: name as string
      }
    },
    orderBy: {
      totalSupply: 'desc'
    },
    take: 5
  })

  return res.status(200).json({
    code: 0,
    data: data
  })
}
