import { recoverPersonalSignature } from '@metamask/eth-sig-util';
import type { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from '@/shared/prisma';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  
  const { signature, userId, address } = req.body

  const recoveredAddr = recoverPersonalSignature({
    data: 'CommunitiesID',
    signature: signature
  })


  if (address.toLowerCase() !== recoveredAddr?.toLowerCase()) {
    return res.status(200).json({
      code: 1,
      message: 'Wrong signature'
    })
  }

  await prisma.telegramUser.upsert({
    create: {
      address: recoveredAddr.toLowerCase(),
      userId: userId.toString()
    },
    update: {
      userId: userId.toString()
    },
    where: {
      address: recoveredAddr.toLowerCase(),
    }
  })

  return res.status(200).json({
    code: 0,
    data: {}
  })
}
