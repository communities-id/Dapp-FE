import { FC } from 'react'
import classnames from 'classnames'

interface Props {
  animate?: boolean
  className?: string
}

const Loading: FC<Props> = ({ animate = true, className }) => {
  return (
    <div className={classnames('w-full', {
      'animate-skeleton-breath': animate
    }, className)}>
      <div className='bg-white pr-[16px] rounded-[8px] flex gap-3 overflow-hidden'>
        <div className='w-[124px] aspect-square bg-sekeleton-dark-gray'></div>
        <div className='flex-1 flex py-[14px] px-[6px] items-center justify-between'>
          <div className='flex-1 flex flex-col justify-between'>
            <div>
              <p className='w-8/12 h-[24px] bg-sekeleton-gray rounded-[4px]'></p>
              <p className='w-4/12 h-[16px] mt-[4px] bg-sekeleton-gray rounded-[4px]'></p>
            </div>
            <div className='mt-[12px] w-full flex items-center gap-[30px]'>
              <div>
                <p className='w-[60px] h-[14px] bg-sekeleton-gray rounded-[4px]'></p>
                <p className='w-[120px] mt-[6px] h-[16px] bg-sekeleton-gray rounded-[4px]'></p>
              </div>
              <p className='w-[1px] h-[20px] bg-sekeleton-gray'></p>
              <div>
                <p className='w-[60px] h-[14px] bg-sekeleton-gray rounded-[4px]'></p>
                <p className='w-[120px] mt-[6px] h-[16px] bg-sekeleton-gray rounded-[4px]'></p>
              </div>
            </div>
          </div>
          <div className='flex flex-col h-full pr-[8px] pb-[8px] justify-end'>
            <ul className='flex gap-[10px]'>
              <li className='w-[20px] h-[20px] rounded-[4px] bg-sekeleton-gray'></li>
              <li className='w-[20px] h-[20px] rounded-[4px] bg-sekeleton-gray'></li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Loading