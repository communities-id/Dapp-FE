import type { NextApiRequest, NextApiResponse } from 'next'

import { prisma } from '@/shared/prisma'
import { execSearch } from '@/shared/helper'


export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  
  const { name } = req.query
  const { type } = execSearch(name as string)

  if (type !== 'member') {
    return res.status(200).json({
      code: -1,
      data: null,
      message: 'not member!'
    })
  }

  const data = await prisma.member.findUnique({
    where: {
      name: name as string
    },
  })
  return res.status(200).json({
    code: 0,
    data
  })
}
