import type { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from '@/shared/prisma'

const t = (v: string): string => v

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  
  const data = await prisma.relayer.findMany({
    orderBy: {
      createdAt: 'desc'
    }
  })

  return res.status(200).json({
    code: 0,
    data
  })
}
