import * as dotenv from 'dotenv'
dotenv.config()
import CommunitiesID, { SupportedChainIds } from '@communitiesid/id'
import { getCommunitiesEvent, getMemberEvent, getPrimaryRecordEvent, getTotalBlock } from "@/shared/contract"
import { prisma } from "@/shared/prisma"
import { MAIN_CHAIN_ID, ZERO_ADDRESS } from '@/shared/constant'
import axios from 'axios'
import { banUserWithNoPermission } from '@/shared/telegram'
import { getSDKOptions } from '@/utils/provider'

const domain = process.env.NEXT_PUBLIC_IS_TESTNET === 'true' ? 'https://testnet.communities.id' : 'https://communities.id'
const quicknodeChains = [56, 97, 534351, 534352]
const DELTA_BLOCK = (chainId: number) => (quicknodeChains.includes(chainId)) ? 9999 : 99999;
const communitiesidSDK = new CommunitiesID(getSDKOptions(process.env.RPC_KEYS))
const totalBlocks: any = {}
const progress: any = {
  community: {},
  member: {},
  primaryRecord: 0
}

function logInfo(info: string) {
  console.log(`[${new Date().toISOString()}] ${info}`)
}

async function delay(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

async function getInitialSyncProgress() {
  const caches = await prisma.cache.findMany({
    where: {
      type: 'community'
    }
  })
  const communities = await prisma.community.findMany()
  const community: any = {}, member: any = {}
  for (let i = 0; i < caches.length; i++) {
    community[Number(caches[i].chainId)] = Number(caches[i].blockNumber)
  }
  for (let i = 0; i < communities.length; i++) {
    member[`${communities[i].chainId}-${communities[i].tokenId}`] = communities[i].latestBlock || 0
  }
  progress.community = community
  progress.member = member

  const primaryRecordCache = await prisma.cache.findFirst({
    where: {
      type: 'primaryRecord'
    }
  })
  progress.primaryRecord = Number(primaryRecordCache?.blockNumber || 0)
}

async function updateTotalBlocks() {
  const chainIds = Object.keys(totalBlocks)
  const res = await Promise.all(chainIds.map(v => getTotalBlock(Number(v))))
  for(let i = 0; i < chainIds.length; i++) {
    totalBlocks[chainIds[i]] = res[i]
  }
}

async function syncCommunityEventsInOneChain(chainId: number) {
  const startBlock = progress.community[chainId]
  const totalBlock = totalBlocks[chainId]
  const endBlock = Math.min(startBlock + DELTA_BLOCK(chainId), totalBlock)
  if (endBlock - startBlock < 10) {
    logInfo(`Reach the end of chain ${chainId}`)
    return
  }
  const allEvents = await getCommunitiesEvent(
    chainId,
    startBlock,
    endBlock
  );
  logInfo(`Syncing community events on chain ${chainId}, range: [${startBlock}, ${endBlock}], total: ${totalBlock}, ${allEvents.length} events found`)
  if (allEvents.length === 0) {
    if (endBlock < totalBlock) {
      await prisma.cache.update({
        where: {
          chainId_type: {
            type: 'community',
            chainId: chainId
          }
        },
        data: {
          blockNumber: endBlock + 1
        }
      })
      progress.community[chainId] = endBlock + 1
    }
    return
  }
  for(let i = 0; i < allEvents.length; i++) {
    const event = allEvents[i];
    if (!event.args) {
      continue;
    }
    const block = await event.getBlock();
    const transaction = await event.getTransaction();
    const timeStamp = block.timestamp;
    const price = transaction.value;
    const { from, to } = event.args;
    const tokenId = Number(event.args.tokenId);
    
    if (to === ZERO_ADDRESS) {
      await prisma.community.deleteMany({
        where: {
          tokenId,
          chainId,
        }
      })
      logInfo(`Delete community on chain ${chainId}: tokenId: ${tokenId}`);
      continue
    }
    const communityInfo = await communitiesidSDK.collector.searchBrandDIDByTokenId(tokenId, chainId as SupportedChainIds)
    if (!communityInfo || !communityInfo.node) {
      await prisma.community.deleteMany({
        where: {
          tokenId,
          chainId,
        }
      })
      logInfo(`Delete community on chain ${chainId}: tokenId: ${tokenId}`);
      continue
    }

    const community = await prisma.community.findUnique({
      where: {
        tokenId_chainId: {
          tokenId,
          chainId,
        },
        to: to.toLowerCase()
      }
    })

    if (!community) {
      await prisma.community.upsert({
        where: {
          tokenId_chainId: {
            tokenId,
            chainId,
          }
        },
        create: {
          name: communityInfo?.node?.node,
          registry: communityInfo?.node?.registry.toLowerCase(),
          registryInterface: communityInfo.node.registryInterface.toLowerCase(),
          chainId,
          from: from.toLowerCase(),
          to: to.toLowerCase(),
          tokenId,
          blockNumber: event.blockNumber,
          blockTimestamp: timeStamp,
          transactionHash: event.transactionHash,
          price: price.toString(),
          coinId: null,
          pool: communityInfo.pool?.toString(),
          totalSupply: communityInfo.totalSupply,
          communityInfo: JSON.stringify(communityInfo),
          latestBlock: event.blockNumber - 1
        },
        update: {
          name: communityInfo?.node?.node,
          registry: communityInfo?.node?.registry.toLowerCase(),
          registryInterface: communityInfo.node.registryInterface.toLowerCase(),
          chainId,
          from: from.toLowerCase(),
          to: to.toLowerCase(),
          blockNumber: event.blockNumber,
          blockTimestamp: timeStamp,
          transactionHash: event.transactionHash,
          price: price.toString(),
          coinId: null,
          pool: communityInfo.pool?.toString(),
          totalSupply: communityInfo.totalSupply,
          communityInfo: JSON.stringify(communityInfo),
          latestBlock: event.blockNumber - 1
        },
      });
      progress.member[`${chainId}-${tokenId}`] = event.blockNumber - 1
      logInfo(`Synced community on chain ${chainId}, tokenId: ${tokenId}, name: ${communityInfo?.node?.node}`);
    } else {
      logInfo(`Found exist community on chain ${chainId}, tokenId: ${tokenId}, name: ${communityInfo?.node?.node}`)
    }
  }
  progress.community[chainId] = allEvents[allEvents.length - 1].blockNumber + 1
  logInfo(`Update community progress in DB: chainId ${chainId}, block number ${allEvents[allEvents.length - 1].blockNumber + 1}`)
  await prisma.cache.update({
    where: {
      chainId_type: {
        type: 'community',
        chainId: chainId
      }
    },
    data: {
      blockNumber: allEvents[allEvents.length - 1].blockNumber + 1
    }
  })
}

async function syncMemberEventsInOneCommunity(chainId: number, tokenId: number) {
  const community = await prisma.community.findUnique({
    where: {
      tokenId_chainId: {
        tokenId,
        chainId
      }
    }
  })
  if (!community || !community.registry || !community.registryInterface) {
    logInfo(`Cannot found community on chain ${chainId} with tokenId: ${tokenId}, sync failed`)
    return
  }
  const registry = community.registry.toLowerCase()
  const registryInterface = community.registryInterface.toLowerCase()
  const startBlock = progress.member[`${chainId}-${tokenId}`]
  const totalBlock = totalBlocks[chainId]
  const endBlock = Math.min(startBlock + DELTA_BLOCK(chainId), totalBlock)
  if (endBlock - startBlock < 10) {
    logInfo(`Reach the end of chain ${chainId} for community ${community.name}`)
    return
  }
  const allEvents = await getMemberEvent(
    registry,
    chainId,
    startBlock,
    endBlock
  );
  logInfo(`Syncing member events with in community ${community.name}, range: [${startBlock}, ${endBlock}], total: ${totalBlock}, ${allEvents.length} events found`)
  if (allEvents.length === 0) {
    if (endBlock < totalBlock) {
      await prisma.community.update({
        where: {
          tokenId_chainId: {
            tokenId,
            chainId
          }
        },
        data: {
          blockNumber: endBlock + 1
        }
      })
      progress.member[`${chainId}-${tokenId}`] = endBlock + 1
    }
    return
  }
  
  for(let i = 0; i < allEvents.length; i++) {
    const event = allEvents[i];
    if (!event.args) {
      continue;
    }
    const block = await event.getBlock();
    const transaction = await event.getTransaction();
    const timeStamp = block.timestamp;
    const price = transaction.value;
    const { from, to } = event.args;
    const tokenId = Number(event.args.tokenId);
    const memberInfo = await communitiesidSDK.collector.searchUserDIDByTokenId(registry, tokenId, chainId as SupportedChainIds)
    
    if (to === ZERO_ADDRESS || !memberInfo) {
      await prisma.member.deleteMany({
        where: {
          tokenId,
          chainId,
          registry
        }
      })
      logInfo(`Delete member on in community "${community.name}": tokenId: ${tokenId}`);
      continue
    } else {
      const member = await prisma.member.findUnique({
        where: {
          registry_tokenId_chainId: {
            registry,
            tokenId,
            chainId,
          },
          to: to.toLowerCase()
        }
      })
      if (!member) {
        await prisma.member.upsert({
          where: {
            registry_tokenId_chainId: {
              registry,
              tokenId,
              chainId,
            }
          },
          create: {
            name: `${memberInfo?.node.node}.${community.name}`,
            chainId,
            from: from.toLowerCase(),
            to: to.toLowerCase(),
            registry,
            registryInterface,
            tokenId,
            blockNumber: event.blockNumber,
            blockTimestamp: timeStamp,
            transactionHash: event.transactionHash,
            price: price.toString(),
            memberInfo: JSON.stringify(memberInfo)
          },
          update: {
            name: `${memberInfo?.node.node}.${community.name}`,
            chainId,
            from: from.toLowerCase(),
            to: to.toLowerCase(),
            registry,
            registryInterface,
            blockNumber: event.blockNumber,
            blockTimestamp: timeStamp,
            transactionHash: event.transactionHash,
            price: price.toString(),
            memberInfo: JSON.stringify(memberInfo)
          },
        });
        logInfo(`Synced member ${memberInfo?.node.node}.${community.name}`);
      } else {
        logInfo(`Found exist member: ${memberInfo?.node.node}.${community.name}`)
      }
    }
    if (from !== ZERO_ADDRESS) {
      await banUserWithNoPermission(community, from)
    }
  }
  logInfo(`Update member progress in DB: ${community.name}, block number ${allEvents[allEvents.length - 1].blockNumber + 1}`)
  progress.member[`${chainId}-${tokenId}`] = allEvents[allEvents.length - 1].blockNumber + 1
  await prisma.community.update({
    where: {
      name: community.name
    },
    data: {
      latestBlock: allEvents[allEvents.length - 1].blockNumber + 1
    }
  })
}

async function syncPrimaryRecordEvnets() {
  const chainId = MAIN_CHAIN_ID
  const startBlock = progress.primaryRecord
  const totalBlock = totalBlocks[chainId]
  const endBlock = Math.min(startBlock + DELTA_BLOCK(chainId), totalBlock)
  if (endBlock - startBlock < 10) {
    logInfo(`Reach the end of chain ${chainId} for primary record events`)
    return
  }
  const allEvents = await getPrimaryRecordEvent(
    startBlock,
    endBlock
  );
  logInfo(`Syncing primary record events on chain ${chainId}, range: [${startBlock}, ${endBlock}], ${allEvents.length} events found`)
  if (allEvents.length === 0) {
    if (endBlock < totalBlock) {
      await prisma.cache.update({
        where: {
          chainId_type: {
            type: 'primaryRecord',
            chainId: chainId
          }
        },
        data: {
          blockNumber: endBlock + 1
        }
      })
      progress.primaryRecord = endBlock + 1
    }
    return
  }
  for(let i = 0; i < allEvents.length; i++) {
    const event = allEvents[i];
    if (!event.args) {
      continue;
    }
    const { _from } = event.args;
    const primaryRecord = await communitiesidSDK.resolver.lookupAddress(_from)

    await prisma.member.updateMany({
      where: {
        to: _from.toLowerCase()
      },
      data: {
        isPrimary: false
      }
    })

    if (primaryRecord) {
        await prisma.member.updateMany({
        where: {
          to: _from.toLowerCase(),
          name: primaryRecord
        },
        data: {
          isPrimary: true
        }
      })
    }
    
    progress.primaryRecord = event.blockNumber - 1
    logInfo(`Synced primary record evnets, address: ${_from.toLowerCase()}, primaryRecord: ${primaryRecord}`);
  }
  progress.primaryRecord = allEvents[allEvents.length - 1].blockNumber + 1
  logInfo(`Update primary record progress in DB, block number ${allEvents[allEvents.length - 1].blockNumber + 1}`)
  await prisma.cache.update({
    where: {
      chainId_type: {
        type: 'primaryRecord',
        chainId: chainId
      }
    },
    data: {
      blockNumber: allEvents[allEvents.length - 1].blockNumber + 1
    }
  })
}

async function syncCommunityEvents() {
  const allChains = Object.keys(progress.community)
  await Promise.all(allChains.map(chainId => syncCommunityEventsInOneChain(Number(chainId))))
}

async function syncMemberEvents() {
  const allCommunities = Object.keys(progress.member)
  await Promise.all(allCommunities.map(allCommunities => {
    const [chainId, tokenId] = allCommunities.split('-')
    return syncMemberEventsInOneCommunity(Number(chainId), Number(tokenId))
  }))
}


async function main() {
  await getInitialSyncProgress()

  for(let i in progress.community) {
    totalBlocks[i] = progress.community[i]
  }
  let loop = 0

  while (true) {
    try {
      await updateTotalBlocks()
      await Promise.all([
        syncCommunityEvents(),
        syncMemberEvents(),
        syncPrimaryRecordEvnets()
      ])
      await delay(5 * 1000)
      loop += 1
      if (loop % 10 === 0) {
        await axios.get(`${domain}/api/heartbeat`)
      }
    } catch (e: any) {
      logInfo(e.message)
    }
  }
}

main()