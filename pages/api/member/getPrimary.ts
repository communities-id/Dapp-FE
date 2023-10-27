import type { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from '@/shared/prisma'

const t = (v: string): string => v

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  
  const { address } = req.query
  if (!address) {
    return res.status(200).json({
      code: 0,
      data: null
    })
  }
  const data = await prisma.member.findFirst({
    where: {
      to: (address as string).toLowerCase(),
      isPrimary: true
    },
  })

  return res.status(200).json({
    code: 0,
    data: data ? data.name : null
  })
}
