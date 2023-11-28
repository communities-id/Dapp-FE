import { FC, ReactNode } from 'react'
import classnames from 'classnames'

import BaseButton from '@/components/_common/baseButton'

import LoadingIcon from '~@/icons/loading.svg'

export interface Props {
  htmlFor?: string
  size?: 'small' | 'short' | 'normal' | 'medium'
  mode?: 'auto' | 'full'
  theme?: 'primary' | 'black'
  loading?: boolean
  disabled?: boolean
  onClick?: () => void
  className?: string
  wrapClassName?: string
  children?: ReactNode
}

const Button: FC<Props> = ({ htmlFor, size = 'normal', mode = 'auto', theme = 'primary', disabled, loading, onClick, wrapClassName, className, children }) => {
  return (
    <BaseButton
      wrapClassName={wrapClassName}
      className={
        classnames(
          'py-[5px] px-[20px]',
          {
            'rounded-xs': size === 'small',
            'rounded-[17px]': size === 'short',
            'rounded-[20px]': size === 'normal',
            'rounded-[22px]': size === 'medium',
            '!w-full': mode === 'full',
            'whitespace-nowrap': mode === 'auto',
            'bg-primary text-white': theme === 'primary',
            'bg-main-black text-white': theme === 'black',
          },
          className
      )}
      size={size}
      htmlFor={htmlFor}
      disabled={disabled || loading}
      loading={loading}
      onClick={onClick}
    >
      { children }
    </BaseButton>
  )
}

export default Button
