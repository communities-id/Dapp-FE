import { FC, Fragment } from 'react'

import Banner from '@/components/search/banner'

import EmptyIcon from '~@/icons/mint/empty.svg'
import SearchHeader from '../solid/SearchHeader'

interface Props {
}

const NotFound: FC<Props> = () => {
  return (
    <Fragment>
      <Banner/>
      <SearchHeader />
      <div className='search-container mt-5 pt-[16px] pb-[62px] flex flex-col items-center bg-white rounded-[10px]'>
        <EmptyIcon width='200' />
        <h2 className='mt-3 text-black text-404-title'>Not Found!</h2>
        <div className='mt-[6px] min-w-[400px] max-w-full'>
          <p className='text-404-tip'>you can search:</p>
          <div className='mt-1 flex items-center gap-5 text-mintPurple text-404-content'>
            <span>[ Community ]</span>
            <span>[ Address ]</span>
            <span>[ Host.Comunity ]</span>
            <span>[ Host.Group.Comunity ]</span>
          </div>
        </div>
      </div>
    </Fragment>
  )
}

export default NotFound