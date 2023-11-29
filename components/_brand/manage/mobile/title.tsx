import { FC } from 'react'

import ArrowLeftIcon from '~@/_brand/arrow-left.svg'

interface Props {
  text: string
  onClick?: () => void
}

const MobileBrandSettingTitle: FC<Props> = ({ text, onClick }) => {
  return (
    <div className='flex-itmc gap-1 px-5' onClick={onClick}>
      <ArrowLeftIcon width='20' height='20' className='text-black-1' />
      <h1 className='text-[22px] leading-[35px] font-bold text-main-black'>{ text }</h1>
    </div>
  )
}

export default MobileBrandSettingTitle