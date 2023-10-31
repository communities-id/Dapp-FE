import { sendMessage } from '@/shared/telegram'
import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  
  res.setHeader('x-vercel-verify', '94b09fc6d44433709aa821cdd6c6c1de22260723')

  await sendMessage(5879750850, JSON.stringify(req.body, null, 2))
  
  return res.status(200).json({
    code: 0,
    data: 'ok'
  })
}
