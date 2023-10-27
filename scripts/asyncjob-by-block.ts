import * as dotenv from 'dotenv'
dotenv.config()
import CommunitiesID, { SupportedChainIds } from '@communitiesid/id'
import { getCommunitiesEvent, getMemberEvent, getPrimaryRecordEvent } from "@/shared/contract"
import { prisma } from "@/shared/prisma"
import { CHAIN_ID_MAP, CONTRACT_MAP, SDK_OPTIONS, ZERO_ADDRESS } from '@/shared/constant'
import axios from 'axios'
import { banUserWithNoPermission, sendMessage } from '@/shared/telegram'
import { createProvider } from '@/utils/provider'

const domain = process.env.NEXT_PUBLIC_IS_TESTNET === 'true' ? 'https://testnet.communities.id' : 'https://communities.id'
const communitiesidSDK = new CommunitiesID(SDK_OPTIONS)
const allCommunities: any = {}

function logInfo(info: string) {
  console.log(`[${new Date().toISOString()}] ${info}`)
}

async function request(method: 'get' | 'post', url: string, options?: any) {
  try {
    await axios[method](url, options)
  } catch(e) {}
}

async function syncCommunityEventsInOneBlock(chainId: number, block: number) {
  const allEvents = await getCommunitiesEvent(chainId, block, block)
  logInfo(`Syncing community events on chain ${chainId}, block: ${block}, ${allEvents.length} events found`)
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
        communityInfo: JSON.stringify(communityInfo),
        latestBlock: event.blockNumber - 1
      },
    });
    allCommunities[communityInfo.node.registryInterface.toLowerCase()] = communityInfo?.node?.registry.toLowerCase()
    logInfo(`Synced community on chain ${chainId}, tokenId: ${tokenId}, name: ${communityInfo?.node?.node}`);
  }
}

async function syncMemberEventsInOneBlock(registryInterface: string, chainId: number, block: number) {
  const community = await prisma.community.findFirst({
    where: {
      registryInterface
    }
  })
  if (!community) {
    return
  }
  const registry = community.registry as string
  const allEvents = await getMemberEvent(registry, chainId, block, block);
  logInfo(`Syncing member events with in community ${registry}, range: [${block}], ${allEvents.length} events found`)
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
    }
    if (from !== ZERO_ADDRESS) {
      await banUserWithNoPermission(community, from)
    }
  }
}

async function syncPrimaryEventsInOneBlock(block: number) {
  const allEvents = await getPrimaryRecordEvent(block, block);
  logInfo(`Syncing primary record events on block: [${block}], ${allEvents.length} events found`)
  
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
  }
}

async function syncEventsInOneBlock(chainId: SupportedChainIds, block: number) {
  const provider = createProvider(chainId)
  logInfo(`Scanning block ${block} on chain ${chainId}`)
  const log = await provider.getBlockWithTransactions(block)
  logInfo(`Found ${log.transactions.length} transactions on chainId ${chainId} block ${block} `)
  const transactions = log.transactions
  const communityEvents = transactions.filter(v => v.to?.toLowerCase() === CONTRACT_MAP[chainId].MemberRegistryInterfaceFactory.toLowerCase())
  const memberEvents = transactions.filter(v => allCommunities[v.to?.toLowerCase() ?? ''])
  const primaryRecordEvents = transactions.filter(v => v.to?.toLowerCase() === CONTRACT_MAP[chainId].PrimaryRecord.toLowerCase())
  if (communityEvents.length > 0) {
    await syncCommunityEventsInOneBlock(chainId, block)
  }
  if (memberEvents.length > 0) {
    await Promise.all(memberEvents.map(v => syncMemberEventsInOneBlock(v.to?.toLowerCase() ?? '', chainId, block)))
  }
  if (primaryRecordEvents.length > 0) {
    await syncPrimaryEventsInOneBlock(block)
  }
}

function listenEventsOnChain(chainId: SupportedChainIds) {
  const provider = createProvider(chainId)
  provider.on('block', async block => {
    let retryTime = 5
    while (retryTime > 0) {
      try {
        await syncEventsInOneBlock(chainId, block)
        if (retryTime < 5) {
          await sendMessage(5879750850, `Sync chain ${chainId} block ${block} success after retry ${5 - retryTime} times`)
        }
        return
      } catch (e: any) {
        retryTime -= 1
        await sendMessage(5879750850, `Error occurred when syncing events with retry times ${5 - retryTime}`)
        await sendMessage(5879750850, JSON.stringify({
          chainId,
          block,
          error: e.toString()
        }))
      }
    }
  })
  
}

async function main() {
  const communities = await prisma.community.findMany({
    select: {
      registry: true,
      registryInterface: true
    }
  })

  communities.forEach((v) => {
    if (v.registryInterface) {
      allCommunities[v.registryInterface] = v.registry
    }
  })

  const allChains = [5] //Object.values(CHAIN_ID_MAP)
  for (let i = 0; i < allChains.length; i++) {
    listenEventsOnChain(allChains[i] as SupportedChainIds)
  }

  setInterval(async () => {
    await request('get', `${domain}/api/heartbeat`)
  }, 60 * 1000)

}

main()