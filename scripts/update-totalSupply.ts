import * as dotenv from 'dotenv'
dotenv.config()
import CommunitiesID, { BrandDID, SupportedChainIds } from '@communitiesid/id'
import { getCommunitiesEvent, getMemberEvent, getPrimaryRecordEvent } from "@/shared/contract"
import { prisma } from "@/shared/prisma"
import { CHAIN_ID_MAP, CONTRACT_MAP, ZERO_ADDRESS } from '@/shared/constant'
import axios from 'axios'
import { banUserWithNoPermission, sendMessage } from '@/shared/telegram'
import { getSDKOptions, createProvider } from '@/utils/provider'

async function main() {
  const communities = await prisma.community.findMany()

  await Promise.all(communities.map(async (community) => {
    const communityInfo = JSON.parse(community.communityInfo as string) as BrandDID
    if (communityInfo.totalSupply  && communityInfo.totalSupply > 0 && community.totalSupply === 0) {
      await prisma.community.update({
        where: {
          name: community.name
        },
        data: {
          totalSupply: communityInfo.totalSupply
        }
      })
      console.log(community.name, communityInfo.totalSupply)
    }
  }))

}

main()