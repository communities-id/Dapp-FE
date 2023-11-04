import { BigNumber, ethers } from "ethers";
import type { Event } from "ethers";
import axios from 'axios';

import { ABIs, CONTRACT_MAP, DEFAULT_TOKEN_SYMBOL, MAIN_CHAIN_ID, ZERO_ADDRESS } from "@/shared/constant";
import { keccak256 } from "@/shared/helper";
import { createProvider } from '@/utils/provider'

export const getReadableContract = (contractAddress: string, ABIKey: keyof typeof ABIs, chainId: number = MAIN_CHAIN_ID) => {
  const contracts = new Map<string, ethers.Contract>()
  return (() => {
    const key = `${contractAddress}-${ABIKey}-${chainId}`
    if (contracts.has(key)) {
      return contracts.get(key) as ethers.Contract
    }
    const provider = createProvider(chainId)
    const abi = ABIs[ABIKey]
    contracts.set(key, new ethers.Contract(contractAddress, abi, provider))

    return contracts.get(key) as ethers.Contract
  })()
};

export const getWritableContract = (address: string, ABIKey: keyof typeof ABIs, chainId: number = MAIN_CHAIN_ID, signer: ethers.providers.JsonRpcSigner) => {
  const contracts = new Map<string, ethers.Contract>()
  return (() => {
    const provider = createProvider(chainId)
    const abi = ABIs[ABIKey]
    console.log('address', address, '-ABIKey', ABIKey, '- abi', abi)
    const contract = new ethers.Contract(address, abi, provider)

    return contract.connect(signer)
  })()
};

export const getPrivateWritableContract = (address: string, ABIKey: keyof typeof ABIs, chainId: number = MAIN_CHAIN_ID) => {
  const contracts = new Map<string, ethers.Contract>()
  return (() => {
    const key = `${address}-${ABIKey}-${chainId}`
    if (contracts.has(key)) {
      return contracts.get(key) as ethers.Contract
    }
    const provider = createProvider(chainId)
    const abi = ABIs[ABIKey]
    const contract = new ethers.Contract(address, abi, provider)
    const signer = new ethers.Wallet(process.env.PRIVATE_KEY as string, provider)
    contracts.set(key, contract.connect(signer))

    return contracts.get(key) as ethers.Contract
  })()
};


export const getTotalBlock = async (chainId: number = MAIN_CHAIN_ID) => {
  const provider = createProvider(chainId)
  const blockNumber = await provider.getBlockNumber()
  return blockNumber - 1
};

export const getCommunitiesEvent = async (chainId: number, from: number, to?: number): Promise<Event[]> => {
  const contractAddress = CONTRACT_MAP[chainId]
  const contract = getReadableContract(contractAddress.CommunityRegistry, 'CommunityRegistry', chainId)
  const eventFilter = contract.filters.Transfer()
  const events = await contract.queryFilter(eventFilter, from, to)
  return events
};

export const getPrimaryRecordEvent = async (from: number, to: number): Promise<Event[]> => {
  const contractAddress = CONTRACT_MAP[MAIN_CHAIN_ID]
  const contract = getReadableContract(contractAddress.PrimaryRecord, 'PrimaryRecord', MAIN_CHAIN_ID)
  const eventFilter = contract.filters.PrimaryRecordSet()
  const events = await contract.queryFilter(eventFilter, from, to)
  return events
}

export const getRelayerEvent = async (chainId: number, from: number, to?: number): Promise<Event[]> => {
  const contractAddress = CONTRACT_MAP[chainId]
  let contract = null
  if (chainId === MAIN_CHAIN_ID) {
    contract = getReadableContract(contractAddress.RelayerCommunityRegistryInterface, 'RelayerCommunityRegistryInterface', chainId)
  } else {
    contract = getReadableContract(contractAddress.CommunityRegistryInterface, 'RelayerReplicaCommunityRegistryInterface', chainId)
  }
  const eventFilter = contract.filters.RelayerMsg()
  const events = await contract.queryFilter(eventFilter, from, to)
  return events
}

export const getMemberEvent = async (address: string, chainId: number, from: number, to?: number): Promise<Event[]> => {
  const contract = getReadableContract(address, 'MemberRegistry', chainId);
  const eventFilter = contract.filters.Transfer();
  const events = await contract.queryFilter(eventFilter, from, to);
  return events;
};

