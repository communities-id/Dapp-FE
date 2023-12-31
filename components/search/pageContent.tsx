import { FC, useMemo } from 'react'
import classnames from 'classnames'

import { useDetails } from '@/contexts/details'

import CommunityContent from '@/components/search/community/content'
import PersonContent from '@/components/search/person/content'
import MemberContent from '@/components/search/member/content'
import Loading from '@/components/loading/content'
import DetailLoading from '@/components/loading/detail'
import NotFound from '@/components/search/404'
import SearchFooter from '@/components/common/searchFooter'

interface Props {
  className?: string
}

const PageContent: FC<Props> = ({ className }) => {

  const { mode, loadingSet, isUnknown } = useDetails()

  const contentLoading = useMemo(() => {
    return (loadingSet.community || loadingSet.member) && !isUnknown
  }, [loadingSet.community, loadingSet.member, isUnknown])
  return (
    <div className={className}>
      {
        (contentLoading && mode !== 'address') ? (
          mode === 'member' ? (
            <DetailLoading className='dapp-container mt-[20px]' />
          ) : (
            <Loading className='dapp-container mt-[20px]' />
          )
        ) : (
          isUnknown ? <NotFound /> : (
            <div className='dapp-container mt-[10px] px-10 sm:px-4 sm:mt-0 mb-10'>
              <div className='w-full'>
                {mode === 'address' && (<PersonContent />)}
                {mode === 'community' && (<CommunityContent />)}
                {mode === 'member' && (<MemberContent />)}
              </div>
            </div>
          )
        )
      }
      <SearchFooter />
    </div>
  )
}

export default PageContent
