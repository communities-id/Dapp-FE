import { ReactNode, createContext, useContext, useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { DetailsProvider } from '@/contexts/details'
import { GlobalDialogProvider } from '@/contexts/globalDialog'
import { ConnectButton } from '@rainbow-me/rainbowkit'

import SearchHeaderInfo from '@/components/search/pageInfo'
import SearchHeader from '@/components/solid/SearchHeader'
import WalletConnect from '@/components/search/connect'
import WrongChain from '@/components/search/wrongChain'

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
    console.log('--------- wrapper mode', mode, 'keywords', keywords)
    if (mode === SearchMode.unknown) {
      router.push(`/search/${keywords}`)
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
              <main className='min-h-screen bg-[#FAFAFA]'>
                <img src='/search/blur-bg.png' className='absolute top-0 left-0 z-0 w-full h-full bg-cover pointer-events-none'/>
                <header className='bg-white relative z-1 rounded-[10px]'>
                  <SearchHeaderInfo />
                </header>
                {children}
              </main>
            )
          }
        </GlobalDialogProvider>
      </DetailsProvider>
    </WrapperContext.Provider>
  )
}