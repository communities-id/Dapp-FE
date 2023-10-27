import { useRouter } from "next/router"

import { useAccount } from 'wagmi'
import { useConnectModal } from '@rainbow-me/rainbowkit'
import { execSearch } from '@/shared/helper'

import { SearchMode } from '@/types'

export const useSearch = () => {
  const router = useRouter()
  const { isConnected } = useAccount()
  const { openConnectModal } = useConnectModal()

  const handleSearch = async (value: string) => {
    if (!value.trim()) {
      return
    }

    if (!isConnected) {
      return openConnectModal?.()
    }

    const { type } = execSearch(value)

    if (SearchMode[type] === SearchMode.unknown) {
      router.push(`/search/${value}`)
    }

    // to do 格式验证 
    router.push(`/${type}/${value}`)
  }

  return {
    handleSearch
  }
}