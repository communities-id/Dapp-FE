import { useRouter } from "next/router"

import { execSearch } from '@/shared/helper'

import { SearchMode } from '@/types'

export const useSearch = () => {
  const router = useRouter()

  const handleSearch = async (value: string) => {
    if (!value.trim()) {
      return
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