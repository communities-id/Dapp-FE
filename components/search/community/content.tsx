import { FC, useMemo } from 'react'

import { useDetails } from '@/contexts/details'

import CommunityMembers from '@/components/search/community/members'
import CommunityMint from '@/components/mint/community'

import { State } from '@/types'

interface Props {
}

const CommunityContent: FC<Props> = () => {
  const { communityInfo } = useDetails()

  const isShouldMint = useMemo(() => {
    return !communityInfo?.node || communityInfo?.state === State.EXPIRED
  }, [communityInfo])

  const isShowTabs = useMemo(() => {
    return !!communityInfo?.node
  }, [communityInfo])

  return (
    <div className='flex flex-col gap-4'>
      {isShouldMint && <CommunityMint />}
      {isShowTabs && <CommunityMembers />}
    </div>
  )
}

export default CommunityContent