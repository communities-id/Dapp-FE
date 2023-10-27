import { FC } from 'react'
import classNames from 'classnames'

interface Props {
  mode?: 'horizontal' | 'vertical'
  className?: string
  wrapClassName?: string
}
const DividerLine: FC<Props> = ({ mode = 'vertical', wrapClassName, className }) => {
  return (
    <div className={classNames({
      'w-full my-3': mode === 'vertical',
      'mx-2 w-[1px] h-6': mode === 'horizontal',
    }, wrapClassName)}>
      <div className={classNames({
        'h-[1px] w-full bg-[#F0F0F0]': mode === 'vertical',
        'w-full h-full bg-[#E5E8EB]': mode === 'horizontal',
      }, className)}></div>
    </div>
  )
}

export default DividerLine