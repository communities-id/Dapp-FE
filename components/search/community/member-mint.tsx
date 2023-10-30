import { Fragment, useMemo } from 'react'
import { useDetails } from '@/contexts/details'

import MemberCustomMint from '@/components/mint/member/custom'
import SearchFooter from '@/components/common/searchFooter'
import Loading from '@/components/loading/list'

const MemberMintContent = () => {
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

export default MemberMintContent