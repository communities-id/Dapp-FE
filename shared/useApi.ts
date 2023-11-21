import { useEffect, useMemo } from 'react'
import { BigNumber, ethers } from 'ethers'
import { useConnectModal } from '@rainbow-me/rainbowkit'
import { useNetwork, useSwitchNetwork } from 'wagmi'
import CommunitiesID, { SupportedChains, BrandDID, UserDID, ChainIDs, TestnetChainIDs } from '@communitiesid/id'

import { useWallet } from '@/hooks/wallet'
import { ZERO_ADDRESS, MAIN_CHAIN_ID, CHAIN_ID, CONTRACT_MAP, maxApproveValue, SDK_OPTIONS, CHAINS_ID_TO_NETWORK } from '@/shared/constant';
import { fetchAddressCommunities, fetchAddressMembers, fetchCommunityInfo, fetchERC20Coin, fetchMemberInfo, fetchMembersOfCommunity, fetchPrimaryDID, triggerRelayerCron, updateCommunity, updateMember } from '@/shared/apis'
import { encodeString, keccak256, parseTokenURI } from '@/shared/helper'
import { getTokenSymbol, getReadableContract, getWritableContract } from '@/shared/contract'
import { useTokenPrice } from '@/contexts/tokenPrice'
import { formatInfo } from '@/utils/format'
import { BNMul } from '@/utils/math'
import { useDetails } from '@/contexts/details'

import { CommunityInfo, MemberInfo, CommunityMember, PersonCommunity, PersonIdentity } from '@/types'
import { CommunityMemberConfig, ContractVerison, SequenceMode } from '@/types/contract'
import { SupportedChainIDs, TotalSupportedChainIDs } from '@/types/chain'
import { GasFeeData, ContractAddressesKeys, ABIKeys, CommunityMintConfig, CommunityPrice } from '@/types/contract'

interface CreateOmniNodeData {
  targetChainId: number
  signature?: string
  owner?: string
}
interface CreateOmniNodeParams {
  chainId: number
}

interface RenewCommunityParams {
  chainId: number
  price: number | BigNumber
  durationUnit?: number
}

interface MintCommunityData {
  price: number | BigNumber
  mintTo: string
  signature?: string
  owner?: string
}

interface MintCommunityParams {
  chainId: number
}

interface updateCommunityBrandConfigData {
  image: string
  brandImage: string
  description: string
  brandColor: string
  externalUrl: string
  discord: string
  twitter: string
  telegram: string
}

interface updateCommunityBrandConfigParams {
  chainId: number
}

interface UpdateCommunityMintConfigParams {
  chainId: number
  decimals?: number
}
type UpdateVariableCommunityMintConfigData = CommunityMemberConfig & CommunityMintConfig
interface UpdateVariableCommunityMintConfigParams {
  chainId: number
  decimals?: number
}
type UpdateCommunityMintConfigData = CommunityMemberConfig & CommunityMintConfig & CommunityPrice
interface UpdateCommunityMintConfigParams {
  chainId: number
  decimals?: number
}
interface MintMemberParams {
  chainId: number
  price: number | BigNumber
  mintTo: string
  signature?: string
  owner?: string
}
interface RenewMemberParams {
  chainId: number
  price: number | BigNumber
}
interface UpdateMemberData {
  externalUrl: string
  discord: string
  twitter: string
  telegram: string
}

interface UpdateMemberParams {
  chainId: number
}
interface Erc20PriceToUSDParams {
  chainId: TotalSupportedChainIDs
}
interface ApproveErc20Params {
  chainId: number
  price: number | BigNumber
}

console.log('-SDK_OPTIONS', SDK_OPTIONS)
const communitiesidSDK = new CommunitiesID(SDK_OPTIONS)

export function getSDKProvider (chainId: number) {
  const chainname = CHAINS_ID_TO_NETWORK[chainId]
  return communitiesidSDK.providers[chainname as SupportedChains] as ethers.providers.Provider
}

const spcialFeeMap: Partial<Record<TotalSupportedChainIDs, number>> = {
  [ChainIDs.Polygon]: 1.6,
  [TestnetChainIDs['Polygon Mumbai']]: 1.6,
}
export async function getBaseFeeData(provider: ethers.providers.Provider | null, network: number) {
  provider = provider ?? getSDKProvider(network)
  const feeData = await provider.getFeeData()
  const { gasPrice, ...other } = feeData
  if (gasPrice && spcialFeeMap[network as TotalSupportedChainIDs]) {
    console.log('- gasPrice', gasPrice, 'after', BNMul(gasPrice, spcialFeeMap[network as TotalSupportedChainIDs] ?? 1))
    return {
      gasPrice: BNMul(gasPrice, spcialFeeMap[network as TotalSupportedChainIDs] ?? 1),
      ...other
    }
  }
  return feeData
}

