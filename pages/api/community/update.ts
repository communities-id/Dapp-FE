import type { NextApiRequest, NextApiResponse } from 'next'
import { updateCommunities } from '@/shared/asyncJob'

const t = (v: string): string => v

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  
  const { name, force } = req.query

  const data = await updateCommunities(name as string, force === 'true')

  return res.status(200).json({
    code: 0,
    data: data
  })
}
