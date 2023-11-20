import { FC, ReactNode } from 'react'
import classnames from 'classnames'

import LoadingIcon from '~@/icons/loading.svg'

export interface Props {
  size?: 'small' | 'short' | 'normal' | 'medium'
  mode?: 'auto' | 'full'
  theme?: 'primary' | 'black'
  loading?: boolean
  disabled?: boolean
  onClick?: () => void
  className?: string
  children?: ReactNode
}

const Button: FC<Props> = ({ size = 'auto', mode = 'auto', theme = 'primary', disabled, loading, onClick, className, children }) => {
  return (
    <button
      disabled={disabled || loading}
      className={
        classnames(
          'py-[5px] px-[20px] !shadow-none disabled:opacity-50 disabled:cursor-not-allowed',
          {
            'h-[24px] rounded-xs text-xs-b': size === 'small',
            'h-[34px] rounded-[17px] text-xs-b': size === 'short',
            'h-[40px] rounded-[20px] text-sm-b': size === 'normal',
            'h-[44px] rounded-[22px] text-md !font-bold': size === 'medium',
            '!w-full': mode === 'full',
            'whitespace-nowrap': size === 'auto',
            'bg-primary text-white': theme === 'primary',
            'bg-main-black text-white': theme === 'black',
          },
          className
        )
      }
      onClick={() => {
        if (loading) return
        onClick?.()
      }}>
      {
        loading ? (
          <div className='w-full h-full flex items-center justify-center'>
            <LoadingIcon width='28' height='28'/>
          </div>
        ) : children
      }
    </button>
  )
}

export default Button
