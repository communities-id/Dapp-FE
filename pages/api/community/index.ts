import type { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from '@/shared/prisma'


export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  
  const { ids } = req.query

  const idList = (ids as string).split(',').map(v => Number(v))
  const list = await prisma.community.findMany({
    where: {
      tokenId: {
        in: idList
      }
    },
  })
  return res.status(200).json({
    code: 0,
    data: list
  })
}
