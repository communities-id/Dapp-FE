import type { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from '@/shared/prisma'


export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  
  const { address, page, pageSize = 20 } = req.query

  const list = await prisma.community.findMany({
    skip: (Number(page) - 1) * Number(pageSize),
    take: Number(pageSize),
  })

  const total = await prisma.community.count({
    where: {
      to: (address as string).toLowerCase()
    },
  })

  return res.status(200).json({
    code: 0,
    data: {
      list,
      total
    }
  })
}