export function getContractAddress(keyOrAddress: string, chainId: number = CHAIN_ID) {
  return CONTRACT_MAP[chainId]?.[keyOrAddress as ContractAddressesKeys] ?? keyOrAddress
}

export function getCommunityReadableContract(keyOrAddress: string, abiKey: ABIKeys, chainId: number = CHAIN_ID) {
  const communityContractAddress = getContractAddress(keyOrAddress as ContractAddressesKeys, chainId)
  return getReadableContract(communityContractAddress, abiKey, chainId)
}

export function getCommunityWriteableContract(keyOrAddress: string, abiKey: ABIKeys, chainId: number = CHAIN_ID, signer?: ethers.providers.JsonRpcSigner) {
  if (!signer) return null
  const communityContractAddress = getContractAddress(keyOrAddress as ContractAddressesKeys, chainId)
  return getWritableContract(communityContractAddress, abiKey, chainId, signer)
}

export async function getBrandDIDChainId(name: string, needHash: boolean = true) {
  return communitiesidSDK.collector.getBrandDIDChainId(name, needHash)
}

export async function getPrimaryMember(address: string) {
  const primaryRecord = await fetchPrimaryDID(address)
  if (primaryRecord.data) {
    return primaryRecord.data
  }
  return communitiesidSDK.resolver.lookupAddress(address)
}

export async function searchCommunity(name: string): Promise<Partial<CommunityInfo> & Pick<CommunityInfo, 'chainId' | 'communityCoinSymbol' | 'node'>> {
  const communityRes = await fetchCommunityInfo(name)
  let community
  try {
    if (communityRes.data) {
      community = formatInfo(JSON.parse(communityRes.data.communityInfo))
      community.tgGroupId = communityRes.data.tgGroupID
    } else {
      throw new Error('Cannot find from cache')
    }
  } catch (e) {
    community = await communitiesidSDK.collector.searchBrandDID(name)
  }

  if (!community?.node || !community.config || !community.priceModel || !community.tokenUri) {
    const chainId = community?.chainId ?? 0
    // to do: move to global context; cache in db
    const communityCoinSymbol = chainId ? await getTokenSymbol(ZERO_ADDRESS, chainId) : ''
    return { chainId, communityCoinSymbol }
  }
  const { chainId, tokenUri, config } = community
  const metamaskChainId = chainId

  // to do: move to global context
  const communityCoinSymbol = await getTokenSymbol(ZERO_ADDRESS, chainId)
  const coinSymbol = await getTokenSymbol(config.coin, chainId)

  updateCommunity(name)

  return {
    ...community,
    _chaninId: metamaskChainId,
    tokenUri: parseTokenURI(tokenUri),
    coinSymbol,
    communityCoinSymbol
  }
}

export async function getMembersOfCommunity<T = CommunityMember>(chainId: number, address: string, page: number, pageSize = 20): Promise<{ type: 'error' | 'success', message?: string, list: T[], total: number }> {
  const res = await fetchMembersOfCommunity(chainId, address, page, pageSize)
  if (res.code !== 0) {
    return {
      type: 'error',
      message: res.message,
      list: [],
      total: 0
    }
  }
  const list = res.data.list.map((v: any) => ({
    ...v,
    memberInfo: JSON.parse(v.memberInfo)
  })) || []

  return {
    type: 'success',
    list: list,
    total: res.data.total
  }
}

export async function searchAddressCommunity<T = PersonCommunity>(address: string, page: number, pageSize = 20): Promise<{ type: 'error' | 'success', message?: string, list: T[], total: number }> {
  const res = await fetchAddressCommunities(address, page, pageSize)
  if (res.code !== 0) {
    return {
      type: 'error',
      message: res.message,
      list: [],
      total: 0
    }
  }
  const list = res.data.list.map((v: any) => ({
    ...v,
    communityInfo: JSON.parse(v.communityInfo)
  })) || []

  return {
    type: 'success',
    list: list,
    total: res.data.total
  }
}

