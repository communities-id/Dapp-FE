import { FC } from 'react'
import classnames from 'classnames'

interface Props {
  personal?: boolean
  animate?: boolean
  className?: string
}

const Loading: FC<Props> = ({ personal, animate = true, className }) => {
  return (
    <div className={classnames('px-10', {
      'animate-skeleton-breath': animate
    }, className)}>
      {
        personal ? (
          <ul className='mb-[20px] flex items-center gap-5'>
            <li className=''>
              <p className='w-20 h-6 bg-sekeleton-dark-gray rounded-[4px]'></p>
            </li>
            <li className=''>
              <p className='w-20 h-6 bg-sekeleton-dark-gray rounded-[4px]'></p>
            </li>
          </ul>
        ) : null
      }
      <ul className='card-grid grid gap-5'>
        {
          Array.from({ length: 20 }).map((_, index) => (
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