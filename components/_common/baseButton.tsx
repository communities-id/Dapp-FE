import { FC, ReactNode } from 'react'
import classnames from 'classnames'

import LoadingIcon from '~@/icons/loading.svg'

export interface Props {
  htmlFor?: string
  size?: 'small' | 'short' | 'normal' | 'medium'
  loading?: boolean
  disabled?: boolean
  onClick?: () => void
  className?: string
  wrapClassName?: string
  children?: ReactNode
}

const BaseButton: FC<Props> = ({ htmlFor, size = 'auto', disabled, loading, onClick, wrapClassName, className, children }) => {
  return (
    <label htmlFor={htmlFor} className={classnames('group inline-block cursor-pointer', wrapClassName)}>
      <button
        disabled={disabled || loading}
        className={
          classnames(
            'relative flex-center !shadow-none disabled:opacity-20 disabled:cursor-not-allowed',
            {
              'h-[24px] text-xs-b': size === 'small',
              'h-[34px] text-xs-b': size === 'short',
              'h-[40px] text-sm-b': size === 'normal',
              'h-[44px] text-md !font-bold': size === 'medium',
              'pointer-events-none': htmlFor
            },
            className
          )
        }
        onClick={onClick}>
        {
          loading ? (
            <div className='w-full h-full flex items-center justify-center'>
              <LoadingIcon width='28' height='28'/>
            </div>
          ) : children
        }
        <div className='group-hover:visible invisible absolute top-0 left-0 w-full h-full z-1 select-none pointer-events-none bg-white-tr-20'></div>
      </button>
    </label>
  )
}

export default BaseButton
