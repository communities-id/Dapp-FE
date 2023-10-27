import type { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from '@/shared/prisma'

const t = (v: string): string => v

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  
  const { address, page, pageSize = 20 } = req.query

  const list = await prisma.member.findMany({
    where: {
      to: (address as string).toLocaleLowerCase()
    },
    skip: (Number(page) - 1) * Number(pageSize),
    take: Number(pageSize),
  })

  const total = await prisma.member.count({
    where: {
      to: (address as string).toLocaleLowerCase()
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
