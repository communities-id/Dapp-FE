import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  res.redirect('https://wanderer-labs.notion.site/7a7114a6673f49d6b9818e1b52a5ff9b?v=51f1e5c0d9674f3591a264312fab6b31')
}
