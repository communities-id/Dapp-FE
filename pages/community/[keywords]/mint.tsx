import { useSearchParams } from 'next/navigation'
import { WrapperProvider } from '@/contexts/wrapper'

import MemberMintContent from '@/components/search/community/member-mint'

import { SearchMode } from '@/types';

export default function Search() {
  const keywords = useSearchParams().get('keywords') as string

  return (
    <WrapperProvider mode={SearchMode.community} keywords={keywords}>
      <div className='pb-[120px] relative z-1'>
        <div className='search-container mt-[10px]'>
          <MemberMintContent />
        </div>
      </div>
    </WrapperProvider>
  )
}