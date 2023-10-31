import type { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from "@/shared/prisma";
import { executeRelayer } from '@/shared/contract'


export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {

  const { id } = req.body

  const record = await prisma.relayer.findUnique({
    where: {
      id
    }
  })

  if (!record || !record.payload) {
    return res.status(200).json({
      code: 1,
      message: 'Relayer record not found or payload/dstAddress not exist.'
    })
  }

  // const data = await executeRelayer(record.id, Number(record.dstChain), record.payload, prisma)
  const data = {}

  return res.status(200).json({
    code: 0,
    data
  })
}
