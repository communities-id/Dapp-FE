import type { NextApiRequest, NextApiResponse } from 'next'
import { syncRelayerEvents } from '@/shared/asyncJob'
import axios from 'axios'


export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  
  const { chainId } = req.query

  const data = await syncRelayerEvents(Number(chainId))

  if (!chainId && process.env.NEXT_PUBLIC_IS_TESTNET !== 'true') {
    try {
      await axios.get('https://testnet.communities.id/api/relayer/cron')
    } catch (e) {}
  }

  return res.status(200).json({
    code: 0,
    data: data
  })
}
