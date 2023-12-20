import { ReactNode, createContext, useContext, useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { DetailsProvider } from '@/contexts/details'
import { GlobalDialogProvider } from '@/contexts/globalDialog'
import { ConnectButton } from '@rainbow-me/rainbowkit'

import { execSearch } from '@/shared/helper'

import SearchHeaderInfo from '@/components/search/pageInfo'
import SearchHeader from '@/components/solid/SearchHeader'

import { SearchMode, SearchModeType } from '@/types'

interface WrapperContextProps {

}

const WrapperContext = createContext<WrapperContextProps>({})

export const useWrapper = () => {
  return useContext(WrapperContext)
}

export const WrapperProvider = ({ mode, keywords, children }: { mode: SearchMode; keywords: string; children: ReactNode }) => {

  const router = useRouter()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    if (mode === SearchMode.unknown) {
      router.push(`/search/${keywords}`)
      return
    }
    if (mode === SearchMode.member && keywords) {
      const { community, member } = execSearch(keywords)
      router.replace(`/community/${community}?member=${member}`)
      return
    }
  }, [mode, keywords])

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setMounted(true)
    }
  }, [])
  
  return (
    <WrapperContext.Provider value={{}}>
      <DetailsProvider mode={SearchMode[mode] as SearchModeType} keywords={keywords}>
        <GlobalDialogProvider>
          <SearchHeader />
          {
            mounted && (
              <main className='min-h-screen bg-[#FAFAFA] flex flex-col'>
                <div className='bg-white relative z-10 rounded-[10px]'>
                  <SearchHeaderInfo />
                </div>
                {children}
              </main>
            )
          }
        </GlobalDialogProvider>
      </DetailsProvider>
    </WrapperContext.Provider>
  )
}