export async function searchAddressMember<T = PersonIdentity>(address: string, page: number, pageSize = 20): Promise<{ type: 'error' | 'success', message?: string, list: T[], total: number }> {
  const res = await fetchAddressMembers(address, page, pageSize)
  if (res.code !== 0) {
    return {
      type: 'error',
      message: res.message,
      list: [],
      total: 0
    }
  }
  const list = res.data.list.map((v: any) => ({
    ...v,
    memberInfo: JSON.parse(v.memberInfo)
  })) || []

  return {
    type: 'success',
    list: list,
    total: res.data.total
  }
}

export async function searchMember(community: BrandDID, communityName: string, memberName: string): Promise<Partial<MemberInfo>> {
  const memberRes = await fetchMemberInfo(`${memberName}.${communityName}`)
  let member
  let isPrimary = false
  try {
    if (memberRes.data) {
      member = formatInfo(JSON.parse(memberRes.data.memberInfo))
      isPrimary = memberRes.data.isPrimary
    } else {
      throw new Error('Cannot find from cache')
    }
  } catch (e) {
    const { chainId } = community
    if (!chainId) {
      return {}
    }
    member = await communitiesidSDK.collector.searchUserDID(`${memberName}.${communityName}`, community)
    if (!member) {
      return {}
    }
    const PrimaryRecord = getReadableContract(CONTRACT_MAP[MAIN_CHAIN_ID].PrimaryRecord, 'PrimaryRecord');
    const record = await PrimaryRecord.getPrimaryRecord(member.owner)
    const memberNodeHash = keccak256(memberName)
    const communityNodeHash = keccak256(communityName)
    isPrimary = record.node === memberNodeHash && record.baseNode === communityNodeHash
  }

  if (!member) {
    return {}
  }

  updateMember(`${memberName}.${communityName}`)

  return {
    ...member,
    tokenUri: parseTokenURI(member.tokenUri),
    isPrimary
  }
}

export async function getMintCommunityPrice(chainId: number) {
  const contractAddress = CONTRACT_MAP[chainId]
  const CommunityRegistryInterface = getReadableContract(contractAddress.CommunityRegistryInterface, 'CommunityRegistryInterface', chainId)

  try {
    const res = await CommunityRegistryInterface.getMintPrice()
    return { price: res }
  } catch (e) {
    console.log(e)
    return { price: 0 }
  }
}

export async function getRenewCommunityPrice(name: string, chainId: number) {
  const contractAddress = CONTRACT_MAP[chainId]
  const CommunityRegistryInterface = getReadableContract(contractAddress.CommunityRegistryInterface, 'CommunityRegistryInterface', chainId)

  const node = keccak256(name)
  try {
    const res = await CommunityRegistryInterface.getRenewPrice(node)
    return { price: res }
  } catch (e) {
    console.log(e)
    return { price: 0 }
  }

}

export async function getMintMemberPrice(member: string, community: BrandDID) {
  try {
    const res = await communitiesidSDK.operator.getMintUserDIDPrice(member, { brandDID: community })
    return res
  } catch (e) {
    console.log(e)
    return { price: BigNumber.from(0), protocolFee: BigNumber.from(0) }
  }

}

export async function getrenewMemberPrice(member: string, memberInfo: UserDID) {
  try {
    const res = await communitiesidSDK.operator.getRenewUserDIDPrice(member, { userDID: memberInfo })
    return res
  } catch (e) {
    console.log(e)
    return { price: BigNumber.from(0), protocolFee: BigNumber.from(0) }
  }
}

export async function getBurnMemberPrice(brandDID: BrandDID, name: string) {
  const MemberRegistryInterface = getReadableContract(brandDID.node?.registryInterface ?? ZERO_ADDRESS, 'MemberRegistryInterface', brandDID.chainId)
  const nameHash = keccak256(name)
  const res = await MemberRegistryInterface.getBurnPrice(nameHash, ZERO_ADDRESS)
  return res
}

export async function getOmniNodeState(name: string, chainId: number) {
  // const chain = CHAIN_ID_MAP[CHAINS_ID_TO_NETWORK[chainId]]
  const contractAddress = CONTRACT_MAP[chainId]
  const RelayerReplicaCommunityRegistryInterface = getReadableContract(contractAddress.CommunityRegistryInterface, 'RelayerReplicaCommunityRegistryInterface', chainId)

  const node = keccak256(name)
  const res = await RelayerReplicaCommunityRegistryInterface.getOmniNodeState(node)
  return res
}

