import { FC, useState, useEffect } from 'react'
import classnames from 'classnames'

interface Props {
  step: number
  steps: { num: number, label: string }[]
  className?: string
}

const Steps: FC<Props> = ({ step, steps, className }) => {
  const [startAnimate, setStartAnimate] = useState(false)
  useEffect(() => {
    console.log('--- start', step, startAnimate)
    setTimeout(() => {
      setStartAnimate(true)
    }, 0);
  }, [])

  return (
    <ul className={classnames('w-full pb-[18px] flex items-center justify-center', className)}>
      {
        steps.map((item, idx) => {
          return (
            <li key={idx} className={classnames({
              'flex-1': idx > 0,
            })}>
              <div className='flex items-center gap-[2px]'>
                <div className={classnames('flex-1 h-[6px] ml-[2px] bg-stepGray overflow-hidden', {
                  'hidden': idx === 0
                })}>
                  <div className={classnames('w-0 h-full bg-mintPurple transition-width duration-300', {
                    '!w-full': (step === idx && startAnimate) || step > idx,
                  })}></div>
                </div>
                <div className={classnames(
                  'relative inline-flex items-center justify-center w-[24px] h-[24px] rounded-full text-stepNum text-white',
                  {
                    'bg-mintPurple': step >= idx,
                    'bg-stepGray': step < idx,
                  }
                )}>
                  <span>{ item.num }</span>
                  <span className={classnames(
                  'absolute bottom-[-18px] left-0',
                  'text-stepLabel whitespace-nowrap',
                  {
                    'text-mintPurple': step >= idx,
                    'text-stepGray': step < idx,
                  }
                )}>{ item.label }</span>
                </div>
              </div>
            </li>
          )
        })
      }
    </ul>
  )
}

export default Steps