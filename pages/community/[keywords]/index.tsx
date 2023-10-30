import { useSearchParams } from 'next/navigation'
import { WrapperProvider } from '@/contexts/wrapper'

import SearchContent from '@/components/search/pageContent'

import { SearchMode } from '@/types'

export default function Search() {
  const keywords = useSearchParams().get('keywords') as string

  return (
    <WrapperProvider mode={SearchMode.community} keywords={keywords}>
      <SearchContent className='relative z-1' />
    </WrapperProvider>
  )
}