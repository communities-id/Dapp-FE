import { recoverPersonalSignature } from '@metamask/eth-sig-util';
import type { NextApiRequest, NextApiResponse } from 'next'
import { isBotAdmin } from '@/shared/telegram';
import { prisma } from '@/shared/prisma';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  
  const { signature, brandDID, groupId } = req.body

  const recoveredAddr = recoverPersonalSignature({
    data: 'CommunitiesID',
    signature: signature
  })


  const community = await prisma.community.findFirst({
    where: {
      name: brandDID
    }
  })

  if (!community) {
    return res.status(200).json({
      code: 2,
      message: `Brand DID ${brandDID} not found`
    })
  }

  if (community.to?.toLowerCase() !== recoveredAddr?.toLowerCase()) {
    return res.status(200).json({
      code: 3,
      message: 'You are not the owner of this community'
    })
  }

  if (groupId) {
    const existantGroup = await prisma.community.findFirst({
      where: {
        tgGroupID: groupId.toString()
      }
    })
  
    if (existantGroup) {
      return res.status(200).json({
        code: 4,
        message: `Another brand DID "${existantGroup.name}" has bind to this group id. Bind failed.`
      })
    }
  
    const isAdmin = await isBotAdmin(groupId)
    if (!isAdmin) {
      return res.status(200).json({
        code: 1,
        message: 'The communities ID bot is not an administator in your group'
      })
    }
  }

  await prisma.community.update({
    data: {
      tgGroupID: groupId ? groupId : null
    },
    where: {
      name: brandDID
    }
  })

  // await prisma.telegramGroup.upsert({
  //   create: {
  //     brand: brandDID,
  //     registry: community.registry || '',
  //     chainId: community.chainId,
  //     groupId: groupId || '',
  //   },
  //   update: {
  //     groupId: groupId || ''
  //   },
  //   where: {
  //     brand: brandDID
  //   }
  // })

  return res.status(200).json({
    code: 0,
    data: {}
  })
}
