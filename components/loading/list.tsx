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
      <ul className='grid grid-cols-4 gap-5'>
        {
          Array.from({ length: 4 }).map((_, index) => (
            <li key={index} className='flex flex-col overflow-hidden rounded-[8px] bg-white'>
              <div className='w-full aspect-square bg-sekeleton-dark-gray'></div>
              <div className='p-[14px] bg-white'>
                <p className='h-[22px] rounded-[4px] bg-sekeleton-gray'></p>
                <p className='mt-[6px] h-[18px] w-4/12 rounded-[4px] bg-sekeleton-gray'></p>
              </div>
            </li>
          ))
        }
      </ul>
    </div>
  )
}

export default Loading