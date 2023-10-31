import { prisma } from "@/shared/prisma";
import type { Event } from "ethers";
import CommunitiesID from '@communitiesid/id'
import {
  executeRelayer,
  getRelayerEvent,
  getTotalBlock,
} from "./contract";
import { getTokenPrice } from "./price";
import { CHAINS_ID_TO_NETWORK, CONTRACT_MAP, MAIN_CHAIN_ID, ZERO_ADDRESS } from "./constant";
import { Community, Member } from "@prisma/client";
import { getSDKOptions } from "@/utils/provider";

const DELTA_BLOCK = (chainId: number) => 9999
const communitiesidSDK = new CommunitiesID(getSDKOptions(process.env.RPC_KEYS))

function pickEvents(allEvents: Event[]) {
  if (allEvents.length <= 10) {
    return allEvents
  }
  if (allEvents[0].blockNumber !== allEvents[9].blockNumber) {
    return allEvents.slice(0, 10)
  }
  return allEvents
}


export const syncRelayerEvents = async (chainId?: number) => {
  async function syncRelayerEventsInOneChain(srcChainId: number) {
    const cache = await prisma.cache.findFirst({
      where: {
        type: "relayer",
        chainId: srcChainId
      },
    });
    if (!cache) {
      return
    }
    const chainId = Number(cache.chainId);
    const totalBlock = await getTotalBlock(chainId);
    const startBlock = Number(cache.blockNumber);
    const endBlock = startBlock + DELTA_BLOCK(chainId);
    const allEvents = await getRelayerEvent(
      chainId,
      startBlock,
      Math.min(totalBlock, endBlock)
    );
    const events = pickEvents(allEvents)

    const taskFactory = async (event: Event) => {
      if (!event.args) {
        return;
      }
      const { chainId, payload } = event.args
      const dstChainId = Number(chainId)

      const relayerEvent = await prisma.relayer.create({
        data: {
          srcBlock: event.blockNumber,
          srcChain: srcChainId,
          srcTx: event.transactionHash,
          srcAddress: srcChainId === MAIN_CHAIN_ID ? CONTRACT_MAP[srcChainId].RelayerCommunityRegistryInterface : CONTRACT_MAP[srcChainId].CommunityRegistryInterface,
          payload,
          dstChain: dstChainId,
        }
      })

      await executeRelayer(relayerEvent.id, dstChainId, payload, prisma)
    };

    let newBlock = Math.min(
      allEvents.length === 0
        ? endBlock
        : events[events.length - 1].blockNumber + 1,
      totalBlock
    );
    await prisma.cache.updateMany({
      where: {
        id: cache.id,
      },
      data: {
        blockNumber: newBlock,
      },
    });
    for (let i = 0; i < events.length; i++) {
      await taskFactory(events[i])
    }
    return events
  }

  const allChains = chainId ? [chainId] : Object.keys(CHAINS_ID_TO_NETWORK).map(v => Number(v))
  const res: any = {}
  for (let i = 0; i < allChains.length; i++) {
    console.log('sync relayer events in chain', allChains[i])
    res[allChains[i]] = await syncRelayerEventsInOneChain(allChains[i])
  }
  return res
}

export const updateCommunities = async (name?: string, force: boolean = false) => {
  let communitiesToUpdate: Community[] = []
  if (name) {
    const where: any = {
      name
    }
    if (!force) {
      where.updatedAt = {
        lt: new Date(new Date().getTime() - 1000 * 60 * 5)
      }
    }
    communitiesToUpdate = await prisma.community.findMany({
      where: where
    })
  } else {
    communitiesToUpdate = await prisma.community.findMany({
      where: {
        updatedAt: {
          lt: new Date(new Date().getTime() - 1000 * 3600 * 24 * 7)
        }
      },
      orderBy: {
        updatedAt: 'asc'
      },
      take: 5
    })
  }
  
  const res = await Promise.all(communitiesToUpdate.map(async (community) => {
    const { name } = community
    const communityInfo = await communitiesidSDK.collector.searchBrandDID(name as string)
    await prisma.community.update({
      where: {
        name: name as string
      },
      data: {
        pool: (communityInfo?.pool ?? 0).toString(),
        communityInfo: JSON.stringify(communityInfo)
      }
    })
    const originalCommunityInfo = JSON.parse(community.communityInfo as string)
    if (communityInfo?.tokenUri?.brand_color !== originalCommunityInfo?.tokenUri?.brand_color) {
      await prisma.member.updateMany({
        where: {
          chainId: community.chainId,
          registry: community.registry
        },
        data: {
          updatedAt: new Date(0)
        }
      })
    }
    console.log(`Update community info for ${name}`)
    return communityInfo
  }))
  return res
}

export const updateMembers = async (name?: string, force: boolean = false) => {
  let membersToUpdate: Member[] = []
  if (name) {
    const where: any = {
      name
    }
    if (!force) {
      where.updatedAt = {
        lt: new Date(new Date().getTime() - 1000 * 60 * 5)
      }
    }
    membersToUpdate = await prisma.member.findMany({
      where
    })
  } else {
    membersToUpdate = await prisma.member.findMany({
      where: {
        updatedAt: {
          lt: new Date(new Date().getTime() - 1000 * 3600 * 24 * 7)
        }
      },
      orderBy: {
        updatedAt: 'asc'
      },
      take: 5
    })
  }

  const res = await Promise.all(membersToUpdate.map(async (member) => {
    const { name } = member
    const memberInfo = await communitiesidSDK.collector.searchUserDID(name as string)
    await prisma.member.update({
      where: {
        name: name as string
      },
      data: {
        memberInfo: JSON.stringify(memberInfo)
      }
    })
    console.log(`Update member info for ${name}`)
    return name
  }))
  return res
}

export const updateTokenPrice = async () => {
  const coin = await prisma.coin.findFirst({
    select: {
      contract: true,
      chainId: true,
    },
    orderBy: {
      updatedAt: 'asc'
    }
  });

  if (!coin) {
    return
  }

  const price = await getTokenPrice(coin.contract, Number(coin.chainId));

  await prisma.coin.update({
    where: {
      contract_chainId: {
        contract: coin.contract,
        chainId: coin.chainId,
      }
    },
    data: {
      usdPrice: price.toJSON().usdPrice,
      tokenDecimal: Number(price.toJSON().tokenDecimals),
    },
  })
};
