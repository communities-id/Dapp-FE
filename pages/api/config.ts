import { utils } from 'ethers';
import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {

  return res.status(200).json({
    code: 0,
    data: {
      master: process.env.PRIVATE_KEY ? utils.computeAddress(`0x${process.env.PRIVATE_KEY}`) : process.env.MASTER_ADDR,
      ipfs: {
        key: btoa(process.env.IPFS_KEY ?? ''),
        gateway: process.env.IPFS_GATEWAY,
      }
    }
  })
}
