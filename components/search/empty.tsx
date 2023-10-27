import { FC, ReactNode } from 'react'

import EmptyIcon from '~@/icons/mint/empty.svg'

interface Props {
  text: string | ReactNode
}

const Empty: FC<Props> = ({ text }) => {
  return (
    <div className='pt-[16px] pb-[62px] flex flex-col items-center bg-white rounded-[10px]'>
      <EmptyIcon width='200' />
      <div className='mt-[12px] text-mainGray text-searchdesc'>{ text }</div>
    </div>
  )
}

export default Empty