import type { NextApiRequest, NextApiResponse } from 'next'

const t = (v: string): string => v

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  
  return res.status(200).json({
    code: 0,
    data: 'ok'
  })
}
