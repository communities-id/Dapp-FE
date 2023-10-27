import { FC, Fragment, useMemo } from 'react'

import { useDetails } from '@/contexts/details'

import CommunityInfoComponent from '@/components/search/community/info'
import PersonInfoComponent from '@/components/search/person/info'
import Banner from '@/components/search/banner'
import Loading from '@/components/loading/info'

interface Props {
}

const PageHeaderInfo: FC<Props> = () => {
  const { mode, loadingSet, isUnknown } = useDetails()

  const contentLoading = useMemo(() => {
    return (loadingSet.community || loadingSet.member) && !isUnknown
  }, [loadingSet.community, loadingSet.member, isUnknown])

  return (
    <div className='w-full'>
      {
        (contentLoading && mode !== 'address') ? (
          <Fragment>
            <Banner />
            <Loading personal={mode === 'unknown'} className='search-container' />
          </Fragment>
        ) : (
          <Fragment>
            {
              mode === 'address' && (<PersonInfoComponent />)
            }
            {
              mode === 'community' && (<CommunityInfoComponent />)
            }
            {
              // Community members share a common headerInfo.
              mode === 'member' && (<CommunityInfoComponent />)
            }
          </Fragment>
        )
      }
    </div>
  )
}

export default PageHeaderInfo
