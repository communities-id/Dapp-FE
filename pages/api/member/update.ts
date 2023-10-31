import type { NextApiRequest, NextApiResponse } from 'next'
import { updateMembers } from '@/shared/asyncJob'


export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  
  const { name, force } = req.query

  await updateMembers(name as string, force === 'true')
  
  return res.status(200).json({
    code: 0,
    data: 'ok'
  })
}
