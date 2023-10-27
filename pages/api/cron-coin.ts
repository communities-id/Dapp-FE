import type { NextApiRequest, NextApiResponse } from 'next'
import { updateTokenPrice } from '@/shared/asyncJob'

const t = (v: string): string => v

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  
  await updateTokenPrice()

  return res.status(200).json({
    code: 0,
    data: {}
  })
}
