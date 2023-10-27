import type { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from '@/shared/prisma';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  
  const { address } = req.query

  const tgUser = await prisma.telegramUser.findUnique({
    where: {
      address: (address as string).toLowerCase()
    }
  })
  
  return res.status(200).json({
    code: 0,
    data: tgUser
  })
}
