import { createContext, use, useContext, useEffect, useMemo, useRef, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

import { useNetwork } from 'wagmi'
import { BrandDID, SupportedChainIds } from '@communitiesid/id'
// import { useRoot } from '@/contexts/root'
import { useWallet } from '@/hooks/wallet'
import { execSearch } from '@/shared/helper'
import useApi, { getPrimaryMember, searchCommunity, searchMember } from '@/shared/useApi'
import { CHAIN_ID, DEFAULT_TOKEN_SYMBOL, MAIN_CHAIN_ID } from '@/shared/constant'
import { verifyContractVersion } from '@/utils/tools'

import { SearchMode, SearchModeType, CommunityInfo, MemberInfo, State, CommunityNode } from '@/types'
import { ContractVerison } from '@/types/contract'
import { searchSuggestion } from '@/shared/apis'

interface DetailsContextProps {
  version: ContractVerison
  mode: SearchModeType
  keywords: string
  member: string
  community: string
  address: string
  communityInfo: Partial<CommunityInfo>
  memberInfo: Partial<MemberInfo>
  ownerMemberInfo: Partial<MemberInfo>
  isUnknown: boolean
  communityCache: {
    name: string,
    imge: string,
    chainId: SupportedChainIds,
    totalSupply: number,
    durationUnit: number,
    priceModel: BrandDID["priceModel"],
    coin: string
  }[]
  loadingSet: Record<'community' | 'member' | 'did', boolean>
  communityInfoSet: {
    initialized: boolean
    isValid: boolean // is info valid
    isOwner: boolean
    isSigner: boolean
    unMint: boolean
    isMinted: boolean
    isRenewal: boolean
    isExpired: boolean
    networkDiff: boolean
    mulChainId: number
  }
  memberInfoSet: {
    isValid: boolean // is info valid
    isOwner: boolean
    isPrimary: boolean
    unMint: boolean
    isMinted: boolean
    isRenewal: boolean
    isExpired: boolean
    networkDiff: boolean
    mulChainId: number
    chainSymbol: string
  }
  shouldSwitchNetwork: boolean
  isMainNetwork: boolean
  mainMulChainID: number
  mintMulChainID: number
  refreshInfo: (initialize?: boolean) => Promise<void>
}

const DetailsContext = createContext<DetailsContextProps>({
  version: ContractVerison.V1,
  mode: 'unknown',
  keywords: '',
  member: '',
  address: '',
  community: '',
  communityInfo: {},
  memberInfo: {},
  ownerMemberInfo: {},
  isUnknown: false,
  communityCache: [],
  loadingSet: {
    community: true,
    member: true,
    did: false
  },
  communityInfoSet: {
    initialized: false,
    isValid: false,
    isOwner: false,
    isSigner: false,
    unMint: true,
    isMinted: false,
    isRenewal: false,
    isExpired: false,
    networkDiff: false,
    mulChainId: 0,
  },
  memberInfoSet: {
    isValid: false,
    isOwner: false,
    isPrimary: false,
    unMint: true,
    isMinted: false,
    isRenewal: false,
    isExpired: false,
    networkDiff: false,
    mulChainId: 0,
    chainSymbol: DEFAULT_TOKEN_SYMBOL[MAIN_CHAIN_ID]
  },
  shouldSwitchNetwork: false,
  isMainNetwork: false,
  mainMulChainID: 0,
  mintMulChainID: 0,
  refreshInfo: async () => {}
})

export const useDetails = () => useContext(DetailsContext)

export const DetailsProvider = ({ mode: _mode, keywords: _keywords, children }: { mode: SearchModeType; keywords: string; children: React.ReactNode }) => {
  const router = useRouter()
  const { address: account } = useWallet()
  const { chain } = useNetwork()
  
  const [loadingSet, setLoadingSet] = useState<Record<'community' | 'member' | 'did', boolean>>({
    community: true,
    member: true,
    did: false
  })
  // const [addressDID, setAddressDID] = useState<string | undefined>('')
  const [brandInitialized, setBrandInitialized] = useState(false)
  const [communityInfo, setCommunityInfo] = useState<Partial<CommunityInfo>>({})
  const [memberInfo, setMemberInfo] = useState<Partial<MemberInfo>>({})
  const [ownerMemberInfo, setOwnerMemberInfo] = useState<Partial<MemberInfo>>({})
  const [communityCache, setCommunityCache] = useState<DetailsContextProps["communityCache"]>([])
  const requestId = useRef(0)

  const version = useMemo(() => {
    return verifyContractVersion(communityInfo)
  }, [communityInfo])

  // exec type、community、member keywords or addressDID
  const { type, keywords, community, member } = useMemo(() => {
    console.log('=============== _keywords', _keywords)
    // const origin = execSearch(_keywords)
    // return addressDID ? { ...execSearch(addressDID), type: origin.type, keywords: origin.keywords } : origin
    return execSearch(_keywords)
  }, [_keywords])

  const isUnknown = useMemo(() => {
    return Boolean(keywords && type === 'unknown')
  }, [type, keywords])

  // default multi chain id
  const mainMulChainID = MAIN_CHAIN_ID

  // multi chain id when minting
  const mintMulChainID = useMemo(() => {
    return communityInfo?.chainId || mainMulChainID
  }, [communityInfo?.chainId, mainMulChainID])

  // Should the network be switched when minting on the main network
  const shouldSwitchNetwork = useMemo(() => {
    return communityInfo?._chaninId !== chain?.id
  }, [communityInfo?._chaninId, chain?.id])

  // Whether the current network is the main network
  const isMainNetwork = useMemo(() => {
    return chain?.id === CHAIN_ID
  }, [chain?.id])

  // current community status info
  const communityInfoSet = useMemo(() => {
    if (loadingSet.community) {
      return {
        initialized: brandInitialized,
        isValid: false,
        isOwner: false,
        isSigner: false,
        unMint: false,
        isMinted: false,
        isRenewal: false,
        isExpired: false,
        networkDiff: false,
        mulChainId: mainMulChainID,
      }
    }
    const unMint = !communityInfo?.node || communityInfo?.state === State.FREE
    const isRenewal = communityInfo?.state === State.RESERVED
    const isExpired = communityInfo?.state === State.EXPIRED
    return {
      initialized: brandInitialized,
      isValid: !!communityInfo?.node,
      isOwner: !!account && communityInfo?.owner === account,
      isSigner: !!account && communityInfo.config?.signer === account,
      unMint,
      isMinted: !unMint, // include expired
      isRenewal,
      isExpired,
      // if non communityInfo, _chaninId is 0
      // if created omninode, _chaninId right
      // if released omninode, _chaninId is 0
      networkDiff: communityInfo?._chaninId !== chain?.id,
      mulChainId: communityInfo?.chainId ?? mainMulChainID,
    }
  }, [account, communityInfo, loadingSet.community, chain?.id, mainMulChainID])


  // current member status info
  const memberInfoSet = useMemo(() => {
    if (loadingSet.member) {
      return {
        isValid: false,
        isOwner: false,
        isPrimary: false,
        unMint: false,
        isMinted: false,
        isRenewal: false,
        isExpired: false,
        networkDiff: false,
        mulChainId: mainMulChainID,
        chainSymbol: DEFAULT_TOKEN_SYMBOL[communityInfo?.chainId ?? mainMulChainID]
      }
    }
    const unMint = !memberInfo?.node || memberInfo?.state === State.FREE || memberInfo?.state === State.EXPIRED
    const isRenewal = memberInfo?.state === State.RESERVED || memberInfo?.state === State.EXPIRED
    const isExpired = memberInfo?.state === State.EXPIRED
    return {
      isValid: !!memberInfo?.node,
      isOwner: memberInfo?.owner === account,
      isPrimary: Boolean(memberInfo?.isPrimary),
      unMint,
      isMinted: !unMint, // include expired
      isRenewal,
      isExpired,
      networkDiff: communityInfo?._chaninId !== chain?.id,
      mulChainId: communityInfo?.chainId || mainMulChainID,
      chainSymbol: DEFAULT_TOKEN_SYMBOL[communityInfo?.chainId ?? mainMulChainID]
    }
  }, [account, communityInfo, memberInfo, loadingSet.member, chain?.id, mainMulChainID])

  // load community info by keywords
  const loadCommunityInfo = async (community: string, shouldLoading = true) => {
    shouldLoading && setLoadingSet((prev) => ({ ...prev, community: true }))
    const data = await searchCommunity(community)
    console.log('- community info', data)
    setCommunityInfo(data)
    shouldLoading && setLoadingSet((prev) => ({ ...prev, community: false }))
    return data
  }

  // load member info by keywords
  const loadMemberInfo = async (communityInfo: BrandDID, community: string, member: string, shouldLoading = true) => {
    shouldLoading && setLoadingSet((prev) => ({ ...prev, member: true }))
    const data = await searchMember(communityInfo, community, member)
    console.log('- member info', data)
    setMemberInfo(data)
    shouldLoading && setLoadingSet((prev) => ({ ...prev, member: false }))
    return data
  }

  const loadAddressInfo = async (address: string) => {
    const did = await getPrimaryMember(address)
    if (!did) return
    const { type, community, member } = execSearch(did)
    if (type === 'unknown') return
    const DIDCommunityInfo = await searchCommunity(community)
    const DIDMemberInfo = await searchMember(DIDCommunityInfo, community, member)
    return DIDMemberInfo
  }


  const clearInfo = () => {
    // setAddressDID('')
    setCommunityInfo({})
    setMemberInfo({})
    setLoadingSet({
      did: false,
      community: true,
      member: true,
    })
  }

  const refreshInfo = async (initialize?: boolean) => {
    setBrandInitialized(initialize ?? false)
    const currentRequestId = requestId.current
    requestId.current = currentRequestId + 1
    await loadCommunityInfo(community, false).then(async (communityInfo) => {
      if (requestId.current !== currentRequestId + 1) {
        return
      }
      const { node, chainId } = communityInfo
      if (member && node) {
        await loadMemberInfo(communityInfo, community, member, false)
      }
    })
  }

  // event: get did from keywords
  useEffect(() => {
    // console.log('===  did init', type, keywords)
    // loadAddressDID(keywords)
    if (type === 'member') {
      document.title = `${keywords} | Communities ID`
    }
    if (type === 'community') {
      document.title = `${keywords} | Communities ID`
    }
  }, [type, keywords])

  // event: get community info and member info
  useEffect(() => {
    // console.log('===  community init', 'community', community, 'member', member, 'keywords', keywords, loadingSet.did)
    if (!community && loadingSet.did) {
      clearInfo()
      return
    }
    if (!community) {
      setLoadingSet((prev) => ({ ...prev, community: false }))
      // setLoadingSet((prev) => ({ ...prev, member: false }))
      return
    }
    clearInfo()
    const currentRequestId = requestId.current
    requestId.current = currentRequestId + 1
    console.log('--- init loadCommunityInfo', community, 'memner', member, 'keywords', keywords, loadingSet.did)
    loadCommunityInfo(community).then((communityInfo) => {
      if (requestId.current !== currentRequestId + 1) {
        return
      }
      console.log("---- init loadCommunityInfo", communityInfo, 'after member', member && communityInfo.node)
      if (member && communityInfo.node) {
        loadMemberInfo(communityInfo, community, member)
      } else {
        setLoadingSet((prev) => ({ ...prev, member: false }))
      }
    })
  }, [community, member, keywords, loadingSet.did])

  useEffect(() => {
    if (!_keywords) return
    if (SearchMode[_mode] === SearchMode.unknown) return
    if (SearchMode[type] === SearchMode.unknown) return
    if (_mode !== type) {
      router.replace(`/${type}/${_keywords}`)
    }
  }, [_mode, _keywords, type, router])

  useEffect(() => {
    if (!account) return
    loadAddressInfo(account).then(memberInfo => {
      memberInfo && setOwnerMemberInfo(memberInfo)
    })
  }, [account])

  useEffect(() => {
    async function getCommunityCache() {
      const storage = localStorage.getItem('communityCache')
      try {
        const { data, expired } = JSON.parse(storage || '{}')
        if (data && expired > Date.now()) {
          setCommunityCache(data)
          return
        }
        throw new Error('no cache for community')
      } catch (e) {
        const res = await searchSuggestion()
        if (res.data) {
          const expired = Date.now() + 1000 * 60 * 10
          localStorage.setItem('communityCache', JSON.stringify({ data: res.data, expired }))
          setCommunityCache(JSON.parse(JSON.stringify(res.data)))
        }
      }
    }
    getCommunityCache()
  }, [])

  return (
    <DetailsContext.Provider value={{
      version,
      mode: type,
      keywords,
      member,
      address: type === 'address' ? keywords : '',
      communityCache,
      community,
      communityInfo,
      memberInfo,
      ownerMemberInfo,
      isUnknown,
      loadingSet,
      communityInfoSet,
      memberInfoSet,
      shouldSwitchNetwork,
      isMainNetwork,
      mainMulChainID,
      mintMulChainID,
      refreshInfo,
    }}>
      {children}
    </DetailsContext.Provider>
  )
}