export async function getRootConfig(contract: string, method: string, chainId: number, args: any[] = []) {
  const contractAddress = CONTRACT_MAP[chainId]
  let address = contractAddress[contract as ContractAddressesKeys]
  if (contract === 'RelayerReplicaCommunityRegistryInterface') {
    address = contractAddress.CommunityRegistryInterface
  }
  const Contract = getReadableContract(address, contract as any, chainId)
  const res = await Contract[method](...args)
  return res
}

export default function useApi() {

  const { openConnectModal } = useConnectModal()
  const { address: account, isConnected, isConnecting, getSigner } = useWallet()
  const { chain } = useNetwork()
  const { switchNetworkAsync } = useSwitchNetwork()
  const tokenPrice = useTokenPrice()

  const { version } = useDetails()

  useEffect(() => {
    async function setSDKSigner() {
      const signer = await getSigner()
      if (signer) {
        communitiesidSDK.operator.setSigner(signer)
      }
    }
    if (isConnected) {
      setSDKSigner()
    }
  }, [isConnected, getSigner, chain?.id])

  async function createOmniNode(name: string, data: CreateOmniNodeData, params: CreateOmniNodeParams) {
    const { targetChainId, signature = '0x0', owner = ZERO_ADDRESS } = data
    const { chainId } = params

    const RelayerCommunityRegistryInterface = getCommunityWriteableContract('RelayerCommunityRegistryInterface', 'RelayerCommunityRegistryInterface', chainId, await getSigner())
    if (!RelayerCommunityRegistryInterface) return

    const commitment = {
      chainId: targetChainId,
      nodehash: keccak256(name),
      owner,
      deadline: 999999999999,
    };

    console.log('---- create omninode commitment', commitment)

    const { gasPrice } = await getBaseFeeData(RelayerCommunityRegistryInterface.provider, chainId)
    const tx = await RelayerCommunityRegistryInterface.createOmniNode(commitment, signature, { gasPrice })
    console.log('- RelayerCommunityRegistryInterface', RelayerCommunityRegistryInterface, RelayerCommunityRegistryInterface.address)
    const receipt = await tx.wait();
    console.log('---- create omninode tx', tx)
    console.log('---- create omninode receipt', receipt)
    // to do: tx record
    await triggerRelayerCron(MAIN_CHAIN_ID) // to do: set through tx blockNumber
    return receipt
  }

  interface ReleaseOmniNodeParams {
    chainId: number
  }

  async function releaseOmniNode(name: string, params: ReleaseOmniNodeParams) {
    const { chainId } = params
    const RelayerReplicaCommunityRegistryInterface = getCommunityWriteableContract('CommunityRegistryInterface', 'RelayerReplicaCommunityRegistryInterface', chainId, await getSigner())
    if (!RelayerReplicaCommunityRegistryInterface) return

    const node = keccak256(name)
    const res = await RelayerReplicaCommunityRegistryInterface.getOmniNodeState(node)
    const { gasPrice } = await getBaseFeeData(RelayerReplicaCommunityRegistryInterface.provider, chainId)
    const tx = await RelayerReplicaCommunityRegistryInterface.releaseOmniNode(node, res.account, { gasPrice })
    const receipt = await tx.wait();
    console.log('---- release omninode tx', tx)
    console.log('---- release omninode receipt', receipt)
    // to do: tx record
    await triggerRelayerCron(chainId) // to do: set through tx blockNumber
    return receipt
  }

  const mintCommunity = async (name: string, data: MintCommunityData, params: MintCommunityParams) => {
    const { price, mintTo = ZERO_ADDRESS, signature = '0x0', owner = ZERO_ADDRESS } = data
    const { chainId } = params
    if (!chainId) return

    // get member register writeable contract
    const MemberRegistryInterfaceFactory = getCommunityWriteableContract('MemberRegistryInterfaceFactory', 'MemberRegistryInterfaceFactory', chainId, await getSigner())
    if (!MemberRegistryInterfaceFactory) return

    const commitment = {
      node: name.trim(),
      owner: owner.trim(),
      deadline: 999999999999,
    };

    const { gasPrice } = await getBaseFeeData(MemberRegistryInterfaceFactory.provider, chainId)
    // create members receipt factory, use to receipt member mint
    const mintTx = await MemberRegistryInterfaceFactory.create(commitment, signature.trim(), mintTo.trim(), { value: price.toString(), gasPrice });
    // to do: tx record
    const receipt = await mintTx.wait();
    console.log('---- mint brand tx', mintTx)
    console.log('---- mint brand receipt', receipt)
    return receipt
  }

  async function renewCommunity(name: string, params: RenewCommunityParams) {
    const { chainId, price, durationUnit = 365 } = params

    const CommunityRegistryInterface = getCommunityWriteableContract('CommunityRegistryInterface', 'CommunityRegistryInterface', chainId, await getSigner())
    if (!CommunityRegistryInterface) return

    const { gasPrice } = await getBaseFeeData(CommunityRegistryInterface.provider, chainId)
    const renewTx = await CommunityRegistryInterface.renew(keccak256(name), durationUnit, { value: price.toString(), gasPrice });
    // to do: tx record
    const receipt = await renewTx.wait();
    return receipt
  }

  async function updateCommunityBrandConfig(tokenId: BigNumber | Number, data: updateCommunityBrandConfigData, params: updateCommunityBrandConfigParams) {
    const { chainId } = params

    const CommunityTokenURI = getCommunityWriteableContract('CommunityTokenURI', 'CommunityTokenURI', chainId, await getSigner())
    if (!CommunityTokenURI) return

    const { image, brandImage, description, brandColor, externalUrl, discord, twitter, telegram } = data
    const { gasPrice } = await getBaseFeeData(CommunityTokenURI.provider, chainId)
    const tx = await CommunityTokenURI.setCommunityConfig(tokenId, {
      image,
      brandImage,
      description: encodeString(description),
      brandColor,
      externalUrl,
      attributes: [
        { key: 'twitter', displayType: '', value: twitter || ''},
        { key: 'telegram', displayType: '', value: telegram || ''},
        { key: 'discord', displayType: '', value: discord || ''}
      ],
    }, { gasPrice })

    const receipt = await tx.wait();
    console.log('updateCommunityBrandConfig tx', tx)
    console.log('updateCommunityBrandConfig receipt', receipt)
    return receipt
  }

  async function updateCommunityConfig(registry: string, registryInterface: string, data: CommunityMintConfig, params: UpdateCommunityMintConfigParams) {
    const { chainId } = params
    console.log('-- -chainId', chainId, 'chain?.id', chain?.id)
    if (chainId !== chain?.id) {
      await switchNetworkAsync?.(chainId)
      return
    }

    const signer = await getSigner()
    const MemberRegistry = getCommunityWriteableContract(registry, 'MemberRegistry', chainId, signer)
    const MemberRegistryInterface = getCommunityWriteableContract(registryInterface, 'MemberRegistryInterface', chainId, signer)

    if (!MemberRegistry || !MemberRegistryInterface) return

    const { signatureMint, publicMint, holdingMint, proofOfHolding, signer: _signer, coin, sequenceMode = SequenceMode.INPUT_VALUE, durationUnit = '365' } = data
    const communityConfigParams = {
      nodeValidator: ZERO_ADDRESS,
      signatureMint,
      publicMint,
      holdingMint,
      proofOfHolding: proofOfHolding ? proofOfHolding.split('\n') : [],
      signer: _signer || account,
      coin,
      sequenceMode,
      durationUnit
    }
    console.log('-communityConfigParams', communityConfigParams)

    const { gasPrice } = await getBaseFeeData(MemberRegistryInterface.provider, chainId)
    const tx = await MemberRegistryInterface.setConfig(communityConfigParams, { gasPrice })
    // to do: tx record
    const receipt = await tx.wait();

    console.log('---- update community mint config tx', tx)
    console.log('---- update community mint config receipt', receipt)
    return receipt
  }

  async function updateVariableCommunityMintConfig(registry: string, registryInterface: string, data: UpdateVariableCommunityMintConfigData, params: UpdateVariableCommunityMintConfigParams) {
    const { chainId  } = params
    console.log('-- -chainId', chainId, 'chain?.id', chain?.id)
    if (chainId !== chain?.id) {
      await switchNetworkAsync?.(chainId)
      return
    }

    const signer = await getSigner()
    const MemberRegistry = getCommunityWriteableContract(registry, 'MemberRegistry', chainId, signer)
    const MemberRegistryInterface = getCommunityWriteableContract(registryInterface, 'MemberRegistryInterface', chainId, signer)

    if (!MemberRegistry || !MemberRegistryInterface) return

    const { signatureMint, publicMint, holdingMint, proofOfHolding, signer: _signer, coin, sequenceMode = SequenceMode.INPUT_VALUE, durationUnit = '365', reserveDuration, burnAnytime } = data
    const memberRegistryConfigParams = {
      reserveDuration,
      burnAnytime
    }
    console.log('-memberRegistryConfigParams', memberRegistryConfigParams)
    const memberRegistryInterfaceConfigParams = {
      nodeValidator: ZERO_ADDRESS,
      signatureMint,
      publicMint,
      holdingMint,
      proofOfHolding: proofOfHolding ? proofOfHolding.split('\n') : [],
      signer: _signer || account,
      coin,
      sequenceMode,
      durationUnit
    }

    const multicallParams1 = [MemberRegistryInterface.address]
    const multicallParams2 = [MemberRegistryInterface.interface.encodeFunctionData('setConfig', [memberRegistryInterfaceConfigParams])]
    if (version >= ContractVerison.V3) {
      multicallParams1.push(MemberRegistry.address)
      multicallParams2.push(MemberRegistry.interface.encodeFunctionData('setConfig', [memberRegistryConfigParams]))
    }
    console.log('-communityConfigParams', memberRegistryInterfaceConfigParams)
    const { gasPrice } = await getBaseFeeData(MemberRegistry.provider, chainId)
    const tx = await MemberRegistry.multicall(multicallParams1, multicallParams2, { gasPrice })
    // to do: tx record
    const receipt = await tx.wait();

    console.log('---- update Variable community mint config tx', tx)
    console.log('---- update Variable community mint config receipt', receipt)
    return receipt
  }

  async function updateCommunityMintConfig(registry: string, registryInterface: string, data: UpdateCommunityMintConfigData, params: UpdateCommunityMintConfigParams) {
    const { chainId, decimals = 18 } = params
    console.log('-- -chainId', chainId, 'chain?.id', chain?.id)
    if (chainId !== chain?.id) {
      await switchNetworkAsync?.(chainId)
      return
    }

    const signer = await getSigner()
    const MemberRegistry = getCommunityWriteableContract(registry, 'MemberRegistry', chainId, signer)
    const MemberRegistryInterface = getCommunityWriteableContract(registryInterface, 'MemberRegistryInterface', chainId, signer)
    const MemberTokenomics = getCommunityWriteableContract('MemberTokenomics', 'MemberTokenomics', chainId, signer)

    if (!MemberRegistry || !MemberTokenomics || !MemberRegistryInterface) return

    const { signatureMint, publicMint, holdingMint, proofOfHolding, signer: _signer, coin, sequenceMode = SequenceMode.INPUT_VALUE, durationUnit = '365', mode, commissionRate, a, b = 0, c = 0, d = 0, reserveDuration, burnAnytime } = data
    const memberRegistryConfigParams = {
      reserveDuration,
      burnAnytime
    }
    console.log('-memberRegistryConfigParams', memberRegistryConfigParams)
    const memberRegistryInterfaceConfigParams = {
      nodeValidator: ZERO_ADDRESS,
      signatureMint,
      publicMint,
      holdingMint,
      proofOfHolding: proofOfHolding ? proofOfHolding.split('\n') : [],
      signer: _signer || account,
      coin,
      sequenceMode,
      durationUnit
    }
    console.log('-communityConfigParams', memberRegistryInterfaceConfigParams)
    const priceConfigParams = {
      mode,
      commissionRate: commissionRate * 100,
      a,
      b,
      c,
      d,
    }
    console.log('-priceConfigParams', priceConfigParams)

    const multicallParams1 = [MemberRegistryInterface.address, MemberTokenomics.address]
    const multicallParams2 = [
      MemberRegistryInterface.interface.encodeFunctionData('setConfig', [memberRegistryInterfaceConfigParams]),
      // MemberTokenURI.interface.encodeFunctionData("setImageBaseURI", [registry, imageBaseURI]),
      MemberTokenomics.interface.encodeFunctionData("setCommunityConfig", [registry, priceConfigParams]),
    ]
    if (version >= ContractVerison.V3) {
      multicallParams1.push(MemberRegistry.address)
      multicallParams2.push(MemberRegistry.interface.encodeFunctionData('setConfig', [memberRegistryConfigParams]))
    }

    const { gasPrice } = await getBaseFeeData(MemberRegistry.provider, chainId)
    const tx = await MemberRegistry.multicall(multicallParams1, multicallParams2, { gasPrice })
    // to do: tx record
    const receipt = await tx.wait();

    console.log('---- update community mint config tx', tx)
    console.log('---- update community mint config receipt', receipt)
    return receipt
  }

  async function mintMember(brandInfo: BrandDID, DIDName: string, params: MintMemberParams) {
    const { chainId, price, mintTo = ZERO_ADDRESS, signature = '', owner = ZERO_ADDRESS } = params
    // didName: `${memberName}.${communityName}`
    const { gasPrice } = await getBaseFeeData(null, chainId)
    return await communitiesidSDK.operator.mintUserDID(DIDName, mintTo.trim(), {
      signature: signature.trim(),
      brandDID: brandInfo,
      mintPrice: price,
      owner: owner.trim(),
      txConfig: { gasPrice }
    })
  }

  async function renewMember(brandDID: BrandDID, memberInfo: UserDID, DIDName: string, params: RenewMemberParams) {
    const { price } = params
    // didName: `${memberName}.${communityName}`
    const { gasPrice } = await getBaseFeeData(null, brandDID.chainId)
    return await communitiesidSDK.operator.renewUserDID(DIDName, {
      brandDID,
      userDID: memberInfo,
      mintPrice: price,
      txConfig: { gasPrice }
    })
  }

  async function burnMember(brandInfo: BrandDID, DIDName: string) {
    // didName: `${memberName}.${communityName}`
    const { gasPrice } = await getBaseFeeData(null, brandInfo.chainId)
    return await communitiesidSDK.operator.burnUserDID(DIDName, {
      brandDID: brandInfo,
      txConfig: { gasPrice }
    })
  }

  async function updateMember(communityContractAddress: string, member: string, data: UpdateMemberData, params: UpdateMemberParams) {
    const { chainId } = params
    const TextRecord = getCommunityWriteableContract('TextRecord', 'TextRecord', chainId, await getSigner())
    if (!TextRecord) return

    const keys = Object.keys(data)

    const encoder = new TextEncoder()
    const tx = await TextRecord.set(
      communityContractAddress, keccak256(member),
      keys.map(k => keccak256(k)),
      keys.map(k => encoder.encode(data[k as keyof UpdateMemberData] || ''))
    )
    const receipt = await tx.wait();
    // to do: tx record
    return receipt
  }

  async function setMemberPrimary(member: string) {
    // to do: need error catch
    const receipt = await communitiesidSDK.operator.setAsPrimary(member)
    console.log('--- setMemberPrimary receipt', receipt)
  }

  async function erc20PriceToUSD(erc20Address: string, params: Erc20PriceToUSDParams) {
    const { chainId } = params
    if (!erc20Address || erc20Address === ZERO_ADDRESS) {
      return {
        price: tokenPrice[chainId] || 0,
        decimals: 18
      }
    }
    const coin = await fetchERC20Coin(erc20Address, chainId)
    return {
      price: coin.usdPrice,
      decimals: coin.tokenDecimal
    }
  }

  async function approveErc20(coin: string, address: string, params: ApproveErc20Params) {
    const { price, chainId } = params
    const Erc20Contract = getCommunityWriteableContract(coin, 'ERC20', chainId, await getSigner())
    if (!Erc20Contract) return
    const currentAllowence = await Erc20Contract.allowance(account, address)
    if (currentAllowence.gte(price)) {
      return
    }
    const tx = await Erc20Contract.approve(address, maxApproveValue);
    const receipt = await tx.wait();
    // to do: tx record
    return receipt
  }

  return {
    getBrandDIDChainId,
    createOmniNode,
    releaseOmniNode,
    mintCommunity,
    renewCommunity,
    searchCommunity,
    getMembersOfCommunity,
    searchAddressCommunity,
    searchAddressMember,
    searchMember,
    getMintCommunityPrice,
    getOmniNodeState,
    getMintMemberPrice,
    mintMember,
    approveErc20,
    getrenewMemberPrice,
    renewMember,
    updateCommunityBrandConfig,
    updateCommunityConfig,
    updateVariableCommunityMintConfig,
    updateCommunityMintConfig,
    burnMember,
    updateMember,
    setMemberPrimary,
    getPrimaryMember,
    erc20PriceToUSD,
    getRootConfig
  }
}