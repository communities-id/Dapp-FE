import { FC } from 'react'

import LoadingInfo from '@/components/loading/info'
import LoadingContent from '@/components/loading/content'

const SearchPageSkeleton: FC = () => {
  return (
    <div>
      <div className='h-[210px] bg-default-search-banner'></div>
      {/* <div className='search-container relative'>
        <LoadingInfo />
      </div>
      <div className='search-container relative'>
        <LoadingContent />
      </div> */}
    </div>
  )
}

export default SearchPageSkeleton