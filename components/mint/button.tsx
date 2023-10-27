import { FC, ReactNode } from 'react'
import classnames from 'classnames'

import LoadingIcon from '~@/icons/loading.svg'

interface Props {
  size: 'fixed' | 'auto' | 'full'
  theme: 'purple' | 'pink'
  loading?: boolean
  disabled?: boolean
  onClick?: () => void
  className?: string
  children?: ReactNode
}

const MintButton: FC<Props> = ({ size = 'fixed', theme = 'purple', disabled, loading, onClick, className, children }) => {
  return (
    <button
      disabled={disabled || loading}
      className={
        classnames(
          'py-[6px] min-w-[110px] h-[46px] !shadow-none text-mintBtn rounded-[32px] disabled:opacity-50 disabled:cursor-not-allowed',
          {
            'w-[138px]': size === 'fixed',
            'w-full': size === 'full',
            'whitespace-nowrap': size === 'auto',
            'text-white bg-mintPurple hover:text-white hover:bg-mintPurpleHover': theme === 'purple',
            'text-mintPurple bg-mintTransparencyPurple hover:bg-mintTransparencyPurpleHover hover:text-mintPurple': theme === 'pink',
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
    </button>
  )
}

export default MintButton
