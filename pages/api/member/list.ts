import type { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from '@/shared/prisma'


export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  
  const { page, pageSize = 50 } = req.query

  const list = await prisma.member.findMany({
    orderBy: {
      blockTimestamp: 'desc'
    },
    skip: (Number(page) - 1) * Number(pageSize),
    take: Number(pageSize),
  })

  const total = await prisma.member.count()

  return res.status(200).json({
    code: 0,
    data: {
      list,
      total
    }
  })
}
