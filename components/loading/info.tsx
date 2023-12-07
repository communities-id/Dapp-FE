import { FC, Fragment } from 'react'
import classnames from 'classnames'

interface Props {
  personal?: boolean // person
  animate?: boolean
  className?: string
}

const Loading: FC<Props> = ({ personal, animate = true, className }) => {
  return (
    <div className={classnames('relative pt-[40px] pb-5 px-10 py-4', {
      'animate-skeleton-breath': animate
    }, className)}>
      <div className='w-[120px] h-[120px] absolute top-[-60px] rounded-[12px] bg-sekeleton-gray'></div>
      <div className='flex items-center justify-between'>
        <p className='w-[118px] h-[26px] bg-sekeleton-gray'></p>
      </div>
      <div className='mt-3 flex flex-col gap-[6px]'>
        <p className='w-[40%] h-[16px] bg-sekeleton-gray'></p>
        <p className='mt-2 w-[10%] h-[16px] bg-sekeleton-gray'></p>
      </div>
      {
        !personal ? (
          <Fragment>
            <div className='mt-[30px] py-[6px] flex items-center gap-[50px]'>
              {
                Array.from({ length: 4 }).map((_, index) => (
                  <div key={index} className='flex flex-col'>
                    <p className='w-[100px] h-[16px] rounded-[4px] bg-sekeleton-gray'></p>
                    <p className='mt-1 w-[160px] h-[20px] rounded-[4px] bg-sekeleton-gray'></p>
                  </div>
                ))
              }
            </div>
            <p className='my-3 h-[1px] bg-sekeleton-gray'></p>
            <div className='mt-3 py-[6px] flex items-center gap-[50px]'>
              {
                Array.from({ length: 4 }).map((_, index) => (
                  <div key={index} className='flex flex-col'>
                    <p className='w-[100px] h-[16px] rounded-[4px] bg-sekeleton-gray'></p>
                    <p className='mt-1 w-[160px] h-[20px] rounded-[4px] bg-sekeleton-gray'></p>
                  </div>
                ))
              }
            </div>
          </Fragment>
        ) : null
      }
    </div>
  )
}

export default Loading