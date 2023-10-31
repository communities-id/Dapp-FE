import type { NextApiRequest, NextApiResponse } from 'next'

import { prisma } from '@/shared/prisma'
import { execSearch } from '@/shared/helper'


export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  
  const { name } = req.query

  const { type, community } = execSearch(name as string)

  if (type !== 'community') return res.status(200).json({
    code: -1,
    data: null,
    message: 'not community!'
  })

  try {
    const data = await prisma.community.findUnique({
      where: {
        name: community
      },
    })
    return res.status(200).json({
      code: 0,
      data
    })
  } catch (err) {
    console.log('--- err', err)
    throw err
  }
}
