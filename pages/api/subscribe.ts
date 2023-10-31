import type { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from '@/shared/prisma'


export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  
  const email = req.body.email as string

  if (!email) {
    return res.status(200).json({
      code: -1,
      message: 'email is required'
    })
  }

  await prisma.form.create({
    data: {
      email,
    }
  })

  return res.status(200).json({
    code: 0,
    data: null
  })
}
