import { handleMessage, parseMessage, sendMessage } from '@/shared/telegram';
import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  
  if (process.env.NEXT_PUBLIC_IS_TESTNET === 'true') {
    await sendMessage(5879750850, JSON.stringify(req.body, null, 2))
  }
  const parsed = parseMessage(req.body.message || req.body.my_chat_member)

  if (!parsed) {
    return res.status(200).json({
      code: 0,
      data: req.body
    })
  }

  await handleMessage(parsed)

  return res.status(200).json({
    code: 0,
    data: {}
  })
}
