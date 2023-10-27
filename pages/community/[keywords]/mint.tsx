import { Fragment, useMemo } from 'react'
import { useSearchParams } from 'next/navigation'
import { WrapperProvider } from '@/contexts/wrapper'
import { useDetails } from '@/contexts/details'

import MemberCustomMint from '@/components/mint/member/custom'
import SearchFooter from '@/components/common/searchFooter'
import Loading from '@/components/loading/list'

import { SearchMode } from '@/types';

export default function Search() {
  const keywords = useSearchParams().get('keywords') as string

  return (
    <WrapperProvider mode={SearchMode.community} keywords={keywords}>
      <div className='pb-[120px] relative z-1'>
        <div className='search-container mt-[10px]'>
          <MintContent />
        </div>
      </div>
    </WrapperProvider>
  )
}

const MintContent = () => {
  const { loadingSet, community, communityInfo } = useDetails()

  const isContentReady = useMemo(() => {
    return community && !loadingSet.community && communityInfo.node
  }, [loadingSet.community, community, communityInfo.node])

  return !isContentReady ? (
    <Loading />
  ) : (
    <Fragment>
      <div className='mt-[20px] flex flex-col gap-4'>
        <MemberCustomMint />
      </div>
      <SearchFooter />
    </Fragment>
  )
}