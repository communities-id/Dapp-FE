import { useState, useEffect, useMemo } from "react"

import { execSearch } from '@/shared/helper'
import { searchCommunity, searchMember } from "@/shared/useApi"

import { CommunityInfo, MemberInfo, SearchMode, State } from '@/types'
import { BrandDID } from "@communitiesid/id"

interface Props {
  brandName?: string
  brandInfo?: Partial<CommunityInfo>
}
export const useDIDContent = ({ brandName, brandInfo: inputBrandInfo }: Props) => {

  const [brandInfo, setBrandInfo] = useState<Partial<CommunityInfo>>({})
  const [brandInfoLoading, setBrandInfoLoading] = useState(false)

  const handleVerifyBrandSet = (info: Partial<CommunityInfo>) => {
    const { tokenUri, config } = info
    const profileInitially = !tokenUri?.image || !tokenUri?.brand_image || !tokenUri?.brand_color
    const accountInitially = !(tokenUri?.external_url && tokenUri?.attr.discord && tokenUri?.attr.twitter && tokenUri?.attr.twitter)
    const mintSettingsInitially = !config?.publicMint && !config?.signatureMint && !config?.holdingMint
    return {
      profileInitially,
      accountInitially,
      mintSettingsInitially,
      notLoaded: config && mintSettingsInitially
    }
  }

  const brandSetStatus = useMemo(() => {
    return handleVerifyBrandSet(brandInfo)
  }, [brandInfo])

  useEffect(() => {
    if (inputBrandInfo) {
      setBrandInfo(inputBrandInfo)
      return
    }
    if (!brandName) return
    setBrandInfoLoading(true)
    searchCommunity(brandName).then((res) => {
      setBrandInfo(res)
      setBrandInfoLoading(false)
    })
  }, [brandName, inputBrandInfo])

  return {
    brandInfo,
    brandInfoLoading,
    brandSetStatus,
    handleVerifyBrandSet
  }
}

interface MemberProps {
  memberName: string
  memberInfo?: Partial<MemberInfo>
  brandInfo?: Partial<CommunityInfo>
}
export const useMemberContent = ({ memberName, memberInfo: inputMemberInfo, brandInfo }: MemberProps) => {

  const [memberInfo, setMemberInfo] = useState<Partial<MemberInfo>>({})
  const [memberInfoLoading, setMemberInfoLoading] = useState(false)

  const { type, community, member } = execSearch(memberName)

  const handleVerifyMemberSet = (info: Partial<MemberInfo>) => {
    const unMint = !info?.node || info?.state === State.FREE || info?.state === State.EXPIRED
    return {
      isMinted: !unMint,
      isRenewal: info?.state === State.RESERVED || info?.state === State.EXPIRED,
      isExpired: info?.state === State.EXPIRED,
    }
  }

  const memberSetStatus = useMemo(() => {
    return handleVerifyMemberSet(memberInfo)
  }, [memberInfo])

  useEffect(() => {
    if (inputMemberInfo) {
      setMemberInfo(inputMemberInfo)
      return
    }
    if (type !== 'member') return
    setMemberInfoLoading(true)
    searchMember(brandInfo as BrandDID, community, member).then((res) => {
      setMemberInfo(res)
      setMemberInfoLoading(false)
    })
  }, [type, member, inputMemberInfo])
  
  return {
    type,
    community,
    member,
    memberInfo,
    memberInfoLoading,
    memberSetStatus,
    handleVerifyMemberSet
  }
}