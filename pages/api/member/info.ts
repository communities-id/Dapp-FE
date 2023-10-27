import type { NextApiRequest, NextApiResponse } from 'next'

import { prisma } from '@/shared/prisma'
import { execSearch } from '@/shared/helper'

const t = (v: string): string => v

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  
  const { name } = req.query

  const { type, member } = execSearch(name as string)

  if (type !== 'member') return res.status(200).json({
    code: -1,
    data: null,
    message: 'not member!'
  })

  const data = await prisma.member.findUnique({
    where: {
      name: member
    },
  })
  return res.status(200).json({
    code: 0,
    data
  })
}
