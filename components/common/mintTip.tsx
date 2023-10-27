import { FC } from 'react'

interface Props {
  label?: string
  text: string
  onClick?: () => void
}

const MintTip: FC<Props> = ({ text, label = 'Please go community  finsh...', onClick }) => {
  return (
    <div className='py-[10px] px-4 flex items-center justify-between bg-mint-tip rounded-[6px]'>
      <p className='text-mint-tip'>{ label }</p>
      <button type="button" className='px-[16px] text-mint-tip-btn bg-mint-tip-btn rounded-[4px]' onClick={onClick}>{ text }</button>
    </div>
  )
}

export default MintTip