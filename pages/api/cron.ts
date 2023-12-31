import type { NextApiRequest, NextApiResponse } from 'next'
import { updateCommunities, updateMembers } from '@/shared/asyncJob'
import axios from 'axios'


export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  
  const data = await Promise.all([
    updateCommunities(),
    updateMembers()
  ])

  if (process.env.NEXT_PUBLIC_IS_TESTNET !== 'true') {
    try {
      await axios.get('https://testnet.communities.id/api/cron')
    } catch (e) {}
  }

  return res.status(200).json({
    code: 0,
    data
  })
}
