import { FC } from 'react'
import classNames from 'classnames'

interface Props {
  label?: string
  step: number
  totalStep: number
  handleChangeStep?: (step: number) => void
}

const StepLite: FC<Props> = ({ label, step, totalStep, handleChangeStep }) => {
  const stepList = Array.from({ length: totalStep }, (_, i) => i + 1)

  return (
    <div className='flex flex-col items-start justify-start gap-2'>
      { label && <div className='text-stepLabel'>{label}</div> }
      <ul className='flex items-center gap-1'>
        {
          stepList.map((i) => {
            return (
              <li
                key={i}
                className={
                  classNames('w-[10px] h-[10px] rounded-full bg-stepGray cursor-pointer', {
                    '!bg-mintPurple': i <= step,
                  })
                }
                onClick={() => handleChangeStep?.(i)}
              ></li>
            )
          })
        }
      </ul>
    </div>
  )
}

export default StepLite