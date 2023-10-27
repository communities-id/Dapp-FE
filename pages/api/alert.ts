import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  
  const { body } = req

  console.error(JSON.stringify(body))

  return res.status(400).json({
    code: 0,
    data: body
  })
}