export const getCommunityInfoByTokenId = async (tokenId: BigNumber, chainId: number) => {
  const contractAddress = CONTRACT_MAP[chainId]
  const CommunityRegistry = getReadableContract(contractAddress.CommunityRegistry, 'CommunityRegistry', chainId);
  const MemberRegistryInterfaceFactory = getReadableContract(contractAddress.MemberRegistryInterfaceFactory, 'MemberRegistryInterfaceFactory', chainId);

  const node = await CommunityRegistry.getNodeByTokenId(tokenId)
  const registryInterface = await MemberRegistryInterfaceFactory.getMemberRegistryInterface(keccak256(node.node))

  const { pool, coin } = await getCommunityInfo(registryInterface, chainId)

  return {
    registry: node.registry.toLowerCase(),
    registryInterface: registryInterface.toLowerCase(),
    pool,
    coin,
  }
}

export const getCommunityInfo = async (address: string, chainId: number) => {
  try {
    const MemberRegistryInterface = getReadableContract(address, 'MemberRegistryInterface', chainId);
    const pool = await MemberRegistryInterface.getCapitalPool()
    const config = await MemberRegistryInterface.getConfig()
    return {
      pool: pool.toString(),
      coin: config.coin,
    };
  } catch (e) {
    return {
      pool: '',
      coin: ''
    };
  }
};

export const getTokenDecimal = async (address: string, chainId: number) => {
  try {
    const contract = getReadableContract(address, 'ERC20', chainId);
    const decimal = await contract.decimals();
    return decimal
  } catch (e) {
    console.log(e)
    return 18
  }
};

export const getTokenSymbol = async (address: string, chainId: number = MAIN_CHAIN_ID) => {
  if (address === ZERO_ADDRESS) {
    return DEFAULT_TOKEN_SYMBOL[chainId]
  }
  try {
    const contract = getReadableContract(address, 'ERC20', chainId);
    const symbol = await contract.symbol();
    return symbol
  } catch (e) {
    console.log(e)
    return ''
  }
};

export const executeRelayer = async (id: string, dstChainId: number, payload: any, prisma: any) => {
  let contract
  const contractAddress = CONTRACT_MAP[dstChainId]
  // release
  if (dstChainId === MAIN_CHAIN_ID) {
    contract = getPrivateWritableContract(contractAddress.RelayerCommunityRegistryInterface, 'RelayerCommunityRegistryInterface', dstChainId);
  } else {
    // create
    contract = getPrivateWritableContract(contractAddress.CommunityRegistryInterface, 'RelayerReplicaCommunityRegistryInterface', dstChainId);
  }
  try {
    const feeData = await contract.provider.getFeeData()
    const tx = await contract.receiveMsg(payload, {
      gasPrice: feeData.gasPrice
    })
    console.log(`Executing receiveMsg to ${dstChainId}`)
    const receipt = await tx.wait()
    await prisma.relayer.update({
      data: {
        dstBlock: receipt.blockNumber,
        dstAddress: contract.address,
        dstChain: dstChainId,
        dstTx: tx.hash,
        dstErr: '',
        status: 1
      },
      where: {
        id
      }
    })

  } catch (e: any) {
    await prisma.relayer.update({
      data: {
        dstAddress: contract.address,
        dstChain: dstChainId,
        dstErr: e.toString(),
        status: 2
      },
      where: {
        id
      }
    })
  }
}

export const getDefaultCoinPrice = async (coin = 'ETH') => {
  const res = await axios.get(`https://min-api.cryptocompare.com/data/price?fsym=${coin}&tsyms=USD`)
  return res.data.USD as number
}

export const batchGetDefaultCoinPrice = async (coins = ['ETH']) => {
  const fsyms = coins.join(',')
  const res = await axios.get(`https://min-api.cryptocompare.com/data/price?fsym=USD&tsyms=${fsyms}`)
  if (!res.data) {
    return {}
  }
  const prices: Record<string, number> = {}
  for (let i in res.data) {
    prices[i] = 1 / res.data[i]
  }
  return prices
}