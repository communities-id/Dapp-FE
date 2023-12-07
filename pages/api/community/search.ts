import { prisma } from '@/shared/prisma'
import { BrandDID, ZERO_ADDRESS } from '@communitiesid/id'
import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  
  const communities = await prisma.community.findMany()

  const data = communities.map((community) => {
    const communityInfo = JSON.parse(community.communityInfo as string) as BrandDID
    return {
      name: community.name,
      chainId: community.chainId,
      totalSupply: community.totalSupply,
      image: communityInfo.tokenUri?.image,
      priceModel: communityInfo.priceModel,
      durationUnit: communityInfo.config?.durationUnit ?? 365,
      coin: communityInfo.config?.coin === ZERO_ADDRESS ? '' : communityInfo.config?.coin,
    }
  })

  return res.status(200).json({
    code: 0,
    data: data
  })
}
