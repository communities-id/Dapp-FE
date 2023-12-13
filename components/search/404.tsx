import { FC, Fragment } from 'react'

import Banner from '@/components/search/banner'

import EmptyIcon from '~@/icons/mint/empty.svg'
import SearchHeader from '../solid/SearchHeader'

interface Props {
}

const NotFound: FC<Props> = () => {
  return (
    <Fragment>
      <SearchHeader />
      <Banner className='mt-[-136px] sm:hidden' />
      <div className='dapp-container mt-5 sm:mt-20 pt-[16px] pb-[62px] flex flex-col items-center bg-white rounded-[10px]'>
        <EmptyIcon width='200' />
        <h2 className='mt-3 text-black text-404-title'>Not Found!</h2>
        <div className='mt-[6px] pc:min-w-[400px] max-w-full sm:mt-5'>
          <p className='text-404-tip sm:text-center'>you can search:</p>
          <div className='mt-1 flex items-center gap-5 text-mintPurple text-404-content sm:flex-col'>
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