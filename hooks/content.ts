import { useState, useEffect } from "react"

import { searchCommunity } from "@/shared/useApi"

import { CommunityInfo, SearchMode } from '@/types'

interface Props {
  brandName?: string
  brandInfo?: Partial<CommunityInfo>
}
export const useDIDContent = ({ brandName, brandInfo: inputBrandInfo }: Props) => {

  const [brandInfo, setBrandInfo] = useState<Partial<CommunityInfo>>(inputBrandInfo ?? {})
  const [brandInfoLoading, setBrandInfoLoading] = useState(false)

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
    brandInfoLoading
  }
}