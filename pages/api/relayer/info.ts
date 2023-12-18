import type { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from '@/shared/prisma'


export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {

  const { tx } = req.query

  if (!tx) {
    return res.status(200).json({
      code: 400,
      message: 'invalid tx hash'
    })
  }
  
  const data = await prisma.relayer.findFirst({
    where: {
      srcTx: tx as string
    }
  })

  return res.status(200).json({
    code: 0,
    data
  })
}
