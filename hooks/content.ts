import { useState, useEffect, useMemo } from "react"

import { searchCommunity } from "@/shared/useApi"

import { CommunityInfo, SearchMode } from '@/types'

interface Props {
  brandName?: string
  brandInfo?: Partial<CommunityInfo>
}
export const useDIDContent = ({ brandName, brandInfo: inputBrandInfo }: Props) => {

  const [brandInfo, setBrandInfo] = useState<Partial<CommunityInfo>>(inputBrandInfo ?? {})
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
      notLoaded: mintSettingsInitially
    }
  }

  const brandSetStatus = useMemo(() => {
    return handleVerifyBrandSet(brandInfo)
  }, [brandInfo])

  useEffect(() => {
    if (inputBrandInfo) return
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